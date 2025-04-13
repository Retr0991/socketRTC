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
            console.log('Received challenge verification request:', { username, signature });
            
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

            // TODO: check if user exists

            const challenge = await this.authService.sendChallenge(username);
            console.log('Challenge sent to user:', { challenge });

            res.status(200).json({ challenge });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async createUser(req: Request, res: Response): Promise<void> {
        const { username, publicKey } = req.body;
        console.log('Received user creation request:', { username, publicKey });

        // create new user

        // send success or failure response
    }

    async checkUsername(req: Request, res: Response): Promise<void> {
        const { username } = req.params;
        console.log('Received username check request:', { username });

        // check if user exists

        // send success or failure response
    }
}