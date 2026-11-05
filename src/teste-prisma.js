
const prisma = require("./prisma");

async function testarConexao() {
    try {
        await prisma.$connect();

        console.log("================================");
        console.log("CONEXÃO COM O BANCO DE DADOS OK!");
        console.log("================================");

        const usuarios = await prisma.usuario.findMany();
        const veiculos = await prisma.veiculo.findMany();

        console.log("Usuários cadastrados:", usuarios.length);
        console.log("Veículos cadastrados:", veiculos.length);

    } catch (erro) {
        console.error("ERRO NA CONEXÃO:", erro);
    } finally {
        await prisma.$disconnect();
    }
}

testarConexao();
