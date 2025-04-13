
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

export const shitfunction = async (): Promise<CryptoKeyPair> => {
    const pubkey = `MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAv
    4TquEM1YRgRVOf/CI8liBwtQXNRP7yihyPTfoTwec+CaRWA03ttlqb9t7f/Fs
    mK/HwXfYUH40VWE6zd3kX0T/Hejp54GDA6k79iOjnB+ZuRqOSU1BHM8f8Q+6V
    WWjLkPBqntiNsms7/zms/iYHk4/t8ko6As63H6gMlKKFv7WVBjqWRBsMGiUwT
    nDLtlavXAFoqFB06WJx/hvsqPFWav7vQYKerhWnCgmX1eJ6QdzyfxEP5bgBap
    HAt0xX7c6aHto7RUNsMxqacxAC3fyaNqxp1tNa/BXxnS11qRw93iU4hppUeLu
    cX4wiTuUxKfQkT2bfgGo8lYyKMrRtxbgMRWwIDAQAB`;
    const priKey = `MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC/hOq4QzVhGBFU5/8IjyW
    IHC1Bc1E/vKKHI9N+hPB5z4JpFYDTe22Wpv23t/8WyYr8fBd9hQfjRVYTrN3eRfRP8d6OnngYMDqTv2I6OcH5m5Go5JTUEczx
    /xD7pVZaMuQ8Gqe2I2yazv/Oaz+JgeTj+3ySjoCzrcfqAyUooW/tZUGOpZEGwwaJTBOcMu2Vq9cAWioUHTpYnH+G+yo8VZq
    /u9Bgp6uFacKCZfV4npB3PJ/EQ/luAFqkcC3TFftzpoe2jtFQ2wzGppzEALd/Jo2rGnW01r8FfGdLXWpHD3eJTiG
    mlR4u5xfjCJO5TEp9CRPZt+AajyVjIoytG3FuAxFbAgMBAAECggEAHFir9QHdkLVjO1HrKXUmdPLWr+1FhU2CMMZYs0
    0x2pWgE7WfD64hFj85JkwRcWn7LEuhnm5mMHk+uELJw/BOrNZ7vlguJkZdJSkafMu3rh4cfQb4EDtiPh8mgFiEY21M4
    qh/UjIEDRW+PusYyF11Z1j9oyN8YRvDjxtQEKd0TYqBICG1rdBmNXm0fCokyjUJCIf8Vh9WIKVi0x9yqz2EGmnnnS59
    KoRs6Q95D3sWjJutciHwNmv5tVPZ9Q/2xGyfjXnkFq7UKdMVopIOpNtkjlZ5g2n0/DozUxdmgl+CRimD/ICiYbpIRKZ
    imfKWft44vbhm7BEY+5kZCwNAEB5tAQKBgQD4uRo+07UXRg7PmSrIbplrcyrTUwkacQJpFHihqVQQrmEn3VhOonnZNfoSr
    HqoSMHP9DwMQxSqC55t5Vi6oRUlDsWQsxMoOK6qfosru4wLMQ2ZlfoaoCGiS6fYhVyozJJV525BS6rn7gvzRN
    ON/BJmQsDzfainWOuOJKk8QUes+wKBgQDFH13GH+RXMlnSlWJGL5MgWLDzyEQLouP/oaNsUSCX5h/NzVzQPqIEm
    eXChYMTJ8Uuq2pbytmHZDSvVJ3Mejly23nTINFsnPqZjSW0iqYwuONgPZiKeW8M2xx0d7+QaJorO0hAX/9vAjfeo
    AoXJbwZRQOuUOQ/a5knmHwMwlw/IQKBgQDZlXS0SZg+R/dk/OVEehyUtydbv2RTUVF+g34UToFQJnyv1x8Ni2106
    5ddBq420Y9bUJnHUFefepKaKOy6N3i79nQ25bF4mj2SwSkWlPcqQztWhLFK4ZMK24x2ChTJRk0uAUueq4dTZhfmNO
    utZjriYrtRRzhnTY6jxsaWA7WkSQKBgDXwYEuPfH7zsypxYAPOjtbCDiGXAi+g8fyIMVy5Uk7eVIOPFz+Qc+sIZZt
    1xykdr9IWa7MUbbOjktsLL2a9Zyzrq4k/KK8swVH1EoU1j0YzwVwbXrs9gUqmRkIEZnHQfacowJuE6TNqCvmrFzfA
    RpkvjlNLpTlJaw4vpnojUPShAoGBAJzKbhiaG4P+FaJu5Y5y5XU2yHpR2tZm6WPUAf/DPsLRXZymJCbOUM4AoSez9
    DsZxRmpFxsJcqkMFc7bHuKjr7LFEaqsCEpUVO3ucCqFUph1NRdZ52YkE8Ou3m8KTasmQRdJU4pUQVLbbWlTm5SpSC
    Vxp5Wf8nzusAZ37gqagqiP`;
    return await importKeyPair(pubkey, priKey);
}


async function importKeyPair(
  pubBase64: string,
  privBase64: string
): Promise<CryptoKeyPair> {
  const pubBinary = Uint8Array.from(atob(pubBase64), (c) => c.charCodeAt(0));
  const privBinary = Uint8Array.from(atob(privBase64), (c) => c.charCodeAt(0));

  const publicKey = await crypto.subtle.importKey(
    "spki",
    pubBinary.buffer,
    {
      name: "RSASSA-PKCS1-v1_5",
      hash: "SHA-256",
    },
    true,
    ["verify"]
  );

  const privateKey = await crypto.subtle.importKey(
    "pkcs8",
    privBinary.buffer,
    {
      name: "RSASSA-PKCS1-v1_5",
      hash: "SHA-256",
    },
    true,
    ["sign"]
  );

  return { publicKey, privateKey };
}
