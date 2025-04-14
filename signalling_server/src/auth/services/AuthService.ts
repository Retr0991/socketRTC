import {
  generateChallenge,
  verifyChallenge,
} from "../utils/challengeHandler";
import { User } from "../database/models/Users";

export class AuthService {
  private challengeMapping: Map<string, string>;
  private userModel: typeof User;

  constructor() {
    this.challengeMapping = new Map<string, string>();
    this.userModel = User;
  }

  async sendChallenge(username: string): Promise<string> {
    console.log(`Creating challenge to ${username}`);
    const challenge = await generateChallenge(username);
    this.challengeMapping.set(username, challenge);

    return challenge;
  }

  async verifyChallenge(username: string, signature: string): Promise<boolean> {
    console.log(`Verifying challenge response for ${username}`);

    // get the challenge for the user
    const challenge = this.challengeMapping.get(username);
    if (!challenge) {
      console.log("No challenge found for user:", { username });
      return false;
    }
    this.challengeMapping.delete(username); // clear challenge

    const publicKey = await this.getUserPublicKey(username);
    if (!publicKey) {
      console.log("No public key found for user:", { username });
      return false;
    }

    return verifyChallenge(challenge, signature, publicKey);
  }

  async initiateHandshake(username: string): Promise<void> {
    console.log("Initiating handshake with user:", { username });
    // Logic to initiate a handshake with the user
  }

  async createUser(username: string, publicKey: string): Promise<void> {
    try {
      // Check if the username already exists
      const userExists = await this.checkUsername(username);
      if (userExists) {
        throw new Error("Username already exists");
      }

      const user = await this.userModel.create({
        username,
        publicKey,
      });
      console.log(`User created: ${user.username}`);
    } catch (error: any) {
      console.error("Error creating user:", error);
      throw new Error("User creation failed");
    }
  }

  async checkUsername(username: string): Promise<boolean> {
    const user = await this.userModel.findOne({
      where: { username },
    });
    if (user) return true;
    return false;
  }

  private async getUserPublicKey(username: string): Promise<CryptoKey> {
    try {
      const publicKey = await this.userModel.findOne({
        where: { username },
        attributes: ["publicKey"],
      });
      if (!publicKey) {
        throw new Error("Public Key not found.");
      }
      return await crypto.subtle.importKey(
        "spki",
        Uint8Array.from(atob(publicKey.publicKey), (c) => c.charCodeAt(0)),
        {
          name: "RSASSA-PKCS1-v1_5",
          hash: { name: "SHA-256" },
        },
        true,
        ["verify"]
      );
    } catch (error: any) {
      throw error;
    }
  }
}
