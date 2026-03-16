import UserModel from '../models/user.model.js';
import bcrypt from 'bcrypt';

function createHttpError(message, statusCode) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
}


export default class UserController{
    constructor(nombre, apellidos, correo, password) {
        this.nombre = nombre;
        this.apellidos = apellidos;
        this.correo = correo;
        this.password = password;
    }

    async createUser() {
        //hashear contraseña antes de guardar
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password, salt);
        const user = new UserModel(this.nombre, this.apellidos, this.correo, hashedPassword, this.rol_usuario);
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

    async getPasswordHashByEmail() {
        const user = new UserModel(null, null, this.correo, null);
        const data = await user.getPasswordHashByEmail();
        return data;
    }
    
    async verifyPassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }

    async login() {
        const userData = await this.getUserByEmail();
        if (!userData) {
            throw createHttpError('Usuario no encontrado', 404);
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
}