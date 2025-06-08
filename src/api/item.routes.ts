import { Router } from "express";
import {
  cadastrarOcorrencia,
  consultarOcorrencias,
} from "../controllers/item.controller";
import { protect } from "../middlewares/auth.middleware";
import { consultarHistoricoUsuario } from "../controllers/item.controller";
import { alterarStatusOcorrencia } from "../controllers/item.controller";

const router = Router();

router.post("/cadastro", protect, cadastrarOcorrencia);
router.get("/consulta", protect, consultarOcorrencias);
router.get("/historico", protect, consultarHistoricoUsuario);
router.put("/status", protect, alterarStatusOcorrencia);

export default router;
