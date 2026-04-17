import { supabase } from "../database/supaBaseConnection.js";

export default class PlantaModel {
  async deletePlantById(plantId) {
    // Buscar la planta y su producto_id
    const { data: plant, error: plantError } = await supabase
      .from("plantas")
      .select("id, producto_id")
      .eq("id", plantId)
      .maybeSingle();
    if (plantError) throw new Error(`Error al buscar la planta: ${plantError.message}`);
    if (!plant) return null;
    // Eliminar la planta
    const { error: deletePlantError } = await supabase
      .from("plantas")
      .delete()
      .eq("id", plantId);
    if (deletePlantError) throw new Error(`Error al eliminar la planta: ${deletePlantError.message}`);
    // Eliminar el producto relacionado
    if (plant.producto_id) {
      const {data, error} =await supabase.from("productos").delete().eq("id", plant.producto_id);
      if (error) throw new Error(`Error al eliminar el producto: ${error.message}`);
    }
    return true;
  }
  async getAllPlantsWithProducts() {
    const { data, error } = await supabase
      .from("plantas")
      .select(
        "id, descripcion, producto_id, tipo, nivel_cuidado, producto:productos!inner(id, nombre, precio, imagen, categoria_id, stock)",
      );

    if (error) {
      throw new Error(`Error al obtener las plantas con productos: ${error.message}`);
    }

    return data;
  }

  async createNewPlant(payload) {
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

    const plantData = {
      producto_id: createdProductId,
      tipo: payload.tipo,
      nivel_cuidado: payload.nivel_cuidado,
      descripcion: {
        descripcion: payload.descripcion,
      },
    };

    const { data: createdPlantData, error: createPlantError } = await supabase
      .from("plantas")
      .insert([plantData])
      .select("id")
      .maybeSingle();

    if (createPlantError) {
      await supabase.from("productos").delete().eq("id", createdProductId);
      throw new Error(`Error al crear la planta: ${createPlantError.message}`);
    }

    const { data: createdPlant, error: createdPlantFetchError } = await supabase
      .from("plantas")
      .select(
        "id, descripcion, producto_id, tipo, nivel_cuidado, productos:productos!inner(id, nombre, precio, imagen, categoria_id, stock, categorias(categoria, id))",
      )
      .eq("id", createdPlantData.id)
      .maybeSingle();

    if (createdPlantFetchError) {
      throw new Error(
        `Error al obtener la planta creada: ${createdPlantFetchError.message}`,
      );
    }

    return createdPlant;
  }

  async updatePlantById(plantId, plantData) {
    const { data: existingPlant, error: existingPlantError } = await supabase
      .from("plantas")
      .select("id, producto_id")
      .eq("id", plantId)
      .maybeSingle();

    if (existingPlantError) {
      throw new Error(`Error al obtener la planta: ${existingPlantError.message}`);
    }

    if (!existingPlant) {
      return null;
    }

    const allowedPlantFields = [
      "descripcion",
      "producto_id",
      "tipo",
      "nivel_cuidado",
    ];

    const plantUpdates = {};
    for (const field of allowedPlantFields) {
      if (plantData[field] !== undefined) {
        plantUpdates[field] = plantData[field];
      }
    }

    if (Object.keys(plantUpdates).length > 0) {
      const { error: updatePlantError } = await supabase
        .from("plantas")
        .update(plantUpdates)
        .eq("id", plantId);

      if (updatePlantError) {
        throw new Error(`Error al actualizar la planta: ${updatePlantError.message}`);
      }
    }

    const productPayload = plantData.productos || plantData.producto;
    const allowedProductFields = ["nombre", "precio", "imagen", "categoria_id", "stock"];
    const productUpdates = {};

    if (productPayload && typeof productPayload === "object") {
      for (const field of allowedProductFields) {
        if (productPayload[field] !== undefined) {
          productUpdates[field] = productPayload[field];
        }
      }
    }

    const resolvedProductId =
      plantUpdates.producto_id ?? productPayload?.id ?? existingPlant.producto_id;

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

    const { data: updatedPlant, error: updatedPlantError } = await supabase
      .from("plantas")
      .select(
        "id, descripcion, producto_id, tipo, nivel_cuidado, productos:productos!inner(id, nombre, precio, imagen, categoria_id, stock, categorias(categoria, id))",
      )
      .eq("id", plantId)
      .maybeSingle();

    if (updatedPlantError) {
      throw new Error(`Error al obtener la planta actualizada: ${updatedPlantError.message}`);
    }

    return updatedPlant;
  }

  async getPlantProductById(plantId) {
    const { data, error } = await supabase
      .from("plantas")
      .select(
        "id, descripcion, producto_id, tipo, nivel_cuidado, productos:productos!inner(id, nombre, precio, imagen, categoria_id, stock, categorias(categoria, id))",
      )
      .eq("id", plantId)
      .maybeSingle();

    if (error) {
      throw new Error(`Error al obtener la planta: ${error.message}`);
    }

    return data;
  }
}
