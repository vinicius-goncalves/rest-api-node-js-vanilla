const { randomUUID } = require('crypto')
const fs = require('fs')
const path = require('path')

const ProductsModel = require('../models/ProductsModel')
const Utils = require('../utils')

const tempKey = path.join(__dirname, '../', 'database', 'temp_data', 'temp_key.json')

// @route GET /api/products
// @description This is going to get all the products in database folder

const createTempKey = (_, response) => {
    fs.readFile(tempKey, (_, data) => {
        const dataObject = JSON.parse(data)
        const uuid = JSON.stringify( { key: Utils.randomUUID() }, null, 2 )

        switch(dataObject.key === '') {
            case true:
                
                fs.writeFileSync(tempKey, uuid)

                response.writeHead(200, { 'Content-Type': 'application/json' })
                response.write(uuid)
                response.end()
                break

            case false:
                
                fs.writeFileSync(tempKey, uuid)
                response.writeHead(200, { 'Content-Type': 'application/json' })
                response.write(uuid)
                response.end()
                break
            }
    })
}

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

const getProductByID = async (request, response, id) => {
    try {

        const product = await ProductsModel.getByID(Number(id))

        switch(product) {
            case undefined:
                response.writeHead(404, { 'Content-Type': 'application/json' })
                response.end()
                break
            case product:
                response.writeHead(200, { 'Content-Type': 'application/json' })
                response.end(JSON.stringify(product, null, 2))
                break
            default:
                response.writeHead(500, { 'Content-Type': 'application/json' })
                response.end(JSON.stringify({ message: 'Internal error' }))
                break
        }
        
        response.writeHead(200, { 'Content-Type': 'application/json' })
        response.end()
    } catch(error) {
        console.log(error)
    }
}

const createProduct = async (request, response) => {
    
    try {

        const newProduct = await Utils.getReceivedData(request, response)
        const product = JSON.parse(newProduct)

        if('id' in product || !'temp-key' in product) {
            const error = new Utils.JSONMessageCreator('Error', 
            400, 
            'Incorret JSON format', 
            'Use the format below to make POSTs request. Found \'id\' in your request.', 
            { ...Utils.productExample })
    
            response.writeHead(400, { 'Content-Type': 'application/json' })
            response.end(JSON.stringify(error, null, 2))
            return
        }

        fs.readFile(tempKey, (error, data) => {
            if(error) {
                response.end()
                return console.log(error)
            }

            if(JSON.parse(data).key === product['temp-key']) {

                const uuid = Utils.randomUUID()

                const { ['temp-key']: a, ...productDetails } = product
                
                const success = new Utils.JSONMessageCreator('Success', 201, 'Product created succefully', `Your product with ID ${uuid} was created`)
                ProductsModel.create(productDetails, uuid)
                
                const { ['correctForm']: b, ...correctSuccess } = success
                
                response.writeHead(201, { 'Content-Type': 'application/json' })
                response.write(JSON.stringify(correctSuccess))
                response.end()
            }
        })



    } catch(error) {
        console.log(error)
    }
}

module.exports = { 
    getProducts,
    getProductByID,
    createProduct,
    createTempKey
}