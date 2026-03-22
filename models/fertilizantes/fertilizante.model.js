import { supabase } from "../../database/supaBaseConnection.js";

export default class FertilizanteModel {
  async createNewFertilizer(payload) {
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

    const fertilizerData = {
      producto_id: createdProductId,
      descripcion: {
        descripcion: payload.descripcion,
      },
    };

    const { data: createdFertilizerData, error: createFertilizerError } = await supabase
      .from("fertilizantes")
      .insert([fertilizerData])
      .select("id")
      .maybeSingle();

    if (createFertilizerError) {
      await supabase.from("productos").delete().eq("id", createdProductId);
      throw new Error(`Error al crear el fertilizante: ${createFertilizerError.message}`);
    }

    const { data: createdFertilizer, error: createdFertilizerFetchError } = await supabase
      .from("fertilizantes")
      .select(
        "id, descripcion, producto_id, productos:productos!inner(id, nombre, precio, imagen, categoria_id, stock, categorias(categoria, id))",
      )
      .eq("id", createdFertilizerData.id)
      .maybeSingle();

    if (createdFertilizerFetchError) {
      throw new Error(
        `Error al obtener el fertilizante creado: ${createdFertilizerFetchError.message}`,
      );
    }

    return createdFertilizer;
  }
}
