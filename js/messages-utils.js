const Utils = require('../utils')

const incorretPostFormat = new Utils.JSONMessageCreator('Error', 
400, 
'Incorret JSON format', 
'Use the format below to make POSTs request. Found \'id\' in your request.', 
{ ...Utils.productExample })

module.exports = {
    incorretPostFormat
}