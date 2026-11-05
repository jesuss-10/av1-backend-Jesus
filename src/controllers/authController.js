
const prisma = require("../prisma");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// CADASTRO DE USUARIO
async function cadastrar(req, res) {
    try {
        const { nome, email, senha } = req.body;

        if (!nome || !email || !senha) {
            return res.status(400).json({
                mensagem: "Preencha todos os campos."
            });
        }

        if (!email.includes("@") || senha.length < 6) {
            return res.status(400).json({
                mensagem: "Email ou senha invalida."
            });
        }

        const existe = await prisma.usuario.findUnique({
            where: { email }
        });

        if (existe) {
            return res.status(409).json({
                mensagem: "Email ja cadastrado."
            });
        }

        const senhaHash = await bcrypt.hash(senha, 10);

        const usuario = await prisma.usuario.create({
            data: {
                nome,
                email,
                senha: senhaHash
            },
            select: {
                id: true,
                nome: true,
                email: true
            }
        });

        return res.status(201).json({
            mensagem: "Usuario cadastrado!",
            usuario
        });

    } catch (erro) {
        console.error(erro);
        return res.status(500).json({
            mensagem: "Erro ao cadastrar usuario."
        });
    }
}

// LOGIN
async function login(req, res) {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({
                mensagem: "Informe email e senha."
            });
        }

        const usuario = await prisma.usuario.findUnique({
            where: { email }
        });

        if (!usuario) {
            return res.status(401).json({
                mensagem: "Email ou senha incorretos."
            });
        }

        const senhaValida = await bcrypt.compare(
            senha,
            usuario.senha
        );

        if (!senhaValida) {
            return res.status(401).json({
                mensagem: "Email ou senha incorretos."
            });
        }

        const token = jwt.sign(
            {
                id: usuario.id,
                email: usuario.email
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        return res.status(200).json({
            mensagem: "Login realizado!",
            token,
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email
            }
        });

    } catch (erro) {
        console.error(erro);
        return res.status(500).json({
            mensagem: "Erro ao realizar login."
        });
    }
}

module.exports = {
    cadastrar,
    login
};
