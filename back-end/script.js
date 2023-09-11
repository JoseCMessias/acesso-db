require('dotenv').config()

const usuario = require('./models/usuario')

const express = require('express')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const app = express()



app.use(express.json())

app.use(express.static('../front-end'))

app.get('/', (req, res) => {
    res.sendFile('C:/Users/Messias/Desktop/Projetos/Frag. Projetos/Acesso/Acesso top/login-validado/front-end/Cadastro/cadastro.html')
})


// registrar usuário
app.post('/auth/cadastro', async(req, res) =>{
    const { Nome, Email, Senha, ConfirSenha} = req.body

    const userExiste = await usuario.findOne({
        Email: email
    })

    if(userExiste){
        return res.status(422).json({
            msg: 'Email já está cadastrado'
        })
    }

    const salt = await bcrypt.genSalt(10)
    const SenhaHash = await bcrypt.hash(Senha, salt)

    const usuario = new usuario({
        Nome, 
        Email,
        Senha:SenhaHash,
    })

    try{
        await usuario.save()
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

const DB_USER = process.env.DB_USER
const DB_PASS = process.env.DB_PASS

mongoose
.connect(`mongodb+srv://${DB_USER}:${DB_PASS}@apiproject.rkwieor.mongodb.net/messiasdb?retryWrites=true&w=majority`)
.then(() => {
    app.listen(3000)

    console.log('Conectado com o mongoDB')
})
.catch((err) => console.log(err))
