import {
    Connection,
    PublicKey,
    SystemProgram,
    Transaction,
    sendAndConfirmTransaction,
    Keypair
  } from '@solana/web3.js';
import { Context } from 'aws-lambda';
import { Event } from './event';
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

export async function handler(event:Event, context: Context)
{
    const client = new SecretsManagerClient({});
    const secretCommand = new GetSecretValueCommand({
        SecretId: event.keyPairOutput.publicKey
    });
    const output = await client.send(secretCommand);
    const secretString = output.SecretString;
    if ( secretString == null ) {
        return {
            "error": "No secret string found for secret Id: " + event.keyPairOutput.publicKey,
            "status": 403
        }
    }
    const secret = JSON.parse(secretString);
    const secretKey = await Uint8Array.from(secret.secretKey);
    const connection = new Connection(event.endpoint, "confirmed");
    const toPubkey = new Keypair().publicKey;
    const fromPubkey = new PublicKey(event.keyPairOutput.publicKey);
    const lamports = 100;

    const instructions = SystemProgram.transfer({
        fromPubkey,
        toPubkey,
        lamports
    });
    
    const transaction = new Transaction();
    transaction.add(instructions);

    const signers = [
        {
            publicKey: fromPubkey,
            secretKey
        }
    ]
    
    const hash = await sendAndConfirmTransaction(connection, transaction, signers);
    return {
        "hash": hash
    }
} 