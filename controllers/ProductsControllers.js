const fs = require('fs')
const path = require('path')

const ProductsModel = require('../models/ProductsModel')
const Utils = require('../utils')
const MessagesUtils = require('../js/messages-utils')
const products = require('../database/products.json')

const tempKey = path.join(__dirname, '../', 'database', 'temp_data', 'temp_key.json')
const tempKeyTest = require('../database/temp_data/temp_key.json')

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

const getProductByID = async (response, id) => {
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
        response.writeHead(400, { 'Content-Type': 'application/json' })
        response.write(JSON.stringify({ message: 'Bad request, try again.' }))
        response.end()
    }
}

const createProduct = async (request, response) => {
    
    try {
        const newProduct = await Utils.getReceivedData(request, response)
        const product = JSON.parse(newProduct)

        const propertiesMustExist = ['name', 'price', 'available', 'image', 'type', 'temp-key']
        const productProperties = Object.getOwnPropertyNames(product)
        const allPropertiesExist = productProperties.every(property => propertiesMustExist.includes(property))
        
        if(!allPropertiesExist) {
            response.writeHead(400, { 'Content-Type': 'application/json' })
            response.write(JSON.stringify(MessagesUtils.incorretPostFormat, null, 2))
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
        response.writeHead(400, { 'Content-Type': 'application/json' })
        response.write(JSON.stringify({ message: 'Bad request, try again.' }))
        response.end()
    }
}

const updateProduct = async (request, response) => {
    try {
        const data = await Utils.getReceivedData(request, response)
        const product = JSON.parse(data)
        const { id } = product

        const productToUpdate = await ProductsModel.getByID(product.id)
        
        if(productToUpdate === undefined) {
            console.log(productToUpdate)
            response.end()
            return
        }

        if(product['temp-key'] !== tempKeyTest.key) {
            response.writeHead(400, {'Content-Type':'application/json'})
            response.write(JSON.stringify({ message: 'Temp key invalid' }))
            response.end()
            return
        }
        
        const productsEntries = Object.entries(product)
        
        const newProduct = {}

        productsEntries.forEach(pair => {
            const [ key, value ] = pair

            const propertyConfig = {
                value: value || productToUpdate[key],
                writable: true,
                enumerable: true
            }

            Object.defineProperty(newProduct, key, propertyConfig)
        })

        await ProductsModel.update(id, { ...newProduct })

        response.writeHead(200, { 'Content-Type': 'application/json' })
        response.end()

    } catch(error) {
        console.log(error)
        response.writeHead(400, { 'Content-Type': 'application/json' })
        response.write(JSON.stringify({ message: 'Bad request, try again.' }))
        response.end()
    }
}

const deleteProduct = async (request, response) => {
    try {
        const dataReceived = await Utils.getReceivedData(request, response)
        const product = JSON.parse(dataReceived)
        const { id } = product
        
        const productFound = await ProductsModel.getByID(id)

        if(productFound === undefined) {
            response.writeHead(400, { 'Content-Type': 'application/json' })
            response.write(JSON.stringify({ message: 'Product not found' }))
            response.end()
            return
        }

        if(product['temp-key'] !== tempKeyTest.key) {
            response.writeHead(400, { 'Content-Type': 'application/json' })
            response.write(JSON.stringify({ message: 'Your key is invalid. '}))
            response.end()
            return
        }

        await ProductsModel.deleteByID(Number(id))
        response.writeHead(202, { 'Content-Type': 'application/json' })
        response.write(JSON.stringify({ message: 'Your request was accept. Content deleted succefully' }))
        response.end()

    } catch(error) {
        response.writeHead(400, { 'Content-Type': 'application/json' })
        response.write(JSON.stringify({ message: 'Bad request, try again.'}))
        response.end()
    }
}

module.exports = { 
    getProducts,
    getProductByID,
    createProduct,
    createTempKey,
    deleteProduct,
    updateProduct
}