import {handler} from "../../lambda/transfer/transfer";
import { createSecretFromKeypair } from "../../lambda/keypair/keypair";
import {Keypair} from '@solana/web3.js';

const event = {
    endpoint: "https://api.devnet.solana.com/",
    keyPairOutput: {
        "secretArn": "test",
        "publicKey": "publicKey"
    },
    fundOutput: {
        "hash": "hash"
    }
};

const context = {
    callbackWaitsForEmptyEventLoop: false,
    functionName: "",
    functionVersion: "",
    invokedFunctionArn: "",
    memoryLimitInMB: "",
    awsRequestId: "",
    logGroupName: "",
    logStreamName: "",
    getRemainingTimeInMillis: function (): number {
        throw new Error("Function not implemented.");
    },
    done: function (error?: Error | undefined, result?: any): void {
        throw new Error("Function not implemented.");
    },
    fail: function (error: string | Error): void {
        throw new Error("Function not implemented.");
    },
    succeed: function (messageOrObject: any): void {
        throw new Error("Function not implemented.");
    }
};

beforeAll(async() => {
    let output = await createSecretFromKeypair(new Keypair());
    event.keyPairOutput.publicKey = output.publicKey;
})

describe("testing transfer handler", () => {
    test("it should return a hash value", async () => {
        let output = await handler(event, context);
        expect(output.hash).toBeDefined();
    })
})
