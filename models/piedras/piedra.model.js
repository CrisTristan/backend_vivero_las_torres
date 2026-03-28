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

  async updatePiedraById(piedraId, piedraData) {
    const { data: existingPiedra, error: existingPiedraError } = await supabase
      .from("piedras")
      .select("id, producto_id")
      .eq("id", piedraId)
      .maybeSingle();

    if (existingPiedraError) {
      throw new Error(`Error al obtener la piedra: ${existingPiedraError.message}`);
    }

    if (!existingPiedra) {
      return null;
    }

    const allowedPiedraFields = ["descripcion", "producto_id", "esPiedraSuelta"];
    const piedraUpdates = {};

    for (const field of allowedPiedraFields) {
      if (piedraData[field] !== undefined) {
        piedraUpdates[field] = piedraData[field];
      }
    }

    if (piedraUpdates.descripcion !== undefined) {
      if (typeof piedraUpdates.descripcion === "string") {
        piedraUpdates.descripcion = { descripcion: piedraUpdates.descripcion };
      } else if (typeof piedraUpdates.descripcion === "object") {
        const normalizedDescription = piedraUpdates.descripcion?.descripcion;
        piedraUpdates.descripcion = {
          descripcion:
            normalizedDescription === undefined
              ? ""
              : String(normalizedDescription),
        };
      }
    }

    if (Object.keys(piedraUpdates).length > 0) {
      const { error: updatePiedraError } = await supabase
        .from("piedras")
        .update(piedraUpdates)
        .eq("id", piedraId);

      if (updatePiedraError) {
        throw new Error(`Error al actualizar la piedra: ${updatePiedraError.message}`);
      }
    }

    const productPayload = piedraData.productos || piedraData.producto;
    const allowedProductFields = ["nombre", "precio", "imagen", "categoria_id", "stock"];
    const productUpdates = {};

    if (productPayload && typeof productPayload === "object") {
      for (const field of allowedProductFields) {
        if (productPayload[field] !== undefined) {
          productUpdates[field] = productPayload[field];
        }
      }

      if (productPayload.categorias?.id !== undefined) {
        productUpdates.categoria_id = productPayload.categorias.id;
      }
    }

    const resolvedProductId =
      piedraUpdates.producto_id ?? productPayload?.id ?? existingPiedra.producto_id;

    if (Object.keys(productUpdates).length > 0) {
      if (!resolvedProductId) {
        throw new Error(
          "No se encontró producto_id para actualizar los datos del producto.",
        );
      }

      const { error: updateProductError } = await supabase
        .from("productos")
        .update(productUpdates)
        .eq("id", resolvedProductId);

      if (updateProductError) {
        throw new Error(`Error al actualizar el producto: ${updateProductError.message}`);
      }
    }

    const { data: updatedPiedra, error: updatedPiedraError } = await supabase
      .from("piedras")
      .select(
        "id, descripcion, esPiedraSuelta, producto_id, productos:productos!inner(id, nombre, precio, imagen, categoria_id, stock, categorias(categoria, id))",
      )
      .eq("id", piedraId)
      .maybeSingle();

    if (updatedPiedraError) {
      throw new Error(`Error al obtener la piedra actualizada: ${updatedPiedraError.message}`);
    }

    return updatedPiedra;
  }
}
