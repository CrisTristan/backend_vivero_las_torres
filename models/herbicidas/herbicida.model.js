import { supabase } from "../../database/supaBaseConnection.js";

export default class HerbicidaModel {
  async createNewHerbicide(payload) {
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

    const herbicideData = {
      producto_id: createdProductId,
      descripcion: {
        descripcion: payload.descripcion,
      },
    };

    const { data: createdHerbicideData, error: createHerbicideError } = await supabase
      .from("herbicidas")
      .insert([herbicideData])
      .select("id")
      .maybeSingle();

    if (createHerbicideError) {
      await supabase.from("productos").delete().eq("id", createdProductId);
      throw new Error(`Error al crear el herbicida: ${createHerbicideError.message}`);
    }

    const { data: createdHerbicide, error: createdHerbicideFetchError } = await supabase
      .from("herbicidas")
      .select(
        "id, descripcion, producto_id, productos:productos!inner(id, nombre, precio, imagen, categoria_id, stock, categorias(categoria, id))",
      )
      .eq("id", createdHerbicideData.id)
      .maybeSingle();

    if (createdHerbicideFetchError) {
      throw new Error(
        `Error al obtener el herbicida creado: ${createdHerbicideFetchError.message}`,
      );
    }

    return createdHerbicide;
  }
}
