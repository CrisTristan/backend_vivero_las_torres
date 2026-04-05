import { supabase } from "../../database/supaBaseConnection.js";

export default class PastoModel {
  async deletePastoById(pastoId) {
    const { data: pasto, error: pastoError } = await supabase
      .from("pasto")
      .select("id, producto_id")
      .eq("id", pastoId)
      .maybeSingle();
    if (pastoError) throw new Error(`Error al buscar el pasto: ${pastoError.message}`);
    if (!pasto) return null;
    const { error: deletePastoError } = await supabase
      .from("pasto")
      .delete()
      .eq("id", pastoId);
    if (deletePastoError) throw new Error(`Error al eliminar el pasto: ${deletePastoError.message}`);
    if (pasto.producto_id) {
      await supabase.from("productos").delete().eq("id", pasto.producto_id);
    }
    return true;
  }
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

  async updatePastoById(pastoId, pastoData) {
    const { data: existingPasto, error: existingPastoError } = await supabase
      .from("pasto")
      .select("id, producto_id")
      .eq("id", pastoId)
      .maybeSingle();

    if (existingPastoError) {
      throw new Error(`Error al obtener el pasto: ${existingPastoError.message}`);
    }

    if (!existingPasto) {
      return null;
    }

    const allowedPastoFields = ["descripcion", "producto_id", "tipo", "nivel_cuidado"];
    const pastoUpdates = {};

    for (const field of allowedPastoFields) {
      if (pastoData[field] !== undefined) {
        pastoUpdates[field] = pastoData[field];
      }
    }

    if (pastoUpdates.descripcion !== undefined) {
      if (typeof pastoUpdates.descripcion === "string") {
        pastoUpdates.descripcion = { descripcion: pastoUpdates.descripcion };
      } else if (typeof pastoUpdates.descripcion === "object") {
        const normalizedDescription = pastoUpdates.descripcion?.descripcion;
        pastoUpdates.descripcion = {
          descripcion:
            normalizedDescription === undefined
              ? ""
              : String(normalizedDescription),
        };
      }
    }

    if (Object.keys(pastoUpdates).length > 0) {
      const { error: updatePastoError } = await supabase
        .from("pasto")
        .update(pastoUpdates)
        .eq("id", pastoId);

      if (updatePastoError) {
        throw new Error(`Error al actualizar el pasto: ${updatePastoError.message}`);
      }
    }

    const productPayload = pastoData.productos || pastoData.producto;
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
      pastoUpdates.producto_id ?? productPayload?.id ?? existingPasto.producto_id;

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

    const { data: updatedPasto, error: updatedPastoError } = await supabase
      .from("pasto")
      .select(
        "id, descripcion, producto_id, productos:productos!inner(id, nombre, precio, imagen, categoria_id, stock, categorias(categoria, id))",
      )
      .eq("id", pastoId)
      .maybeSingle();

    if (updatedPastoError) {
      throw new Error(`Error al obtener el pasto actualizado: ${updatedPastoError.message}`);
    }

    return updatedPasto;
  }

  async getPastoProductById(pastoId) {
    const { data, error } = await supabase
      .from("pasto")
      .select(
        "id, descripcion, producto_id, productos:productos!inner(id, nombre, precio, imagen, categoria_id, stock, categorias(categoria, id))",
      )
      .eq("id", pastoId)
      .maybeSingle();

    if (error) {
      throw new Error(`Error al obtener el pasto: ${error.message}`);
    }

    return data;
  }
}
