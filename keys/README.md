# Place your public and private keys in this directory

- Name the private key `private_key.pem`
- Name the public key `public_key.pem`

## Generate PEM keys

- To generate a new private key, use the following command:

```bash
openssl genpkey -algorithm RSA -out private_key.pem -pkeyopt rsa_keygen_bits:2048
```

- To generate a new public key from the private key, use the following command:

```bash
openssl rsa -pubout -in private_key.pem -out public_key.pem
```
