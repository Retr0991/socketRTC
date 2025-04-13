import {
  generateChallenge,
  shitfunction,
  verifyChallenge,
} from "../utils/challengeHandler";

export class AuthService {
  private challengeMapping: Map<string, string>;
  private userPublicKeys: Map<string, CryptoKey>;
  constructor() {
    this.challengeMapping = new Map<string, string>();
    this.userPublicKeys = new Map<string, CryptoKey>();
  }

  async sendChallenge(username: string): Promise<string> {
    console.log("Creating challenge to user:", { username });
    const publicKey = await this.getUserPublicKey(username);
    console.log("Public key for user:", { publicKey });

    const challenge = await generateChallenge(username);
    console.log("Generated challenge:", { challenge });
    this.challengeMapping.set(username, challenge);

    return challenge;
  }

  async verifyChallenge(
    username: string,
    signature: string
  ): Promise<boolean> {
    console.log("Verifying challenge response for user:", { username });

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

    return verifyChallenge(
      challenge,
      signature,
      publicKey
    );
  }

  async initiateHandshake(username: string): Promise<void> {
    console.log("Initiating handshake with user:", { username });
    // Logic to initiate a handshake with the user
  }

  async createUser(username: string, publicKey: string): Promise<void> {
    console.log("Creating user:", { username, publicKey });
    // Logic to create a new user
  }

  async checkUsername(username: string): Promise<boolean> {
    console.log("Checking if username exists:", { username });
    // Logic to check if the username exists
    return true; // Placeholder return value
  }

  private async getUserPublicKey(username: string): Promise<CryptoKey> {
    try {
      console.log("Getting public key for user:", { username });
      let publicKey = this.userPublicKeys.get(username);
        if (!publicKey) {
            const testKeyPair = await shitfunction();
            this.userPublicKeys.set(username, testKeyPair.publicKey);
            publicKey = this.userPublicKeys.get(username);
            // throw new Error("Public Key not found.")
        };
      return publicKey!;
    } catch (error: any) {
      throw error;
    }
  }
}
