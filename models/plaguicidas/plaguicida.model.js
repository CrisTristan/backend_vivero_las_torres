import { supabase } from "../../database/supaBaseConnection.js";

export default class PlaguicidaModel {
  async createNewPesticide(payload) {
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

    const pesticideData = {
      producto_id: createdProductId,
      descripcion: {
        descripcion: payload.descripcion,
      },
    };

    const { data: createdPesticideData, error: createPesticideError } = await supabase
      .from("plaguicidas")
      .insert([pesticideData])
      .select("id")
      .maybeSingle();

    if (createPesticideError) {
      await supabase.from("productos").delete().eq("id", createdProductId);
      throw new Error(`Error al crear el plaguicida: ${createPesticideError.message}`);
    }

    const { data: createdPesticide, error: createdPesticideFetchError } = await supabase
      .from("plaguicidas")
      .select(
        "id, descripcion, producto_id, productos:productos!inner(id, nombre, precio, imagen, categoria_id, stock, categorias(categoria, id))",
      )
      .eq("id", createdPesticideData.id)
      .maybeSingle();

    if (createdPesticideFetchError) {
      throw new Error(
        `Error al obtener el plaguicida creado: ${createdPesticideFetchError.message}`,
      );
    }

    return createdPesticide;
  }

  async updatePlaguicidaById(plaguicidaId, plaguicidaData) {
    const { data: existingPlaguicida, error: existingPlaguicidaError } = await supabase
      .from("plaguicidas")
      .select("id, producto_id")
      .eq("id", plaguicidaId)
      .maybeSingle();

    if (existingPlaguicidaError) {
      throw new Error(
        `Error al obtener el plaguicida: ${existingPlaguicidaError.message}`,
      );
    }

    if (!existingPlaguicida) {
      return null;
    }

    const allowedPlaguicidaFields = ["descripcion", "producto_id"];
    const plaguicidaUpdates = {};

    for (const field of allowedPlaguicidaFields) {
      if (plaguicidaData[field] !== undefined) {
        plaguicidaUpdates[field] = plaguicidaData[field];
      }
    }

    if (plaguicidaUpdates.descripcion !== undefined) {
      if (typeof plaguicidaUpdates.descripcion === "string") {
        plaguicidaUpdates.descripcion = { descripcion: plaguicidaUpdates.descripcion };
      } else if (typeof plaguicidaUpdates.descripcion === "object") {
        const normalizedDescription = plaguicidaUpdates.descripcion?.descripcion;
        plaguicidaUpdates.descripcion = {
          descripcion:
            normalizedDescription === undefined
              ? ""
              : String(normalizedDescription),
        };
      }
    }

    if (Object.keys(plaguicidaUpdates).length > 0) {
      const { error: updatePlaguicidaError } = await supabase
        .from("plaguicidas")
        .update(plaguicidaUpdates)
        .eq("id", plaguicidaId);

      if (updatePlaguicidaError) {
        throw new Error(
          `Error al actualizar el plaguicida: ${updatePlaguicidaError.message}`,
        );
      }
    }

    const productPayload = plaguicidaData.productos || plaguicidaData.producto;
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
      plaguicidaUpdates.producto_id ??
      productPayload?.id ??
      existingPlaguicida.producto_id;

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

    const { data: updatedPlaguicida, error: updatedPlaguicidaError } = await supabase
      .from("plaguicidas")
      .select(
        "id, descripcion, producto_id, productos:productos!inner(id, nombre, precio, imagen, categoria_id, stock, categorias(categoria, id))",
      )
      .eq("id", plaguicidaId)
      .maybeSingle();

    if (updatedPlaguicidaError) {
      throw new Error(
        `Error al obtener el plaguicida actualizado: ${updatedPlaguicidaError.message}`,
      );
    }

    return updatedPlaguicida;
  }
}
