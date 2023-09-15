// Imports
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const app = express();

// Config JSON
app.use(express.json());

// Models
const usuario = require("./models/usuario");

// Rota aberta - Rota pública - Página principal
app.use(express.static("front-end"));
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/front-end/login/login.html");
});

// registrar usuário
app.post("/auth/cadastro", async (req, res) => {
    const { Nome, Email, Senha, Conf_senha } = req.body;

    const userExiste = await usuario.findOne({
        Email: Email,
    });

    if (userExiste) {
        return res.status(422).json({
            msg: "Email já está cadastrado",
        });
    }

    const salt = await bcrypt.genSalt(10);
    const SenhaHash = await bcrypt.hash(Senha, salt);

    const Usuario = new usuario({
        Nome,
        Email,
        Senha: SenhaHash,
    });

    try {
        await Usuario.save();
        res.status(201).json({
            msg: "Usuário criado com sucesso!",
        });
    } catch (err) {
        console.log(err);

        res.status(500).json(error);
    }
});

// login

app.get("/auth/login", async (req, res) =>{
    const {Email, Senha} = req.body

        if(!Email){
            return res.status(422).json({msg: 'Email obrigatório'})
        }

        if(!Senha){
            return res.status(422).json({msg: 'Senha obrigatório'})
        }

        const user = await usuario.findOne({Email: Email})
        
        if(!Email){
            return res.status(404).json({msg: 'Usuário não encontrado'})
        }

        const valida_Senha = await bcrypt.compare(Senha, user.Senha) 

        if(!valida_Senha){
            return res.status(422).json({mgs: 'Senha inválida'})
        }

        try {
            const Segredo = process.env.SEGREDO

            const token = jwt.sign({
                id: user._id
            }, 
                Segredo
            );

            res.status(200).json({msg: 'Login realizado com sucesso!', id: user._id, token})

        } catch (error) {
            console.log(err)
        }
        
})

// credenciais

mongoose
    .connect(
        `mongodb+srv://messiasdb:vuda-b8f9@apiproject.rkwieor.mongodb.net/messiasdb?retryWrites=true&w=majority`
    )
    .then(() => {
        app.listen(3000);

        console.log("Conectado com o mongoDB");
    })
    .catch((err) => console.log(err));
