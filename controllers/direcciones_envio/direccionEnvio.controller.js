import DireccionEnvioModel from "../../models/direcciones_envio/direccionEnvio.model.js";

export default class DireccionEnvioController {

    constructor(){};

    async createDireccionEnvioByOrderId({
        orden_id,
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
        // console.log("Creando dirección de envío con los siguientes datos:", {
        //     orden_id,
        //     region,
        //     manzana,
        //     lote,
        //     colonia,
        //     calle,
        //     numero_interior,
        //     numero_exterior,
        //     codigo_postal,
        //     referencia
        // });
        const direccionEnvioModel = new DireccionEnvioModel();
        return await direccionEnvioModel.createDireccionEnvioByOrderId({
            orden_id,
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
}
