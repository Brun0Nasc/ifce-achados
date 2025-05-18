import mongoose, { Schema, Document, Model, Types } from 'mongoose';
import bcrypt from 'bcrypt';
export interface IUser extends Document {
    _id: Types.ObjectId | string;
    name: string;
    email: string;
    matricula: string;
    instituicao: string;
    password?: string;
    role: 'user' | 'admin' | 'moderator';
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    lastLogin: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

// Interface para tipagem do Model (para métodos estáticos, se houver)
export interface IUserModel extends Model<IUser> {
    // Definir métodos estáticos aqui se precisar
}

const UserSchema: Schema<IUser> = new Schema(
    {
        name: { 
            type: String, 
            required: [true, 'O nome é obrigatório.'],
            trim: true,
        },
        matricula: { 
            type: String, 
            required: [true, 'A matrícula é obrigatório.'],
            trim: true,
        },
        instituicao: { 
            type: String, 
            required: [true, 'O nome da instituição é obrigatório.'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'O e-mail é obrigatório.'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/.+\@.+\..+/, 'Por favor, insira um email válido.'],
        },
        password: {
            type: String,
            required: [true, 'A senha é obrigatória.'],
            select: false,
        },
        role: {
            type: String,
            enum: ['user', 'admin', 'moderator'],
            default: 'user',
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        lastLogin: {
            type: Date,
        }
    },
    {
        timestamps: true,
    }
);

UserSchema.pre<IUser>('save', async function (next) {
    if (!this.isModified('password') || !this.password) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        if (error instanceof Error) {
            return next(error);
        }
        return next(new Error('Erro ao fazer hash da senha'));
    }
});

UserSchema.methods.comparePassword = async function (
    candidatePassword: string
): Promise<boolean> {
    if (!this.password) {
         return false;
    }
    return bcrypt.compare(candidatePassword, this.password);
};

const UserModel = mongoose.model<IUser, IUserModel>('Users', UserSchema);
export default UserModel;