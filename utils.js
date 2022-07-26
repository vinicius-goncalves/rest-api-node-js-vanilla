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

function JSONMessageCreator(status, codeStatus, title, message, correctForm = null) {
    this.status = status
    this.codeStatus = codeStatus
    this.title = title
    this.message = message
    this.correctForm = correctForm
}

const productExample = {
    
    product: 'Product Name',
    price: 9.99,
    available: 99,
    image: 'http://localhost',
    type: 'Product Type',
    key: 'Your temp-key. Check if your temp-key is not missing in your post request'

}

const randomUUID = () => {
    let dateTime = new Date().getTime()
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const random = Math.floor(dateTime + Math.random() * 16) % 16 | 0
        dateTime = Math.floor(dateTime / 16)
        return (c === 'x' ? random : (random & 0x3 | 0x8)).toString(16)
    })
    return uuid
}

module.exports = {
    getReceivedData,
    productExample,
    JSONMessageCreator,
    randomUUID
}