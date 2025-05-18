import { UserService, RegisterUserDto, RegisteredUser } from '../user.service';
import UserModel from '../../models/User.model';
import { Types } from 'mongoose';

jest.mock('../../models/User.model');

describe('UserService - register', () => {
    let userService: UserService;
    let mockUserData: RegisterUserDto;
    let mockSavedUserDocument: any;
    let mockUserObject: RegisteredUser;

    beforeEach(() => {
        jest.clearAllMocks();

        userService = new UserService();
        mockUserData = {
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123',
        };

        mockUserObject = {
            _id: new Types.ObjectId(),
            name: mockUserData.name,
            email: mockUserData.email,
            role: 'user',
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),

        };

        mockSavedUserDocument = {
            ...mockUserData,
            _id: mockUserObject._id,
            role: mockUserObject.role,
            isActive: mockUserObject.isActive,
            createdAt: mockUserObject.createdAt,
            updatedAt: mockUserObject.updatedAt,

            toObject: jest.fn().mockReturnValue(mockUserObject),
        };

        (UserModel.findOne as jest.Mock).mockResolvedValue(null);
        (UserModel.prototype.save as jest.Mock) = jest.fn().mockResolvedValue(mockSavedUserDocument);
    });

    it('deve registrar um novo usuário com sucesso quando o email não existe', async () => {
        const result = await userService.register(mockUserData);

        expect(UserModel.findOne).toHaveBeenCalledWith({ email: mockUserData.email });
        expect(UserModel.prototype.save).toHaveBeenCalledTimes(1);


        expect(result).toEqual(mockUserObject);

        expect(result.email).toBe(mockUserData.email);
        expect(result.name).toBe(mockUserData.name);
        expect(result.role).toBe('user');
        expect(result).not.toHaveProperty('password');
    });

    it('deve lançar um erro se o email já estiver cadastrado', async () => {
        (UserModel.findOne as jest.Mock).mockResolvedValue({
            _id: new Types.ObjectId(),
            email: mockUserData.email,
            name: 'Existing User',
        });

        await expect(userService.register(mockUserData))
            .rejects
            .toThrow('Email já cadastrado.');

        expect(UserModel.prototype.save).not.toHaveBeenCalled();
    });

});