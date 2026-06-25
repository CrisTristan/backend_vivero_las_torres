import UserModel from '../models/user.model.ts';
import bcrypt from 'bcrypt';
import type {UserRecord} from '../models/user.model.ts';

function createHttpError(message, statusCode) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
}


export default class UserController{

    nombre: string;
    apellidos: string;
    correo: string;
    password: string;
    telefono: string;

    constructor(nombre : string, apellidos: string, correo: string, password: string, telefono: string) {
        this.nombre = nombre;
        this.apellidos = apellidos;
        this.correo = correo;
        this.password = password;
        this.telefono = telefono;
    }

    async createUser() {
        //hashear contraseña antes de guardar
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password, salt);
        const user = new UserModel(this.nombre, this.apellidos, this.correo, hashedPassword, this.rol_usuario, this.telefono);
        const data = await user.createUser();
        return data;
    }

    async getUserByEmail() {
        const user = new UserModel(null, null, this.correo, null);
        // console.log("Obteniendo usuario por correo:", user.correo);
        const data = await user.getUserByEmail();
        // console.log("Datos obtenidos por correo:", data);
        return data;
    }

    async getUserById(userId: number) : Promise<UserRecord | null> {
        const user = new UserModel('', '', '', '', '', '');
        const data = await user.getUserById(userId);
        return data;
    }

    async getPasswordHashByEmail() {
        const user = new UserModel(null, null, this.correo, null);
        const data = await user.getPasswordHashByEmail();
        return data;
    }
    
    async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }

    async login() {
        const userData = await this.getUserByEmail();
        if (!userData) {
            throw createHttpError('El correo no está registrado', 404);
        }

        const userPasswordHashData = await this.getPasswordHashByEmail();
        // if (!userPasswordHashData) {
        //     throw createHttpError('Usuario no encontrado', 404);
        // }

        const isPasswordValid = await this.verifyPassword(this.password, userPasswordHashData.password_hashed);
        if (!isPasswordValid) {
            throw createHttpError('Contraseña incorrecta', 401);
        }
        return userData;
    }

    async getAllAdminsWithEmailNotificacionEnabled() {
        const admins = new UserModel(null, null, null, null);
        const data = await admins.getAllAdminsWithEmailNotificacionEnabled();
        return data;
    }

    async modifyEmailNotificationPreference(userId, permitir_notificaciones_email) {
        const user = new UserModel(null, null, null, null);
        const data = await user.modifyEmailNotificationPreference(userId, permitir_notificaciones_email);
        return data;
    }
}