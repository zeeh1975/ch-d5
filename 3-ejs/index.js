const express = require("express");
const ejs = require("ejs");
const { Contenedor } = require("../common/js/contenedor");
const PORT = 8080;
const productos = new Contenedor("../common/data/productos.txt");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("../common/html"));
app.use(express.static("../common/html/assets/css"));

app.set("view engine", "ejs");
app.set("views", "./views");

app.post("/productos", (req, res) => {
  const producto = req.body;
  productos.save(producto);
  res.redirect("/");
});

app.get("/productos", (req, res) => {
  const listaProductos = productos.getAll();

  res.render("pages/index", {
    productos: listaProductos,
  });
});

// creo el servidor de Express en el puerto indicado
const server = app.listen(PORT, () => {
  console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});

// loguear cualquier error a consola
server.on("error", (error) => console.log(`Error en servidor ${error}`));
