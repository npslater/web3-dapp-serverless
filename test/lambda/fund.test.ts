import {handler} from "../../lambda/fund/fund";
import {Context} from "aws-lambda";
import {Event} from "../../lambda/fund/event";
import { EventAction } from "aws-cdk-lib/aws-codebuild";
import {Keypair} from '@solana/web3.js';

const event = {
    endpoint: "https://api.devnet.solana.com/",
    keyPairOutput: {
        "secretArn": "", 
        "publicKey": new Keypair().publicKey.toString(),
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

describe("testing fund handler", ()=> {
    test("it should return a hash value", async () => {
        let output = await handler(event, context);
        expect(output.hash).toBeDefined();
    })
})