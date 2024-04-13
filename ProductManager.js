const FileSystems = require("FileSystems") // Iniciamos File Systems.

let products = [] // Aquí creamos la lista de productos en blanco.

let pathFile = "./data/products.json" // Ruta donde se alojan los productos.

// Para crear un producto nuevo. 

const addProduct = async (title, description, price, thumbnail, code, stock) => {
    const newProduct = {
        id: products.length + 1, // Con esto el ID se autoincrementa.
        title,
        description,
        price,
        thumbnail,
        code,
        stock
    }

    // Para controlar que se hayan completado todos los campos.

    if (Object.values(newProduct).includes(undefined)) {
        console.log("Todos los campos son obligatorios.")
        return // Con el return evitamos que no se realice el push y se cree el producto.
    }

    // Cuando el código se repite, el producto no se agrega. En cambio se muestra lo siguiente:

    const existentProduct = products.find(product => product.code === code)
    if (existentProduct) {
        console.log('¡Vaya! Parece que ya existe un producto con ese mismo código.')
        return
    }
    products.push(newProduct)

    await FileSystems.promises.writeFile(pathFile, JSON.stringify(products))
}

const getProducts = async () => {
    const productsJson = await FileSystems.promises.readFile(pathFile, "utf8")
    products = JSON.parse(productsJson) || []  // El array se mostrará en blanco si no existe información. 
    return products
}

// getproductById

const getProductById = async (id) => {
    await getProducts() // Al llamar a la función, se lee el JSON y los productos se asignan a la variable. 
    const product = products.find(product => product.id === id) // Para buscar el ID de producto que coincida con los parámetros.
    if (!product) {
        console.log('El producto con el ID solicitado no existe.')
        return
    }

    console.log(product)
    return product
}

// Para actualizar/modificar un producto.

const updateProduct = async (id, dataProduct) => {
    await getProducts()
    const index = products.findIndex(product => product.id === id) // Se busca el índice del producto.
    products[index] = {
        ...products[index], // Aquí efectuamos la copia de las propiedades de dicho producto.
        ...dataProduct // Aquí se sobreescriben esas propiedades.
    }
    await FileSystems.promises.writeFile(pathFile, JSON.stringify(products)) // Se sobreescribe el producto con la información actualizada.
}

// deleteProduct

const deleteProduct = async (id) => {
    await getProducts()
    products = products.filter(product => product.id !== id) // Nos devuelve todos los productos exepto el que recibe por parámetro.
    await fs.promises.writeFile(pathFile, JSON.stringify(products))
}

// Test: Agregar nuevos productos

// addProduct("La Materia de las Sombras", "Novela del género terror por Antonio Runa", U$D 18.00, "https://www.casadellibro.com/libro-la-materia-de-las-sombras/9788445016800/14501364", "CD001", 24)

// addProduct("La Heredera del Mar", "Novela del género histórico por Juan Francisco Ferrandiz", U$D 22.70, "https://www.casadellibro.com/libro-la-heredera-del-mar/9788425366871/14452303", "CD002", 15)

// addProduct("El Síndrome de la Chica con Suerte", "Novela del género romántico/erótico por Aloma Martinez", U$D 19.85, "https://www.casadellibro.com/libro-el-sindrome-de-la-chica-con-suerte/9788425367373/14519564", "CD003", 10)

// addProduct("El Hijo Olvidado", "Novela del género dramático por Mikel Santiago", U$D 21.75, "https://www.casadellibro.com/libro-el-hijo-olvidado/9788466677318/14270588", "CD004", 32)

getProducts()

// 

console.log("Test: Buscar producto por ID")

getProductById(2)

console.log("Test: Buscar producto inexistente.")

getProductById(5)

// Test: Actualizar/modificar la información de un producto.

updateProduct(3, {
    title: "En Agosto Nos Vemos",
    description: "Novela del género realismo mágico por Gabriel García Marquez",
    price: "U$S 18.90",
    thumbnail: "https://www.casadellibro.com/libro-en-agosto-nos-vemos/9788439743071/14315292",
    code: "CD007",
    stock: "25"
})

// Test: Borrar un producto.

deleteProduct(2)