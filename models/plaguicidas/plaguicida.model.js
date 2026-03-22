import { supabase } from "../../database/supaBaseConnection.js";

export default class PlaguicidaModel {
  async createNewPesticide(payload) {
    const categoriaSeleccionada = payload.categoriaSeleccionada;
    const categoriaId =
      typeof categoriaSeleccionada === "object"
        ? categoriaSeleccionada?.id
        : categoriaSeleccionada;

    const productData = {
      nombre: payload.nombre,
      precio: payload.precio,
      imagen: payload.imagen,
      stock: payload.stock,
      categoria_id: categoriaId,
    };

    const { data: createdProductData, error: createProductError } = await supabase
      .from("productos")
      .insert([productData])
      .select("id")
      .maybeSingle();

    if (createProductError) {
      throw new Error(`Error al crear el producto: ${createProductError.message}`);
    }

    const createdProductId = createdProductData?.id;

    if (!createdProductId) {
      throw new Error("No se pudo obtener el id del producto creado.");
    }

    const pesticideData = {
      producto_id: createdProductId,
      descripcion: {
        descripcion: payload.descripcion,
      },
    };

    const { data: createdPesticideData, error: createPesticideError } = await supabase
      .from("plaguicidas")
      .insert([pesticideData])
      .select("id")
      .maybeSingle();

    if (createPesticideError) {
      await supabase.from("productos").delete().eq("id", createdProductId);
      throw new Error(`Error al crear el plaguicida: ${createPesticideError.message}`);
    }

    const { data: createdPesticide, error: createdPesticideFetchError } = await supabase
      .from("plaguicidas")
      .select(
        "id, descripcion, producto_id, productos:productos!inner(id, nombre, precio, imagen, categoria_id, stock, categorias(categoria, id))",
      )
      .eq("id", createdPesticideData.id)
      .maybeSingle();

    if (createdPesticideFetchError) {
      throw new Error(
        `Error al obtener el plaguicida creado: ${createdPesticideFetchError.message}`,
      );
    }

    return createdPesticide;
  }
}
