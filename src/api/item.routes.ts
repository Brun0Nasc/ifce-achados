import { Router } from "express";
import {
  cadastrarOcorrencia,
  consultarOcorrencias,
} from "../controllers/item.controller";
import { protect } from "../middlewares/auth.middleware";
import { consultarHistoricoUsuario } from "../controllers/item.controller";
import { alterarStatusOcorrencia } from "../controllers/item.controller";

const router = Router();

function asyncHandler(fn: any) {
  return function (req: any, res: any, next: any) {
    Promise.resolve(fn(req, res, next)).then(() => undefined).catch(next);
  };
}

router.post("/cadastro", protect, asyncHandler(cadastrarOcorrencia));
router.get("/consulta", protect, asyncHandler(consultarOcorrencias));
router.get("/historico", protect, asyncHandler(consultarHistoricoUsuario));
router.put("/status", protect, asyncHandler(alterarStatusOcorrencia));

export default router;
