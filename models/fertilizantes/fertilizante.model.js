import { supabase } from "../../database/supaBaseConnection.js";

export default class FertilizanteModel {
  async deleteFertilizanteById(fertilizanteId) {
    const { data: fertilizante, error: fertilizanteError } = await supabase
      .from("fertilizantes")
      .select("id, producto_id")
      .eq("id", fertilizanteId)
      .maybeSingle();
    if (fertilizanteError) throw new Error(`Error al buscar el fertilizante: ${fertilizanteError.message}`);
    if (!fertilizante) return null;
    const { error: deleteFertilizanteError } = await supabase
      .from("fertilizantes")
      .delete()
      .eq("id", fertilizanteId);
    if (deleteFertilizanteError) throw new Error(`Error al eliminar el fertilizante: ${deleteFertilizanteError.message}`);
    if (fertilizante.producto_id) {
      await supabase.from("productos").delete().eq("id", fertilizante.producto_id);
    }
    return true;
  }
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

  async updateFertilizanteById(fertilizanteId, fertilizanteData) {
    const { data: existingFertilizante, error: existingFertilizanteError } = await supabase
      .from("fertilizantes")
      .select("id, producto_id")
      .eq("id", fertilizanteId)
      .maybeSingle();

    if (existingFertilizanteError) {
      throw new Error(
        `Error al obtener el fertilizante: ${existingFertilizanteError.message}`,
      );
    }

    if (!existingFertilizante) {
      return null;
    }

    const allowedFertilizanteFields = ["descripcion", "producto_id"];
    const fertilizanteUpdates = {};

    for (const field of allowedFertilizanteFields) {
      if (fertilizanteData[field] !== undefined) {
        fertilizanteUpdates[field] = fertilizanteData[field];
      }
    }

    if (fertilizanteUpdates.descripcion !== undefined) {
      if (typeof fertilizanteUpdates.descripcion === "string") {
        fertilizanteUpdates.descripcion = {
          descripcion: fertilizanteUpdates.descripcion,
        };
      } else if (typeof fertilizanteUpdates.descripcion === "object") {
        const normalizedDescription = fertilizanteUpdates.descripcion?.descripcion;
        fertilizanteUpdates.descripcion = {
          descripcion:
            normalizedDescription === undefined
              ? ""
              : String(normalizedDescription),
        };
      }
    }

    if (Object.keys(fertilizanteUpdates).length > 0) {
      const { error: updateFertilizanteError } = await supabase
        .from("fertilizantes")
        .update(fertilizanteUpdates)
        .eq("id", fertilizanteId);

      if (updateFertilizanteError) {
        throw new Error(
          `Error al actualizar el fertilizante: ${updateFertilizanteError.message}`,
        );
      }
    }

    const productPayload = fertilizanteData.productos || fertilizanteData.producto;
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
      fertilizanteUpdates.producto_id ??
      productPayload?.id ??
      existingFertilizante.producto_id;

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

    const { data: updatedFertilizante, error: updatedFertilizanteError } = await supabase
      .from("fertilizantes")
      .select(
        "id, descripcion, producto_id, productos:productos!inner(id, nombre, precio, imagen, categoria_id, stock, categorias(categoria, id))",
      )
      .eq("id", fertilizanteId)
      .maybeSingle();

    if (updatedFertilizanteError) {
      throw new Error(
        `Error al obtener el fertilizante actualizado: ${updatedFertilizanteError.message}`,
      );
    }

    return updatedFertilizante;
  }

  async getFertilizanteProductById(fertilizanteId) {
    const { data, error } = await supabase
      .from("fertilizantes")
      .select(
        "id, descripcion, producto_id, productos:productos!inner(id, nombre, precio, imagen, categoria_id, stock, categorias(categoria, id))",
      )
      .eq("id", fertilizanteId)
      .maybeSingle();

    if (error) {
      throw new Error(`Error al obtener el fertilizante: ${error.message}`);
    }

    return data;
  }
}
