const URL_API = "http://localhost:3000/productos";

export async function obtenerProductos() {
  const respuesta = await fetch(URL_API);
  if (!respuesta.ok) throw new Error("No se pudieron consultar los productos.");
  return respuesta.json();
}

export async function crearProducto(producto) {
  const respuesta = await fetch(URL_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(producto)
  });
  if (!respuesta.ok) throw new Error("No se pudo registrar el producto.");
  return respuesta.json();
}

export async function actualizarProducto(id, producto) {
  const respuesta = await fetch(`${URL_API}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(producto)
  });
  if (!respuesta.ok) throw new Error("No se pudo actualizar el producto.");
  return respuesta.json();
}

export async function eliminarProducto(id) {
  const respuesta = await fetch(`${URL_API}/${id}`, {
    method: "DELETE"
  });
  if (!respuesta.ok) throw new Error("No se pudo eliminar el producto.");
}
