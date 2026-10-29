import { useEffect, useState } from "react";
import {
  obtenerProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto
} from "./crud.js";

const formularioVacio = {
  nombre: "",
  categoria: "",
  precio: "",
  cantidad: ""
};

function Negocio() {
  const [productos, setProductos] = useState([]);
  const [formulario, setFormulario] = useState(formularioVacio);
  const [idEditar, setIdEditar] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  async function cargarProductos() {
    try {
      setError("");
      const datos = await obtenerProductos();
      setProductos(datos);
    } catch (err) {
      setError("No se pudo conectar con la API. Comprueba que json-server esté iniciado.");
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarProductos();
  }, []);

  function cambiarCampo(evento) {
    const { name, value } = evento.target;
    setFormulario({ ...formulario, [name]: value });
  }

  async function guardarProducto(evento) {
    evento.preventDefault();
    setMensaje("");
    setError("");

    const producto = {
      nombre: formulario.nombre.trim(),
      categoria: formulario.categoria.trim(),
      precio: Number(formulario.precio),
      cantidad: Number(formulario.cantidad)
    };

    if (!producto.nombre || !producto.categoria || formulario.precio === "" || formulario.cantidad === "") {
      setError("Completa todos los campos.");
      return;
    }

    if (producto.precio < 0 || producto.cantidad < 0) {
      setError("El precio y la cantidad no pueden ser negativos.");
      return;
    }

    try {
      if (idEditar !== null) {
        await actualizarProducto(idEditar, producto);
        setMensaje("Producto actualizado correctamente.");
      } else {
        await crearProducto(producto);
        setMensaje("Producto registrado correctamente.");
      }

      setFormulario(formularioVacio);
      setIdEditar(null);
      await cargarProductos();
    } catch (err) {
      setError(err.message || "Ocurrió un error al guardar.");
    }
  }

  function editarProducto(producto) {
    setIdEditar(producto.id);
    setFormulario({
      nombre: producto.nombre,
      categoria: producto.categoria,
      precio: String(producto.precio),
      cantidad: String(producto.cantidad)
    });
    setMensaje("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function borrarProducto(id) {
    const confirmar = window.confirm("¿Seguro que deseas eliminar este producto?");
    if (!confirmar) return;

    try {
      await eliminarProducto(id);
      setMensaje("Producto eliminado correctamente.");
      await cargarProductos();
      if (String(idEditar) === String(id)) cancelarEdicion();
    } catch (err) {
      setError(err.message || "No se pudo eliminar el producto.");
    }
  }

  function cancelarEdicion() {
    setIdEditar(null);
    setFormulario(formularioVacio);
  }

  const totalUnidades = productos.reduce((total, producto) => total + Number(producto.cantidad), 0);

  return (
    <div className="pagina">
      <nav className="navbar navbar-dark barra-superior">
        <div className="container">
          <span className="navbar-brand mb-0 h1">Mi Negocio</span>
          <span className="text-white-50 small">Laboratorio 4 · React CRUD</span>
        </div>
      </nav>

      <main className="container py-4 py-md-5">
        <div className="mb-4">
          <p className="texto-superior mb-1">ADMINISTRACIÓN</p>
          <h1 className="titulo">Gestión de productos</h1>
          <p className="text-secondary mb-0">Registra, consulta, modifica y elimina los productos del negocio.</p>
        </div>

        <div className="row g-3 mb-4">
          <div className="col-12 col-md-6">
            <div className="card resumen h-100">
              <div className="card-body">
                <p className="text-secondary mb-1">Productos registrados</p>
                <div className="numero">{productos.length}</div>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6">
            <div className="card resumen h-100">
              <div className="card-body">
                <p className="text-secondary mb-1">Unidades en inventario</p>
                <div className="numero">{totalUnidades}</div>
              </div>
            </div>
          </div>
        </div>

        {mensaje && <div className="alert alert-success">{mensaje}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <section className="card sombra mb-4">
          <div className="card-header bg-white py-3">
            <h2 className="h5 mb-0">{idEditar !== null ? "Editar producto" : "Registrar producto"}</h2>
          </div>
          <div className="card-body p-3 p-md-4">
            <form onSubmit={guardarProducto}>
              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <label className="form-label" htmlFor="nombre">Nombre del producto</label>
                  <input id="nombre" className="form-control" name="nombre" value={formulario.nombre} onChange={cambiarCampo} placeholder="Ej. Café" required />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label" htmlFor="categoria">Categoría</label>
                  <select id="categoria" className="form-select" name="categoria" value={formulario.categoria} onChange={cambiarCampo} required>
                    <option value="">Selecciona una categoría</option>
                    <option>Alimentos</option>
                    <option>Bebidas</option>
                    <option>Aseo</option>
                    <option>Otros</option>
                  </select>
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label" htmlFor="precio">Precio (COP)</label>
                  <input id="precio" className="form-control" type="number" min="0" step="1" name="precio" value={formulario.precio} onChange={cambiarCampo} placeholder="3500" required />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label" htmlFor="cantidad">Cantidad</label>
                  <input id="cantidad" className="form-control" type="number" min="0" step="1" name="cantidad" value={formulario.cantidad} onChange={cambiarCampo} placeholder="10" required />
                </div>
              </div>
              <div className="d-flex flex-wrap gap-2 mt-4">
                <button className="btn btn-primary" type="submit">
                  {idEditar !== null ? "Guardar cambios" : "Registrar producto"}
                </button>
                {idEditar !== null && <button className="btn btn-outline-secondary" type="button" onClick={cancelarEdicion}>Cancelar</button>}
              </div>
            </form>
          </div>
        </section>

        <section className="card sombra">
          <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center flex-wrap gap-2">
            <h2 className="h5 mb-0">Inventario</h2>
            <button className="btn btn-sm btn-outline-primary" onClick={cargarProductos}>Actualizar lista</button>
          </div>
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Categoría</th>
                  <th>Precio</th>
                  <th>Cantidad</th>
                  <th className="text-end">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {cargando ? (
                  <tr><td colSpan="5" className="text-center py-4">Cargando productos...</td></tr>
                ) : productos.length === 0 ? (
                  <tr><td colSpan="5" className="text-center text-secondary py-4">No hay productos registrados.</td></tr>
                ) : (
                  productos.map((producto) => (
                    <tr key={producto.id}>
                      <td className="fw-semibold">{producto.nombre}</td>
                      <td><span className="badge text-bg-light">{producto.categoria}</span></td>
                      <td>${Number(producto.precio).toLocaleString("es-CO")}</td>
                      <td>{producto.cantidad}</td>
                      <td>
                        <div className="d-flex justify-content-end gap-2">
                          <button className="btn btn-sm btn-outline-primary" onClick={() => editarProducto(producto)}>Editar</button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => borrarProducto(producto.id)}>Eliminar</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <p className="text-secondary small mt-4 mb-0">Proyecto académico · React, Hooks, Fetch, json-server y Bootstrap.</p>
      </main>
    </div>
  );
}

export default Negocio;
