const fs = require('fs')
const path = require('path')

const products = require('../database/products.json')
const productsPath = path.join(__dirname, '../', '/database', 'products.json')

const getAll = () => new Promise((resolve, _) => resolve(products))

const getByID = (id) => {
    return new Promise((resolve, _) => {
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

const deleteByID = (id) => {
    return new Promise((resolve, _) => {
        const productFoundIndex = products.findIndex(item => item.id === id)

        products.splice(productFoundIndex, 1)
        fs.writeFileSync(productsPath, JSON.stringify(products, null, 2))
        resolve()
        
    })
}

const update = (id, newProduct) => {
    return new Promise((resolve, _) => {

        const productIndex = products.findIndex(item => item.id === id)
        const propertiesToDelete = ['temp-key', 'id']

        const newProductProperties = Object.getOwnPropertyNames(newProduct)

        newProductProperties.forEach(property => {
            switch(propertiesToDelete.includes(property)) {
                case true:
                    Reflect.deleteProperty(newProduct, property)
                    break
                default: 
                    break
            }
        })

        products[productIndex] = { id, ...newProduct }
        fs.writeFileSync(productsPath, JSON.stringify(products, null, 2))
        
        resolve(products[productIndex])

    })
}

module.exports = {
    getAll,
    getByID,
    create,
    deleteByID,
    update
}