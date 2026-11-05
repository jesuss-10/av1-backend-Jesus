
const prisma = require("../prisma");

// CADASTRAR VEICULO
async function cadastrar(req, res) {
  try {
    const {
      modelo,
      marca,
      ano,
      placa,
      valorDiaria,
      disponivel
    } = req.body;

    if (!modelo || !marca || !ano || !placa || valorDiaria === undefined) {
      return res.status(400).json({
        mensagem: "Preencha todos os campos obrigatórios."
      });
    }

    if (
      !Number.isInteger(Number(ano)) ||
      Number(ano) < 1900 ||
      Number(ano) > 2100 ||
      !Number.isFinite(Number(valorDiaria)) ||
      Number(valorDiaria) <= 0
    ) {
      return res.status(400).json({
        mensagem: "Ano ou valor da diária inválido."
      });
    }

    const veiculo = await prisma.veiculo.create({
      data: {
        modelo,
        marca,
        ano: Number(ano),
        placa: placa.toUpperCase(),
        valorDiaria: Number(valorDiaria),
        disponivel: disponivel ?? true
      }
    });

    return res.status(201).json({
      mensagem: "Veículo cadastrado com sucesso!",
      veiculo
    });

  } catch (erro) {
    if (erro.code === "P2002") {
      return res.status(400).json({
        mensagem: "Esta placa já está cadastrada."
      });
    }

    return res.status(500).json({
      mensagem: "Erro ao cadastrar veículo."
    });
  }
}

// LISTAR VEICULOS
async function listar(req, res) {
  try {
    const veiculos = await prisma.veiculo.findMany({
      orderBy: {
        id: "desc"
      }
    });

    return res.json(veiculos);

  } catch (erro) {
    return res.status(500).json({
      mensagem: "Erro ao listar veículos."
    });
  }
}

// BUSCAR VEICULO POR ID
async function buscarPorId(req, res) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        mensagem: "ID inválido."
      });
    }

    const veiculo = await prisma.veiculo.findUnique({
      where: { id }
    });

    if (!veiculo) {
      return res.status(404).json({
        mensagem: "Veículo não encontrado."
      });
    }

    return res.json(veiculo);

  } catch (erro) {
    return res.status(500).json({
      mensagem: "Erro ao buscar veículo."
    });
  }
}

// ATUALIZAR VEICULO
async function atualizar(req, res) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        mensagem: "ID inválido."
      });
    }

    const {
      modelo,
      marca,
      ano,
      placa,
      valorDiaria,
      disponivel
    } = req.body;

    const dados = {};

    if (modelo !== undefined) dados.modelo = modelo;
    if (marca !== undefined) dados.marca = marca;

    if (ano !== undefined) {
      if (
        !Number.isInteger(Number(ano)) ||
        Number(ano) < 1900 ||
        Number(ano) > 2100
      ) {
        return res.status(400).json({
          mensagem: "Ano inválido."
        });
      }

      dados.ano = Number(ano);
    }

    if (placa !== undefined) {
      dados.placa = placa.toUpperCase();
    }

    if (valorDiaria !== undefined) {
      if (!Number.isFinite(Number(valorDiaria)) || Number(valorDiaria) <= 0) {
        return res.status(400).json({
          mensagem: "Valor da diária inválido."
        });
      }

      dados.valorDiaria = Number(valorDiaria);
    }

    if (disponivel !== undefined) {
      if (typeof disponivel !== "boolean") {
        return res.status(400).json({
          mensagem: "Disponibilidade inválida."
        });
      }

      dados.disponivel = disponivel;
    }

    const veiculo = await prisma.veiculo.update({
      where: { id },
      data: dados
    });

    return res.json({
      mensagem: "Veículo atualizado com sucesso!",
      veiculo
    });

  } catch (erro) {
    if (erro.code === "P2025") {
      return res.status(404).json({
        mensagem: "Veículo não encontrado."
      });
    }

    if (erro.code === "P2002") {
      return res.status(400).json({
        mensagem: "Esta placa já está cadastrada."
      });
    }

    return res.status(500).json({
      mensagem: "Erro ao atualizar veículo."
    });
  }
}

// EXCLUIR VEICULO
async function excluir(req, res) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        mensagem: "ID inválido."
      });
    }

    await prisma.veiculo.delete({
      where: { id }
    });

    return res.json({
      mensagem: "Veículo excluído com sucesso!"
    });

  } catch (erro) {
    if (erro.code === "P2025") {
      return res.status(404).json({
        mensagem: "Veículo não encontrado."
      });
    }

    return res.status(500).json({
      mensagem: "Erro ao excluir veículo."
    });
  }
}

module.exports = {
  cadastrar,
  listar,
  buscarPorId,
  atualizar,
  excluir
};
