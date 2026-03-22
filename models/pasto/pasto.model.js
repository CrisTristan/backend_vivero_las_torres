import { supabase } from "../../database/supaBaseConnection.js";

export default class PastoModel {
  async createNewGrass(payload) {
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

    const grassData = {
      producto_id: createdProductId,
      descripcion: {
        descripcion: payload.descripcion,
      },
    };

    const { data: createdGrassData, error: createGrassError } = await supabase
      .from("pasto")
      .insert([grassData])
      .select("id")
      .maybeSingle();

    if (createGrassError) {
      await supabase.from("productos").delete().eq("id", createdProductId);
      throw new Error(`Error al crear el pasto: ${createGrassError.message}`);
    }

    const { data: createdGrass, error: createdGrassFetchError } = await supabase
      .from("pasto")
      .select(
        "id, descripcion, producto_id, productos:productos!inner(id, nombre, precio, imagen, categoria_id, stock, categorias(categoria, id))",
      )
      .eq("id", createdGrassData.id)
      .maybeSingle();

    if (createdGrassFetchError) {
      throw new Error(
        `Error al obtener el pasto creado: ${createdGrassFetchError.message}`,
      );
    }

    return createdGrass;
  }
}
