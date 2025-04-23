import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { IUserCommandHandler } from '@user/application/interfaces/userCommandHandler';
import { IUserQueryHandler } from '@user/application/interfaces/userQueryHandler';
import { LoginUser } from '@user/application/useCases/loginUser';
import { LoginDTO } from '@user/application/DTOs/userDTO';

@injectable()
export class UserController {
    private userCommandHandler: IUserCommandHandler;
    private userQueryHandler: IUserQueryHandler;

    constructor(
        @inject("IUserCommandHandler") userCommandHandler: IUserCommandHandler,
        @inject("IUserQueryHandler") userQueryHandler: IUserQueryHandler
    ) {
        this.userCommandHandler = userCommandHandler;
        this.userQueryHandler = userQueryHandler;
    }

    public async createUser(req: Request, res: Response): Promise<void> {
        try {
            const userDTO = req.body;
            await this.userCommandHandler.createUser(userDTO);
            res.status(201).json({ message: 'User created successfully' });
        } catch (error) {
            console.error("User creation error:", error); console.error("User creation error:", error); console.error("User creation error:", error); const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred on createUser';
            res.status(500).json({ message: errorMessage });
        }
    }

    public async updateUser(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.params.id;
            const userDTO = req.body;
            await this.userCommandHandler.updateUser(userId, userDTO);
            res.status(200).json({ message: 'User updated successfully' });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred on updateUser';
            res.status(500).json({ message: errorMessage });
        }
    }

    public async getAllUsers(req: Request, res: Response): Promise<void> {
        try {
            const limit = parseInt(req.query.limit as string) || 10;
            const offset = parseInt(req.query.offset as string) || 0;
            const orderBy = (req.query.orderBy as string) || 'createdAt';
            const orderDirection = (req.query.orderDirection as string)?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
            const users = await this.userQueryHandler.getAllUsers(limit, offset, orderBy, orderDirection);
            res.status(200).json(users);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred on getAllUsers';
            res.status(500).json({ message: errorMessage });
        }
    }

    public async getUserById(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.params.id;
            const user = await this.userQueryHandler.getUserById(userId);
            if (!user) {
                res.status(404).json({ message: 'User not found' });
                return;
            }
            res.status(200).json(user);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred on getUserById';
            res.status(500).json({ message:errorMessage });
        }
    }

    public async deleteUser(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.params.id;
            await this.userCommandHandler.deleteUser(userId);
            res.status(204).send();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred on deleteUser';
            res.status(500).json({ message:errorMessage });
        }
    }

    public async login(req: Request, res: Response): Promise<void> {
        try {
            const loginDTO: LoginDTO = req.body;
            const token = await this.userCommandHandler.loginUser(loginDTO);
            res.status(200).json({ token });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred on login';
            res.status(401).json({ message: errorMessage });
        }
    }
}