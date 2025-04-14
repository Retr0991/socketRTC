import { NextFunction, Request, Response } from 'express';
import { AuthService } from '../services/AuthService';


export class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    async verifyChallenge(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { username, signature } = req.body;
            console.log('Received challenge verification request');
            
            const isValid = await this.authService.verifyChallenge(username, signature);
            if (isValid) {
                console.log('Challenge verification successful');
                next();
            }
            else {
                console.log('Challenge verification failed');
                res.status(400).json({ message: 'Challenge verification failed' });
            }
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async initiateHandshake(req: Request, res: Response): Promise<void> {
        try {
            res.status(200).json({ status: "Handshake initiated :)" });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async authorize(req: Request, res: Response): Promise<void> {
        try {
            const { username } = req.body;
            console.log('Received authorization request:', { username });

            const challenge = await this.authService.sendChallenge(username);
            console.log(`Challenge sent to ${username}`, { challenge });

            res.status(200).json({ challenge });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async createUser(req: Request, res: Response): Promise<void> {
        try {
            const { username, publicKey } = req.body;
            console.log('Received user creation request');
            await this.authService.createUser(username, publicKey);
            res.status(201).json({ message: 'User created successfully' });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async checkUsername(req: Request, res: Response): Promise<void> {
        const { username } = req.params;
        console.log('Received username check request:', { username });
        try {
            const exists = await this.authService.checkUsername(username);
            if (exists) {
                res.status(200).json({ exists: true });
            } else {
                res.status(404).json({ exists: false });
            }
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}