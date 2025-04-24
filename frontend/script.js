// Función para formatear la fecha a DD/MM/YYYY
function formatDate(dateString) {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()}`;
  }
  
  // Verificar autenticación al cargar cualquier página
  function checkAuth() {
    return fetch("/api/check-auth", {
      method: "GET",
      credentials: "include", // Incluir cookies en la solicitud
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al verificar autenticación");
        return res.json();
      })
      .then((data) => {
        console.log("Resultado de checkAuth:", data); // Depuración
        if (!data.isAuthenticated) {
          // Evitar redirección si ya estamos en login.html
          if (!window.location.pathname.endsWith("login.html")) {
            window.location.href = "login.html";
          }
          return false;
        }
        return true;
      })
      .catch((err) => {
        console.error("Error al verificar autenticación:", err);
        if (!window.location.pathname.endsWith("login.html")) {
          window.location.href = "login.html";
        }
        return false;
      });
  }
  
  // Para login.html
  document.addEventListener("DOMContentLoaded", () => {
    const formLogin = document.getElementById("formLogin");
  
    if (formLogin) {
      formLogin.addEventListener("submit", async (e) => {
        e.preventDefault();
  
        const nombreUsuario = document.getElementById("nombreUsuario").value;
        const contrasena = document.getElementById("contrasena").value;
  
        try {
          const response = await fetch("/api/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include", // Incluir cookies en la solicitud
            body: JSON.stringify({ nombreUsuario, contrasena }),
          });
  
          const data = await response.json();
  
          if (!response.ok) {
            throw new Error(data.message || "Error al iniciar sesión");
          }
  
          console.log("Respuesta de login:", data); // Depuración
          alert("Login exitoso ✅");
          window.location.href = "index.html";
        } catch (error) {
          console.error("Error al iniciar sesión:", error);
          alert("Error al iniciar sesión: " + error.message);
        }
      });
    }
  });
  
  // Para agregar.html
  document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formAgregar");
  
    if (form) {
      checkAuth().then((isAuthenticated) => {
        if (isAuthenticated) {
          form.addEventListener("submit", async (e) => {
            e.preventDefault();
  
            const nombre = document.getElementById("nombre").value;
            const precio = parseFloat(document.getElementById("precio").value);
            const cantidad = parseInt(document.getElementById("cantidad").value);
  
            try {
              const response = await fetch("/api/productos", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                credentials: "include", // Incluir cookies
                body: JSON.stringify({ nombre, precio, cantidad }),
              });
  
              if (!response.ok) {
                throw new Error("Respuesta no satisfactoria del servidor");
              }
  
              alert("Producto agregado con éxito ✅");
              form.reset();
            } catch (error) {
              console.error("Error al agregar producto:", error);
              alert("Ocurrió un error al guardar el producto ❌");
            }
          });
        }
      });
    }
  });
  
  // Función para renderizar productos en la tabla
  function renderProductos(tabla, data) {
    tabla.innerHTML = "";
    if (!data || data.length === 0) {
      tabla.innerHTML = "<tr><td colspan='6'>No hay productos disponibles.</td></tr>";
      return;
    }
    data.forEach((p) => {
      tabla.innerHTML += `
        <tr>
          <td>${p.ID}</td>
          <td>${p.Nombre}</td>
          <td>${p.CantidadStock}</td>
          <td>₡${p.PrecioUnitario.toFixed(2)}</td>
          <td>${formatDate(p.FechaRegistro)}</td>
          <td>
            <button type="button" class="btn btn-edit" onclick="editarProducto(${p.ID}, '${p.Nombre.replace(/'/g, "\\'")}', ${p.CantidadStock}, ${p.PrecioUnitario})">Editar</button>
            <button type="button" class="btn btn-delete" onclick="eliminarProducto(${p.ID})">Eliminar</button>
          </td>
        </tr>`;
    });
  }
  
  // Para index.html (cargar productos al inicio)
  document.addEventListener("DOMContentLoaded", () => {
    const tabla = document.querySelector("#tablaProductos");
  
    if (tabla) {
      checkAuth().then((isAuthenticated) => {
        if (isAuthenticated) {
          fetch("/api/productos", {
            credentials: "include", // Incluir cookies
          })
            .then((res) => res.json())
            .then((data) => {
              renderProductos(tabla, data);
            })
            .catch((err) => {
              console.error("Error al obtener productos:", err);
              tabla.innerHTML = "<tr><td colspan='6'>Error al cargar productos.</td></tr>";
            });
        }
      });
    }
  });
  
  // Función para buscar productos por nombre
  function buscarProducto() {
    const searchInput = document.getElementById("searchInput").value;
    const tabla = document.querySelector("#tablaProductos");
  
    if (!searchInput.trim()) {
      fetch("/api/productos", {
        credentials: "include", // Incluir cookies
      })
        .then((res) => res.json())
        .then((data) => {
          renderProductos(tabla, data);
        })
        .catch((err) => {
          console.error("Error al obtener productos:", err);
          tabla.innerHTML = "<tr><td colspan='6'>Error al cargar productos.</td></tr>";
        });
      return;
    }
  
    fetch(`/api/productos/buscar?nombre=${encodeURIComponent(searchInput)}`, {
      credentials: "include", // Incluir cookies
    })
      .then((res) => res.json())
      .then((data) => {
        renderProductos(tabla, data);
      })
      .catch((err) => {
        console.error("Error al buscar productos:", err);
        tabla.innerHTML = "<tr><td colspan='6'>Error al buscar productos.</td></tr>";
      });
  }
  
  // Función para eliminar
  function eliminarProducto(id) {
    if (confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      fetch(`/api/productos/${id}`, {
        method: "DELETE",
        credentials: "include", // Incluir cookies
      })
        .then((res) => {
          if (!res.ok) throw new Error("Error al eliminar");
          alert("Producto eliminado ✅");
          location.reload();
        })
        .catch((err) => {
          console.error(err);
          alert("Error al eliminar el producto ❌");
        });
    }
  }
  
  // Función para editar (con validaciones)
  function editarProducto(id, nombre, cantidad, precio) {
    const nuevoNombre = prompt("Nuevo nombre:", nombre);
    const nuevaCantidad = prompt("Nueva cantidad:", cantidad);
    const nuevoPrecio = prompt("Nuevo precio:", precio);
  
    if (!nuevoNombre || nuevoNombre.trim() === "") {
      alert("El nombre no puede estar vacío ❌");
      return;
    }
    const cantidadNum = parseInt(nuevaCantidad);
    if (isNaN(cantidadNum) || cantidadNum < 0) {
      alert("La cantidad debe ser un número válido y no negativo ❌");
      return;
    }
    const precioNum = parseFloat(nuevoPrecio);
    if (isNaN(precioNum) || precioNum < 0) {
      alert("El precio debe ser un número válido y no negativo ❌");
      return;
    }
  
    fetch(`/api/productos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // Incluir cookies
      body: JSON.stringify({
        nombre: nuevoNombre.trim(),
        cantidad: cantidadNum,
        precio: precioNum,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al editar");
        alert("Producto actualizado ✅");
        location.reload();
      })
      .catch((err) => {
        console.error(err);
        alert("Error al editar producto ❌");
      });
  }
  
  // Función para cerrar sesión
  function cerrarSesion() {
    fetch("/api/logout", {
      method: "POST",
      credentials: "include", // Incluir cookies
    })
      .then((res) => res.json())
      .then((data) => {
        alert("Sesión cerrada ✅");
        window.location.href = "login.html";
      })
      .catch((err) => {
        console.error("Error al cerrar sesión:", err);
        alert("Error al cerrar sesión ❌");
      });
  }