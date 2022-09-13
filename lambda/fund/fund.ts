import {PublicKey, Connection, LAMPORTS_PER_SOL} from '@solana/web3.js';
import { Context } from 'aws-lambda';
import { Event } from './event';

export async function handler(event:Event, context:Context) {
    try {
        console.debug(event);
        const connection = new Connection(event.endpoint, 'confirmed');
        const publicKey = new PublicKey(event.keyPairOutput.publicKey);
        const hash = await connection.requestAirdrop(publicKey, LAMPORTS_PER_SOL);
        await connection.confirmTransaction(hash);
        return {
            "hash": hash
        }
    }
    catch ( error ) {
        console.debug(error);
        return {
            "error": JSON.stringify(error),
        }
    }
}