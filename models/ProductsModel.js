const fs = require('fs')
const path = require('path')

const products = require('../database/products.json')
const Utils = require('../utils')
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
        return products.find((item, index) =>  {
            if(item.id === id) {
                products.splice(index, 1)
                fs.writeFileSync(productsPath, JSON.stringify(products, null, 2))
                resolve()
            }
        })
    })
}

const update = (id, newProduct) => {
    return new Promise((resolve, _) => {
        const productIndex = products.findIndex(item => {
            if(item.id === id) {
                return item
            }
        })

        products[productIndex] = { id, ...newProduct }
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