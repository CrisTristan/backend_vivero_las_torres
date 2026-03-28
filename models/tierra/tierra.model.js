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

  async updateTierraById(tierraId, tierraData) {
    const { data: existingTierra, error: existingTierraError } = await supabase
      .from("tierra")
      .select("id, producto_id")
      .eq("id", tierraId)
      .maybeSingle();

    if (existingTierraError) {
      throw new Error(`Error al obtener la tierra: ${existingTierraError.message}`);
    }

    if (!existingTierra) {
      return null;
    }

    const allowedTierraFields = ["descripcion", "producto_id"];
    const tierraUpdates = {};

    for (const field of allowedTierraFields) {
      if (tierraData[field] !== undefined) {
        tierraUpdates[field] = tierraData[field];
      }
    }

    if (tierraUpdates.descripcion !== undefined) {
      if (typeof tierraUpdates.descripcion === "string") {
        tierraUpdates.descripcion = { descripcion: tierraUpdates.descripcion };
      } else if (typeof tierraUpdates.descripcion === "object") {
        const normalizedDescription = tierraUpdates.descripcion?.descripcion;
        tierraUpdates.descripcion = {
          descripcion:
            normalizedDescription === undefined
              ? ""
              : String(normalizedDescription),
        };
      }
    }

    if (Object.keys(tierraUpdates).length > 0) {
      const { error: updateTierraError } = await supabase
        .from("tierra")
        .update(tierraUpdates)
        .eq("id", tierraId);

      if (updateTierraError) {
        throw new Error(`Error al actualizar la tierra: ${updateTierraError.message}`);
      }
    }

    const productPayload = tierraData.productos || tierraData.producto;
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
      tierraUpdates.producto_id ?? productPayload?.id ?? existingTierra.producto_id;

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

    const { data: updatedTierra, error: updatedTierraError } = await supabase
      .from("tierra")
      .select(
        "id, descripcion, producto_id, productos:productos!inner(id, nombre, precio, imagen, categoria_id, stock, categorias(categoria, id))",
      )
      .eq("id", tierraId)
      .maybeSingle();

    if (updatedTierraError) {
      throw new Error(`Error al obtener la tierra actualizada: ${updatedTierraError.message}`);
    }

    return updatedTierra;
  }
}
