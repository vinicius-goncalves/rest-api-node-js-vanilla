const ProductsModel = require('../models/ProductsModel')
const Utils = require('../utils')

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

        Utils.getReceivedData(request, response).then(data => {
            const productObject = JSON.parse(data)

            if('id' in productObject) {
                const data = JSON.stringify(Utils.postProductExample, null, 2)
                const javascriptObject = JSON.parse(data)
                const objectEntries = Object.entries(javascriptObject)

                const objectError = {
                    status: 'error',
                    codeStatus: 400,
                    errorTitle: 'Incorrect JSON format',
                    errorMessage: 'Use the format below to make POSTs requests',
                    correctForm: {
                        
                    }
                }

                objectEntries.forEach(([key, value]) => {
                    Object.defineProperty(objectError.correctForm, key, {
                        value,
                        configurable: true,
                        enumerable: true
                    })
                })
                
                response.writeHead(400, { 'Content-Type': 'application/json' })
                response.end(JSON.stringify(objectError, null, 2))
            }
        })
        
    } catch(error) {
        console.log(error)
    }
}

module.exports = { 
    getProducts,
    createProduct
}