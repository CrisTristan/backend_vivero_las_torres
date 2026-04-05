import { supabase } from "../database/supaBaseConnection.js";

export default class MacetaModel {
  async deleteMacetaById(macetaId) {
    const { data: maceta, error: macetaError } = await supabase
      .from("macetas")
      .select("id, producto_id")
      .eq("id", macetaId)
      .maybeSingle();
    if (macetaError) throw new Error(`Error al buscar la maceta: ${macetaError.message}`);
    if (!maceta) return null;
    const { error: deleteMacetaError } = await supabase
      .from("macetas")
      .delete()
      .eq("id", macetaId);
    if (deleteMacetaError) throw new Error(`Error al eliminar la maceta: ${deleteMacetaError.message}`);
    if (maceta.producto_id) {
      await supabase.from("productos").delete().eq("id", maceta.producto_id);
    }
    return true;
  }
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

  async updateMacetaById(macetaId, macetaData) {
    const { data: existingMaceta, error: existingMacetaError } = await supabase
      .from("macetas")
      .select("id, producto_id")
      .eq("id", macetaId)
      .maybeSingle();

    if (existingMacetaError) {
      throw new Error(`Error al obtener la maceta: ${existingMacetaError.message}`);
    }

    if (!existingMaceta) {
      return null;
    }

    const allowedMacetaFields = ["descripcion", "producto_id", "tipo"];
    const macetaUpdates = {};

    for (const field of allowedMacetaFields) {
      if (macetaData[field] !== undefined) {
        macetaUpdates[field] = macetaData[field];
      }
    }

    if (macetaUpdates.descripcion !== undefined) {
      let parsedDescription = macetaUpdates.descripcion;

      // Si viene como string JSON, parsearlo
      if (typeof macetaUpdates.descripcion === "string") {
        try {
          parsedDescription = JSON.parse(macetaUpdates.descripcion);
        } catch (e) {
          // Si no es JSON válido, tratar como descripción simple
          parsedDescription = { descripcion: macetaUpdates.descripcion };
        }
      }

      // Asegurar que es un objeto
      if (typeof parsedDescription === "object" && parsedDescription !== null) {
        const allowedDescriptionFields = ["descripcion", "volumen", "diametro_superior", "diametro_inferior", "altura"];
        const normalizedDescription = {};

        for (const field of allowedDescriptionFields) {
          if (parsedDescription[field] !== undefined) {
            normalizedDescription[field] = String(parsedDescription[field]);
          }
        }

        macetaUpdates.descripcion = normalizedDescription;
      }
    }

    if (Object.keys(macetaUpdates).length > 0) {
      const { error: updateMacetaError } = await supabase
        .from("macetas")
        .update(macetaUpdates)
        .eq("id", macetaId);

      if (updateMacetaError) {
        throw new Error(`Error al actualizar la maceta: ${updateMacetaError.message}`);
      }
    }

    const productPayload = macetaData.productos || macetaData.producto;
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
      macetaUpdates.producto_id ?? productPayload?.id ?? existingMaceta.producto_id;

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

    const { data: updatedMaceta, error: updatedMacetaError } = await supabase
      .from("macetas")
      .select(
        "id, descripcion, producto_id, productos:productos!inner(id, nombre, precio, imagen, categoria_id, stock, categorias(categoria, id))",
      )
      .eq("id", macetaId)
      .maybeSingle();

    if (updatedMacetaError) {
      throw new Error(
        `Error al obtener la maceta actualizada: ${updatedMacetaError.message}`,
      );
    }

    return updatedMaceta;
  }
}