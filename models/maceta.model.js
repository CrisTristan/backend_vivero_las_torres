import { supabase } from "../database/supaBaseConnection.js";

export default class MacetaModel {
  async createNewPot(payload) {
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

    const potData = {
      producto_id: createdProductId,
      descripcion: {
        descripcion: payload.descripcion,
      },
    };

    const { data: createdPotData, error: createPotError } = await supabase
      .from("macetas")
      .insert([potData])
      .select("id")
      .maybeSingle();

    if (createPotError) {
      await supabase.from("productos").delete().eq("id", createdProductId);
      throw new Error(`Error al crear la maceta: ${createPotError.message}`);
    }

    const { data: createdPot, error: createdPotFetchError } = await supabase
      .from("macetas")
      .select(
        "id, descripcion, producto_id, productos:productos!inner(id, nombre, precio, imagen, categoria_id, stock, categorias(categoria, id))",
      )
      .eq("id", createdPotData.id)
      .maybeSingle();

    if (createdPotFetchError) {
      throw new Error(
        `Error al obtener la maceta creada: ${createdPotFetchError.message}`,
      );
    }

    return createdPot;
  }
}