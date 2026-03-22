import { supabase } from "../../database/supaBaseConnection.js";

export default class PiedraModel {
  async createNewStone(payload) {
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

    const stoneData = {
      producto_id: createdProductId,
      descripcion: {
        descripcion: payload.descripcion,
      },
      esPiedraSuelta: Boolean(payload.esPiedraSuelta),
    };

    const { data: createdStoneData, error: createStoneError } = await supabase
      .from("piedras")
      .insert([stoneData])
      .select("id")
      .maybeSingle();

    if (createStoneError) {
      await supabase.from("productos").delete().eq("id", createdProductId);
      throw new Error(`Error al crear la piedra: ${createStoneError.message}`);
    }

    const { data: createdStone, error: createdStoneFetchError } = await supabase
      .from("piedras")
      .select(
        "id, descripcion, esPiedraSuelta, producto_id, productos:productos!inner(id, nombre, precio, imagen, categoria_id, stock, categorias(categoria, id))",
      )
      .eq("id", createdStoneData.id)
      .maybeSingle();

    if (createdStoneFetchError) {
      throw new Error(
        `Error al obtener la piedra creada: ${createdStoneFetchError.message}`,
      );
    }

    return createdStone;
  }
}
