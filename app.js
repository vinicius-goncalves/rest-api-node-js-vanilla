const http = require('http')

const { getProducts, createProduct } = require('./controllers/ProductsControllers')
const port = process.env.PORT || 8080

const server = http.createServer((request, response) => {
    const { method, url } = request

    switch(method.toLowerCase()) {
        case 'get':
            if(request.url === '/api/products') {
                getProducts(request, response)
                break
            }
        case 'post':
            if(request.url === '/api/products/create') {
                createProduct(request, response)
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