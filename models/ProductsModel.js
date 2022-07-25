const products = require('../database/products.json')

const getAll = () => new Promise(resolve => resolve(products))

const getByID = (id) => {
    return new Promise(resolve => {
        const productID = products.find(product => product.id === id)
        resolve(productID)
    }) 
}

module.exports = {
    getAll,
    getByID
}