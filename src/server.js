
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// IMPORTAR ROTAS
const veiculoRoutes = require("./controllers/veiculoRoutes");

// CONFIGURAÇÕES
app.use(cors());
app.use(express.json());

// ROTA PRINCIPAL
app.get("/", (req, res) => {
  res.status(200).json({
    sucesso: true,
    mensagem: "API de Gestão de Veículos funcionando!"
  });
});

// ROTAS DO SISTEMA
app.use("/veiculos", veiculoRoutes);

// INICIAR SERVIDOR
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
