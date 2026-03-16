import jwt from 'jsonwebtoken';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'dev_access_secret';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret';
const ACCESS_EXPIRES = '2m'; // 2 minutos para pruebas, ajustar según necesidades
const REFRESH_EXPIRES = '7d';

function signAccessToken(user) {
  return jwt.sign(
    { sub: user.id, correo: user.correo },
    ACCESS_SECRET,
    { expiresIn: ACCESS_EXPIRES }
  );
}

function signRefreshToken(user) {
  return jwt.sign(
    { sub: user.id, correo: user.correo, type: 'refresh' },
    REFRESH_SECRET,
    { expiresIn: REFRESH_EXPIRES }
  );
}

function sanitizeUser(user) {
  const { password_hashed, password, ...safe } = user;
  return safe;
}

// Middleware para proteger rutas
function verifyAccessToken(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token requerido' });
  }

  const token = auth.slice(7);
  try {
    const payload = jwt.verify(token, ACCESS_SECRET);
    req.userId = payload.sub;
    req.auth = payload;
    // //imprimir el req completo para verificar que se está guardando el correo en req.auth
    console.log(`[AUTH] Token verificado para usuario: ${req.userId}, correo: ${req.auth.correo}`);
    next();
  } catch {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
}

function verifyRefreshToken(token) {
  const payload = jwt.verify(token, REFRESH_SECRET);
  if (payload.type !== 'refresh') {
    throw new Error('Tipo de token inválido');
  }
  return payload;
}

export { signAccessToken, signRefreshToken, sanitizeUser, verifyAccessToken, verifyRefreshToken };