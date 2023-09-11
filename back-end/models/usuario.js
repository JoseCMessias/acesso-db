const mongoose = require('mongoose')

const usuario = mongoose.model('usuario', {
    Nome: String,
    Email: String,
    Senha: String
})

module.exports = usuario