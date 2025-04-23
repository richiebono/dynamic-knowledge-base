import { UserController } from '@user/infrastructure/controllers/userController';
import { IUserCommandHandler } from '@user/application/interfaces/userCommandHandler';
import { IUserQueryHandler } from '@user/application/interfaces/userQueryHandler';
import { Request, Response } from 'express';
import { UserRoleEnum } from '@shared/domain/enum/userRole';

const mockUserCommandHandler: jest.Mocked<IUserCommandHandler> = {
    createUser: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
    loginUser: jest.fn(),
} as any;

const mockUserQueryHandler: jest.Mocked<IUserQueryHandler> = {
    getAllUsers: jest.fn(),
    getUserById: jest.fn(),
} as any;

const mockResponse = () => {
    const res: Partial<Response> = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res as Response;
};

describe('UserController', () => {
    let controller: UserController;

    beforeEach(() => {
        jest.clearAllMocks();
        controller = new UserController(mockUserCommandHandler, mockUserQueryHandler);
    });

    describe('createUser', () => {
        it('should create user and return 201', async () => {
            const req = { body: { name: 'test' } } as Request;
            const res = mockResponse();
            await controller.createUser(req, res);
            expect(mockUserCommandHandler.createUser).toHaveBeenCalledWith({ name: 'test' });
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ message: 'User created successfully' });
        });

        it('should handle errors and return 500', async () => {
            mockUserCommandHandler.createUser.mockRejectedValueOnce(new Error('fail'));
            const req = { body: {} } as Request;
            const res = mockResponse();
            await controller.createUser(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'fail' });
        });
    });

    describe('updateUser', () => {
        it('should update user and return 200', async () => {
            const req = { params: { id: '1' }, body: { name: 'updated' } } as any;
            const res = mockResponse();
            await controller.updateUser(req, res);
            expect(mockUserCommandHandler.updateUser).toHaveBeenCalledWith('1', { name: 'updated' });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'User updated successfully' });
        });

        it('should handle errors and return 500', async () => {
            mockUserCommandHandler.updateUser.mockRejectedValueOnce(new Error('fail'));
            const req = { params: { id: '1' }, body: {} } as any;
            const res = mockResponse();
            await controller.updateUser(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'fail' });
        });
    });

    describe('getAllUsers', () => {
        it('should return users with 200', async () => {
            mockUserQueryHandler.getAllUsers.mockResolvedValueOnce({
                users: [{ id: '1' } as any],
                total: 1,
                limit: 10,
                offset: 0,
            });
            const req = { query: {} } as any;
            const res = mockResponse();
            await controller.getAllUsers(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                users: [{ id: '1' }],
                total: 1,
                limit: 10,
                offset: 0,
            });
        });

        it('should handle errors and return 500', async () => {
            mockUserQueryHandler.getAllUsers.mockRejectedValueOnce(new Error('fail'));
            const req = { query: {} } as any;
            const res = mockResponse();
            await controller.getAllUsers(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'fail' });
        });
    });

    describe('getUserById', () => {
        it('should return user with 200', async () => {
            mockUserQueryHandler.getUserById.mockResolvedValueOnce({
                id: '1',
                name: 'Test User',
                email: 'test@example.com',
                role: UserRoleEnum.Viewer,
                createdAt: new Date(),
            });
            const req = { params: { id: '1' } } as any;
            const res = mockResponse();
            await controller.getUserById(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                id: '1',
                name: 'Test User',
                email: 'test@example.com',
                role: UserRoleEnum.Viewer,
                createdAt: expect.any(Date),
            });
        });

        it('should return 404 if user not found', async () => {
            mockUserQueryHandler.getUserById.mockResolvedValueOnce(null);
            const req = { params: { id: '1' } } as any;
            const res = mockResponse();
            await controller.getUserById(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
        });

        it('should handle errors and return 500', async () => {
            mockUserQueryHandler.getUserById.mockRejectedValueOnce(new Error('fail'));
            const req = { params: { id: '1' } } as any;
            const res = mockResponse();
            await controller.getUserById(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'fail' });
        });
    });

    describe('deleteUser', () => {
        it('should delete user and return 204', async () => {
            const req = { params: { id: '1' } } as any;
            const res = mockResponse();
            await controller.deleteUser(req, res);
            expect(mockUserCommandHandler.deleteUser).toHaveBeenCalledWith('1');
            expect(res.status).toHaveBeenCalledWith(204);
            expect(res.send).toHaveBeenCalled();
        });

        it('should handle errors and return 500', async () => {
            mockUserCommandHandler.deleteUser.mockRejectedValueOnce(new Error('fail'));
            const req = { params: { id: '1' } } as any;
            const res = mockResponse();
            await controller.deleteUser(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'fail' });
        });
    });

    describe('login', () => {
        it('should login and return token', async () => {
            mockUserCommandHandler.loginUser.mockResolvedValueOnce('token123');
            const req = { body: { email: 'a', password: 'b' } } as any;
            const res = mockResponse();
            await controller.login(req, res);
            expect(mockUserCommandHandler.loginUser).toHaveBeenCalledWith({ email: 'a', password: 'b' });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ token: 'token123' });
        });

        it('should handle errors and return 401', async () => {
            mockUserCommandHandler.loginUser.mockRejectedValueOnce(new Error('fail'));
            const req = { body: { email: 'a', password: 'b' } } as any;
            const res = mockResponse();
            await controller.login(req, res);
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: 'fail' });
        });
    });
});
