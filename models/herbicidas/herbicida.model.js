import { supabase } from "../../database/supaBaseConnection.js";

export default class HerbicidaModel {
  async deleteHerbicidaById(herbicidaId) {
    const { data: herbicida, error: herbicidaError } = await supabase
      .from("herbicidas")
      .select("id, producto_id")
      .eq("id", herbicidaId)
      .maybeSingle();
    if (herbicidaError) throw new Error(`Error al buscar el herbicida: ${herbicidaError.message}`);
    if (!herbicida) return null;
    const { error: deleteHerbicidaError } = await supabase
      .from("herbicidas")
      .delete()
      .eq("id", herbicidaId);
    if (deleteHerbicidaError) throw new Error(`Error al eliminar el herbicida: ${deleteHerbicidaError.message}`);
    if (herbicida.producto_id) {
      await supabase.from("productos").delete().eq("id", herbicida.producto_id);
    }
    return true;
  }
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

  async updateHerbicidaById(herbicidaId, herbicidaData) {
    const { data: existingHerbicida, error: existingHerbicidaError } = await supabase
      .from("herbicidas")
      .select("id, producto_id")
      .eq("id", herbicidaId)
      .maybeSingle();

    if (existingHerbicidaError) {
      throw new Error(`Error al obtener el herbicida: ${existingHerbicidaError.message}`);
    }

    if (!existingHerbicida) {
      return null;
    }

    const allowedHerbicidaFields = ["descripcion", "producto_id"];
    const herbicidaUpdates = {};

    for (const field of allowedHerbicidaFields) {
      if (herbicidaData[field] !== undefined) {
        herbicidaUpdates[field] = herbicidaData[field];
      }
    }

    if (herbicidaUpdates.descripcion !== undefined) {
      if (typeof herbicidaUpdates.descripcion === "string") {
        herbicidaUpdates.descripcion = { descripcion: herbicidaUpdates.descripcion };
      } else if (typeof herbicidaUpdates.descripcion === "object") {
        const normalizedDescription = herbicidaUpdates.descripcion?.descripcion;
        herbicidaUpdates.descripcion = {
          descripcion:
            normalizedDescription === undefined
              ? ""
              : String(normalizedDescription),
        };
      }
    }

    if (Object.keys(herbicidaUpdates).length > 0) {
      const { error: updateHerbicidaError } = await supabase
        .from("herbicidas")
        .update(herbicidaUpdates)
        .eq("id", herbicidaId);

      if (updateHerbicidaError) {
        throw new Error(
          `Error al actualizar el herbicida: ${updateHerbicidaError.message}`,
        );
      }
    }

    const productPayload = herbicidaData.productos || herbicidaData.producto;
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
      herbicidaUpdates.producto_id ?? productPayload?.id ?? existingHerbicida.producto_id;

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

    const { data: updatedHerbicida, error: updatedHerbicidaError } = await supabase
      .from("herbicidas")
      .select(
        "id, descripcion, producto_id, productos:productos!inner(id, nombre, precio, imagen, categoria_id, stock, categorias(categoria, id))",
      )
      .eq("id", herbicidaId)
      .maybeSingle();

    if (updatedHerbicidaError) {
      throw new Error(
        `Error al obtener el herbicida actualizado: ${updatedHerbicidaError.message}`,
      );
    }

    return updatedHerbicida;
  }
}
