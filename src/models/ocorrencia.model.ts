import mongoose, { Schema, Document } from "mongoose";

interface IItem {
  nome: string;
  descricao: string;
  imagens: string[];
}

export interface IOcorrencia extends Document {
  usuario_id: mongoose.Types.ObjectId;
  ocorrencia: Date;
  local: string;
  situacao: string;
  status: string;
  item: IItem;
}

const ItemSchema = new Schema<IItem>({
  nome: { type: String, required: true },
  descricao: { type: String, required: true },
  imagens: { type: [String], default: [] },
});

const OcorrenciaSchema = new Schema<IOcorrencia>(
  {
    usuario_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ocorrencia: { type: Date, required: true },
    local: { type: String, required: true },
    situacao: { type: String, required: true },
    status: { type: String, required: true },
    item: { type: ItemSchema, required: true },
  },
  {
    timestamps: true,
  }
);

const OcorrenciaModel = mongoose.model<IOcorrencia>(
  "Ocorrencia",
  OcorrenciaSchema
);

export default OcorrenciaModel;
