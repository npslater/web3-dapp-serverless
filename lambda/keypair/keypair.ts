import {Keypair} from '@solana/web3.js';
import { Context } from 'aws-lambda';
import { Event } from './event';
import { SecretsManagerClient, CreateSecretCommand } from "@aws-sdk/client-secrets-manager";

export const handler = async function(event: Event, context: Context) {
    try {
        const keypair = new Keypair();
        const secret = {
            "publicKey": keypair.publicKey.toString(),
            "secretKey": Array.from(keypair.secretKey)
        };
        const command = new CreateSecretCommand({"Name": event.secretName, "SecretString": JSON.stringify(secret)});
        const client = new SecretsManagerClient({});
        let output = await client.send(command);
        return {
            "secretArn": output.ARN,
        }   
    }
    catch ( error ){
        console.log(error);
        return {
            "error": error,
        }
        
    }
   
}

