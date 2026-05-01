import Router from 'express';
import UserController from '../../controllers/user.controller.js';
import EmailVerificationController from '../../controllers/verificarCorreoUsuario/emailVerification.controller.js';
import sendVerificationEmailController from '../../controllers/email/sendVerificationEmail.controller.js';
import { 
    signAccessToken, 
    signRefreshToken, 
    sanitizeUser, 
    verifyAccessToken, 
    verificarUserRoleAdmin, 
    verifyRefreshToken 
} from '../../Tokens/JsonWebTokens.js';

const router = Router();

router.post('/auth/registerUser', async (req, res) => {
    try {
        const { nombre, apellidos, telefono, correo, password } = req.body;

        if (!nombre || !apellidos || !telefono || !correo || !password) {
            return res.status(400).send({ error: 'Todos los campos son obligatorios' });
        }

        const user = new UserController(nombre, apellidos, correo, password, telefono);
        const data = await user.createUser();
        const createdUser = Array.isArray(data) ? data[0] : data;
        console.log("Usuario creado:", createdUser);
        if (!createdUser) {
            return res.status(500).json({ error: 'No se pudo crear el usuario' });
        }

        const accessToken = signAccessToken(createdUser);
        const refreshToken = signRefreshToken(createdUser);

        //Mandar correo de verificación al usuario recién registrado
        const emailController = new EmailVerificationController();
        const sendVerificationEmail = new sendVerificationEmailController();
        const verificationToken = await emailController.saveVerificationToken(createdUser.id);
        await sendVerificationEmail.sendVerificationEmail(correo, verificationToken.verification_token);

        return res.status(201).json({
            user: sanitizeUser(createdUser),
            accessToken,
            refreshToken,
        });

    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

router.post('/auth/loginUser', async (req, res) => {
    try {
        const { correo, password } = req.body;
        if (!correo || !password) {
            return res.status(400).send({ error: 'Correo y contraseña son obligatorios' });
        }
        const user = new UserController(null, null, correo, password, null);
        const data = await user.login();

        const accessToken = signAccessToken(data);
        const refreshToken = signRefreshToken(data);

        //Verificar si el correo del usuario está verificado antes de permitir el login
        if (data.correo_verificado === false) {
            return res.status(403).json({ error: 'Correo no verificado. Por favor verifica tu correo antes de iniciar sesión.' });
        }

        return res.json({
            user: sanitizeUser(data),
            accessToken,
            refreshToken,
        });

    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).send({ error: error.message });
    }
});

// GET /me - Ruta protegida para obtener información del usuario autenticado
router.get('/auth/me', verifyAccessToken, async (req, res) => {
    try {
        const userController = new UserController(null, null, req.auth?.correo, null);
        const user = await userController.getUserByEmail();

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        return res.json({ user: sanitizeUser(user) });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

//verificar el rol del usuario para acceder a rutas administrativas
//hacer la verificación con el token y el correo guardado en el token para obtener el usuario y verificar su rol
router.get('/auth/admin', verifyAccessToken, verificarUserRoleAdmin, async (req, res) => {
    try {
        const userController = new UserController(null, null, req.auth?.correo, null);
        const user = await userController.getUserByEmail();

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // El rol ya fue verificado por el middleware, no lo hagas de nuevo
        return res.json({ message: 'Bienvenido, admin!', user: sanitizeUser(user) });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

router.post('/auth/refreshToken', async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        console.warn('[AUTH][REFRESH] Solicitud sin refresh token');
        return res.status(401).json({ message: 'Refresh token requerido' });
    }

    try {
        console.log('[AUTH][REFRESH] Intento de refresh recibido desde el frontend');
        //verificar el refresh token y obtener el correo del usuario
        const payload = verifyRefreshToken(refreshToken);
        console.log(`[AUTH][REFRESH] Token válido para usuario: ${payload.correo}`);

        const userController = new UserController(null, null, payload.correo, null);
        const user = await userController.getUserByEmail();

        if (!user) {
            console.warn(`[AUTH][REFRESH] Usuario no encontrado para correo: ${payload.correo}`);
            return res.status(401).json({ message: 'Usuario inválido' });
        }

        const newAccessToken = signAccessToken(user);
        console.log(`[AUTH][REFRESH] Nuevo access token generado para usuario: ${user.correo} de tipo refresh`);
        return res.json({ accessToken: newAccessToken });
    } catch (error) {
        console.error('[AUTH][REFRESH] Error al refrescar token:', error.message);
        return res.status(401).json({ message: 'Refresh token inválido o expirado' });
    }
});

export default router;
