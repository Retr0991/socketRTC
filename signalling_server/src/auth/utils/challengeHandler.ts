
export const generateChallenge = async (username: string): Promise<string> => {
    const nonce = crypto.randomUUID();
    const timestamp = Date.now();
    const challenge = JSON.stringify({ username, nonce, timestamp });

    return challenge;
}

export const verifyChallenge = async (
    challenge: string,
    signature: string,
    clientPublicKey: CryptoKey
): Promise<boolean> => {

    const encoder = new TextEncoder();
    const data = encoder.encode(challenge);
    return await crypto.subtle.verify(
      { name: "RSASSA-PKCS1-v1_5" },
      clientPublicKey,
      Uint8Array.from(atob(signature), (c) => c.charCodeAt(0)),
      data
    );
}
