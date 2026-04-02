import UserShippingDataModel from "../../models/userShippingData/userShippingData.model.js";

export default class UserShippingDataController {

    constructor(){};

    async createUserShippingData({
        usuario_id,
        region,
        manzana,
        lote,
        colonia,
        calle,
        numero_interior,
        numero_exterior,
        codigo_postal,
        referencia
    }) {
        const userShippingDataModel = new UserShippingDataModel();
        return await userShippingDataModel.createUserShippingData({
            usuario_id,
            region,
            manzana,
            lote,
            colonia,
            calle,
            numero_interior,
            numero_exterior,
            codigo_postal,
            referencia
        });
    }

    async getUserShippingDataByUserId(usuario_id) {
        const userShippingDataModel = new UserShippingDataModel();
        return await userShippingDataModel.getUserShippingDataByUserId(usuario_id);
    }

    async updateUserShippingDataById(id, {
        region,
        manzana,
        lote,
        colonia,
        calle,
        numero_interior,
        numero_exterior,
        codigo_postal,
        referencia
    }) {
        const userShippingDataModel = new UserShippingDataModel();
        return await userShippingDataModel.updateUserShippingDataById(id, {
            region,
            manzana,
            lote,
            colonia,
            calle,
            numero_interior,
            numero_exterior,
            codigo_postal,
            referencia
        });
    }

    async deleteUserShippingDataById(id) {
        const userShippingDataModel = new UserShippingDataModel();
        return await userShippingDataModel.deleteUserShippingDataById(id);
    }

}