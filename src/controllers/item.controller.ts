import { Request, Response } from "express";
import OcorrenciaModel from "../models/ocorrencia.model";
import { IAuthenticatedRequest } from "../middlewares/auth.middleware";

// Cadastro de Ocorrência
export const cadastrarOcorrencia = async (
  req: IAuthenticatedRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Usuário não autenticado." });
    }

    const { ocorrencia } = req.body;

    if (
      !ocorrencia ||
      !ocorrencia.ocorrencia ||
      !ocorrencia.local ||
      !ocorrencia.situacao ||
      !ocorrencia.status ||
      !ocorrencia.item ||
      !ocorrencia.item.nome ||
      !ocorrencia.item.descricao
    ) {
      console.warn("Dados da ocorrência incompletos:", ocorrencia);
      return res
        .status(400)
        .json({ message: "Dados da ocorrência incompletos." });
    }

    const novaOcorrencia = new OcorrenciaModel({
      usuario_id: req.user._id,
      ocorrencia: new Date(ocorrencia.ocorrencia),
      local: ocorrencia.local,
      situacao: ocorrencia.situacao,
      status: ocorrencia.status,
      item: {
        nome: ocorrencia.item.nome,
        descricao: ocorrencia.item.descricao,
        imagens: ocorrencia.item.imagens || [],
      },
    });

    await novaOcorrencia.save();

    return res.status(201).json({
      status: "success",
      message: "Ocorrência e item cadastrados com sucesso.",
    });
  } catch (error) {
    console.error("Erro ao cadastrar ocorrência:", error);
    return res
      .status(500)
      .json({ message: "Erro interno ao cadastrar ocorrência." });
  }
};

// Consulta de Ocorrências com filtros
export const consultarOcorrencias = async (
  req: IAuthenticatedRequest,
  res: Response
) => {
  try {
    const { data, nome, situacao } = req.query;

    const filtros: any = {};

    if (data) {
      const dataObj = new Date(data as string);
      const diaSeguinte = new Date(dataObj);
      diaSeguinte.setDate(dataObj.getDate() + 1);

      filtros.ocorrencia = {
        $gte: dataObj,
        $lt: diaSeguinte,
      };
    }

    if (situacao && ["Perdido", "Achado"].includes(situacao as string)) {
      filtros.situacao = situacao;
    }

    if (nome) {
      filtros["item.nome"] = { $regex: new RegExp(nome as string, "i") };
    }

    const ocorrencias = await OcorrenciaModel.find(filtros).lean();

    const resposta = ocorrencias.map((o) => ({
      ocorrencia: {
        usuario_id: o.usuario_id,
        ocorrencia: o.ocorrencia,
        local: o.local,
        situacao: o.situacao,
        status: o.status,
        item: o.item,
      },
    }));

    return res.json(resposta);
  } catch (error) {
    console.error("Erro ao consultar ocorrências:", error);
    return res
      .status(500)
      .json({ message: "Erro interno ao consultar ocorrências." });
  }
};

//Consultar por usuário
export const consultarHistoricoUsuario = async (
  req: IAuthenticatedRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Usuário não autenticado." });
    }

    // Busca todas as ocorrências do usuário logado
    const ocorrencias = await OcorrenciaModel.find({
      usuario_id: req.user._id,
    }).lean();

    const resposta = ocorrencias.map((o) => ({
      ocorrencia: {
        _id: o._id,
        usuario_id: o.usuario_id,
        ocorrencia: o.ocorrencia,
        local: o.local,
        situacao: o.situacao,
        status: o.status,
        item: o.item,
      },
    }));

    return res.json(resposta);
  } catch (error) {
    console.error("Erro ao consultar histórico do usuário:", error);
    return res
      .status(500)
      .json({ message: "Erro interno ao consultar histórico." });
  }
};

export const alterarStatusOcorrencia = async (
  req: IAuthenticatedRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ status: "error", message: "Usuário não autenticado." });
    }

    const { ocorrencia_id, novo_status } = req.body;

    if (!ocorrencia_id || !novo_status) {
      return res.status(400).json({
        status: "error",
        message: "Parâmetros obrigatórios não fornecidos.",
      });
    }

    // Buscar ocorrência
    const ocorrencia = await OcorrenciaModel.findById(ocorrencia_id);

    if (!ocorrencia) {
      return res
        .status(404)
        .json({ status: "error", message: "Ocorrência não encontrada." });
    }

    const usuario = req.user;

    const permissoesCriador = ["Encontrado", "Entregue", "Cancelado"];
    const ehCriador = ocorrencia.usuario_id.equals(usuario._id);
    const ehAdmin = usuario.role === "admin";

    if (!ehAdmin && !ehCriador) {
      return res.status(403).json({
        status: "error",
        message:
          "Você não tem permissão para alterar o status desta ocorrência.",
      });
    }

    if (ehCriador && !permissoesCriador.includes(novo_status)) {
      return res.status(403).json({
        status: "error",
        message: `Usuários criadores podem alterar status apenas para: ${permissoesCriador.join(
          ", "
        )}.`,
      });
    }

    // Atualizar status
    ocorrencia.status = novo_status;
    await ocorrencia.save();

    return res.status(200).json({
      status: "success",
      message: "Status da ocorrência alterado com sucesso.",
    });
  } catch (error) {
    console.error("Erro ao alterar status da ocorrência:", error);
    return res.status(500).json({
      status: "error",
      message: "Erro interno ao alterar status da ocorrência.",
    });
  }
};
