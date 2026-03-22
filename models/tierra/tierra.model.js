import { supabase } from "../../database/supaBaseConnection.js";

export default class TierraModel {
  async createNewSoil(payload) {
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

    const soilData = {
      producto_id: createdProductId,
      descripcion: {
        descripcion: payload.descripcion,
      },
    };

    const { data: createdSoilData, error: createSoilError } = await supabase
      .from("tierra")
      .insert([soilData])
      .select("id")
      .maybeSingle();

    if (createSoilError) {
      await supabase.from("productos").delete().eq("id", createdProductId);
      throw new Error(`Error al crear la tierra: ${createSoilError.message}`);
    }

    const { data: createdSoil, error: createdSoilFetchError } = await supabase
      .from("tierra")
      .select(
        "id, descripcion, producto_id, productos:productos!inner(id, nombre, precio, imagen, categoria_id, stock, categorias(categoria, id))",
      )
      .eq("id", createdSoilData.id)
      .maybeSingle();

    if (createdSoilFetchError) {
      throw new Error(
        `Error al obtener la tierra creada: ${createdSoilFetchError.message}`,
      );
    }

    return createdSoil;
  }
}
