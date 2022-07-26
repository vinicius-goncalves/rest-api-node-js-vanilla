const fs = require('fs')
const path = require('path')

const products = require('../database/products.json')
const Utils = require('../utils')
const productsPath = path.join(__dirname, '../', '/database', 'products.json')

const getAll = () => new Promise(resolve => resolve(products))

const getByID = (id) => {
    return new Promise(resolve => {
        const productID = products.find(product => product.id === id)
        resolve(productID)
    }) 
}

const create = (newProduct, uuid) => {
    
    fs.readFile(productsPath, (error, data) => {
        if(error) {
            return console.log(error)
        }

        const products = JSON.parse(data)
        products.push({ id: uuid, ...newProduct })

        fs.writeFileSync(productsPath, JSON.stringify(products, null, 2))
    })
}

module.exports = {
    getAll,
    getByID,
    create
}