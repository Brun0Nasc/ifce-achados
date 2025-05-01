import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcrypt';
export interface IUser extends Document {
    name: string;
    email: string;
    password?: string;
    role?: string;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

// Interface para tipagem do Model (para métodos estáticos, se houver)
export interface IUserModel extends Model<IUser> {
    // Definir métodos estáticos aqui se precisar
}

const UserSchema: Schema<IUser> = new Schema(
    {
        name: { type: String, required: true },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            select: false,
        },
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

const UserModel = mongoose.model<IUser, IUserModel>('User', UserSchema);
export default UserModel;