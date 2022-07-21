const getReceivedData = (request, response) => {
    return new Promise((resolve, reject) => {

        const buffer = []
        request.on('data', chunk => {
            buffer.push(chunk)

        })

        request.on('error', error => {
            reject(() => console.log('An error ocurred ' + error))
        })

        request.on('end', () => {
            if(buffer.length === 0) {
                response.writeHead(400, { 'Content-Type': 'text/html' })
                response.write(`<h1>Error</h1>`)
                response.write(`<p>The content must not be empty</p>`)
                response.end()
                return
            }
            resolve(Buffer.concat(buffer).toString())
        })
    })
}

const postProductExample = {
    
    product: 'Product Name',
    price: 9.99,
    available: 99,
    image: 'http://localhost',
    type: 'Product Type'
}

module.exports = {
    getReceivedData,
    postProductExample
}