const ProductsModel = require('../models/ProductsModel')
const Utils = require('../utils').default

const getProducts = async (request, response) => {

    const { ...headers } = await request?.headers ?? 'Headers details no found'
    const headersObjectEntries = Object.entries(headers)
    const someHeaders = headersObjectEntries.reduce((acc, item) => {
        acc += item.toString().replace(',', ': ') + '\n'
        return acc
    }, '')
    
    try {

        const products = await ProductsModel.getAll()

        response.writeHead(200, { 'Content-Type': 'application/json' })
        response.write(JSON.stringify(products, null, 2))
        response.end()
        
    } catch(error) {
        console.log(`An error ocurred : ${error.name} -> ${error.message}`)
    } finally {
        console.log(`The request process was finished. \n${someHeaders}. Response Status: ${response.statusCode}`)
    }
}

const createProduct = async (request, response) => {
    
    try {

        const newProduct = await Utils.getReceivedData(request, response)
        const product = JSON.parse(newProduct)

        if('id' in product) {

            const objectError = {
                status: 'error',
                codeStatus: 400,
                errorTitle: 'Incorrect JSON format',
                errorMessage: 'Use the format below to make POSTs requests',
                correctForm: {
                    ...Utils.productExample
                }
            }
            
            response.writeHead(400, { 'Content-Type': 'application/json' })
            response.end(JSON.stringify(objectError, null, 2))
        } else {
            response.writeHead(200, { 'Content-Type': 'application/json' })
            response.end(JSON.stringify({ status: 'Sucesso' }))
        }
        
    } catch(error) {
        console.log(error)
    }
}

module.exports = { 
    getProducts,
    createProduct
}