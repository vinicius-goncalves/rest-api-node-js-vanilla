const products = require('../database/products.json')

const getAll = () =>  new Promise(resolve => resolve(products))

module.exports = {
    getAll
}