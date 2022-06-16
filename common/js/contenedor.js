const fs = require("fs");
const encoding = "utf8";

class Contenedor {
  constructor(nombreArchivoContenedor) {
    // Guarda el nombre del archivo contenedor e inicializa
    // el contenido de listaProductos con el contenido
    // del archivo
    this.nombreArchivo = nombreArchivoContenedor;
    this.listaProductos = this.readFromFile();
  }
  // escribe listaProductos en el archivo indicado por nombreArchivo
  async saveToFile() {
    try {
      await fs.promises.writeFile(
        this.nombreArchivo,
        JSON.stringify(this.listaProductos),
        encoding
      );
    } catch (error) {
      throw error;
    }
  }
  // lee el contenido de nombreArchivo
  readFromFile() {
    try {
      return JSON.parse(fs.readFileSync(this.nombreArchivo));
    } catch (error) {
      // Hubo un error al leer el archivo,
      // asumo que no existe y retorno un arreglo vacío
      return [];
    }
  }
  // agrega un nuevo producto a listaProductos y graba en disco
  // retorna el id del nuevo producto
  save(producto) {
    // busco el id máximo actual y le sumo 1
    let id = 0;
    this.listaProductos.forEach((element) => {
      if (element.id > id) id = element.id;
    });
    id++;
    // asigno el id en el objeto
    producto.id = id;
    // eliminar espacios de mas en el titulo
    producto.title = producto.title.trim();
    // forzar precio a numero
    producto.price = +producto.price;
    // eliminar espacios de mas en el thumbnail
    producto.thumbnail = producto.thumbnail.trim();
    // agrego el objeto a la lista de productos
    this.listaProductos.push(producto);
    // escribo el archivo (async)
    this.saveToFile();
    return producto;
  }
  // devuelve el índice en listaProductos de idBuscado si existe
  indexOf(idBuscado) {
    for (let i = 0; i < this.listaProductos.length; i++) {
      if (this.listaProductos[i].id === idBuscado) return i;
    }
    return -1;
  }
  // retorna el producto indicado por idBuscado o null si no existe
  getById(idBuscado) {
    let index = this.indexOf(idBuscado);
    if (index >= 0) {
      return this.listaProductos[index];
    }
    return null;
  }
  // devuelve la lista completa de productos
  getAll() {
    return this.listaProductos;
  }
  // elimina el producto del id indicado
  deleteById(idBuscado) {
    let index = this.indexOf(idBuscado);
    if (index >= 0) {
      // borro el elemento del arreglo
      let productoEliminado = this.listaProductos[index];
      this.listaProductos.splice(index, 1);
      // escribo el archivo (async)
      this.saveToFile();
      return productoEliminado;
    } else {
      return null;
    }
  }
  deleteAll() {
    this.listaProductos = [];
    // escribo el archivo (async)
    this.saveToFile();
  }
  // retorna el producto actualizado indicado por idBuscado o null si no existe
  updateById(idBuscado, productoActualizado) {
    let producto = this.getById(idBuscado);
    if (producto) {
      // actualizo el producto
      producto.title = productoActualizado.title;
      producto.price = +productoActualizado.price;
      producto.thumbnail = productoActualizado.thumbnail;
      return producto;
    } else {
      return null;
    }
  }
  // Verifica que el objeto producto tenga las claves esperadas y que sean del tipo esperados
  validaProducto(producto) {
    // validaciones de tittle
    if (!producto.hasOwnProperty("title")) {
      return "El producto no tiene una clave tittle";
    }
    if (typeof producto.title !== "string") {
      return "La clave tittle debe ser un string";
    }
    if (producto.title.trim() == "") {
      return "La clave tittle no puede estar vacía";
    }
    // validaciones de price
    if (!producto.hasOwnProperty("price")) {
      return "El producto no tiene una clave price";
    }
    if (isNaN(producto.price)) {
      return "La clave price debe ser un numero";
    }
    if (producto.price <= 0) {
      return "El precio debe ser mayor a 0";
    }
    // validaciones de thumbnail
    if (!producto.hasOwnProperty("thumbnail")) {
      return "El producto no tiene una clave thumbnail";
    }
    if (typeof producto.thumbnail !== "string") {
      return "La clave tittle debe ser un string";
    }
    if (producto.thumbnail.trim() == "") {
      return "La clave thumbnail no puede estar vacía";
    }
    // todo: agregar validaciones sobre la url
    return "";
  }
}

module.exports = { Contenedor };
