// Imports
require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const app = express()

// Config JSON
app.use(express.json())

// Models
const usuario = require('./models/usuario')

// Rota aberta - Rota pública - Página principal
app.use(express.static('front-end'))
app.get('/', (req, res) => {
    res.sendFile(__dirname+'/front-end/Cadastro/cadastro.html')
})

// registrar usuário
app.post('/auth/cadastro', async(req, res) =>{
    const {Nome,Email,Senha,Conf_senha} = req.body

    const userExiste = await usuario.findOne({
        Email: Email
    })

    if(userExiste){
        return res.status(422).json({
            msg: 'Email já está cadastrado'
        })
    }

    const salt = await bcrypt.genSalt(10)
    const SenhaHash = await bcrypt.hash(Senha, salt)

    const Usuario = new usuario({
        Nome, 
        Email,
        Senha: SenhaHash,
    })

    try{
        await Usuario.save()
        res.status(201).json({
            msg: "Usuário criado com sucesso!"
        })
    }
    catch(err){
        console.log(err)

        res.status(500).json(error)
    }
})

// credenciais 

mongoose
.connect(`mongodb+srv://dmthysgo:0123@cluster0.cr4w0re.mongodb.net/DataBase?retryWrites=true&w=majority`)
.then(() => {
    app.listen(3000)

    console.log('Conectado com o mongoDB')
})
.catch((err) => console.log(err))
