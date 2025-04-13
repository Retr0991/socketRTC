import express from 'express';
import { AuthController } from './auth/controllers/AuthController';

const app = express();

app.use(express.json());

const authController = new AuthController();

// Define auth routes
app.post('/auth/authorize', (req, res) => authController.authorize(req, res));
app.post('/auth/createUser', (req, res) => {
    // Handle user creation
    res.send('User creation endpoint');
});
app.get('/auth/checkUsername/:username', (req, res) => {
    const { username } = req.params;
    // Handle username check
    res.send(`Check username endpoint for ${username}`);
});
app.post(
  "/auth/verifyChallenge",
  authController.verifyChallenge.bind(authController),
  authController.initiateHandshake.bind(authController)
);

const PORT = 6969;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});