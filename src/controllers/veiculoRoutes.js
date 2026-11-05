
const express = require("express");
const router = express.Router();

const veiculoController = require("./veiculoController");

// Rotas dos veículos
router.post("/", veiculoController.cadastrar);

router.get("/", veiculoController.listar);

router.get("/:id", veiculoController.buscarPorId);

router.put("/:id", veiculoController.atualizar);

router.delete("/:id", veiculoController.excluir);

module.exports = router;
