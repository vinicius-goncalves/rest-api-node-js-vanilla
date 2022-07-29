const http = require('http')
const fs = require('fs')
const path = require('path')

const ProductControllers = require('./controllers/ProductsControllers')

const port = process.env.PORT || 8080

const indexHtmlPath = path.join(__dirname, 'view', 'index.html')

const server = http.createServer((request, response) => {
    const { method, url } = request

    switch(method.toLowerCase()) {
        case 'get':

            if(url.indexOf('.html') !== -1 && url === '/index.html') {
                fs.readFile(indexHtmlPath, (error, data) => {
                    if(error) {
                        return console.log(error)
                    }
        
                    response.writeHead(200, { 'Content-Type': 'text/html;charset=UTF-8' })
                    response.write(data)
                    response.end()
                })
                break
            }
    
            if(url === '/api/products') {
                ProductControllers.getProducts(request, response)
                break
            }
            
            if(url.match(/\/api\/product\/[0-9]/g)) {
                const id = url.split('/')[3]
                ProductControllers.getProductByID(request, response, id)
                break
            }

            if(url === '/api/temp_key') {
                ProductControllers.createTempKey(request, response)
                break
            }

        case 'post':
            if(url === '/api/product/create') {
                ProductControllers.createProduct(request, response)
                break
            }

        case 'delete':
            if(url === '/api/product/delete') {
                ProductControllers.deleteProduct(request, response)
                break
            }
        default:
            response.writeHead(404, { 'Content-Type': 'application/json' })
            response.write('Error 404 - Not found')
            response.end()
            break
    }
})

const messageListenPort = () => {

    const actualDate = new Date()
    const formattedActualDate = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' }).format(actualDate)

    return console.log(`vinicius-goncalves.com | Listen at port ${port} at ${formattedActualDate}`)
}

server.listen(port, messageListenPort)