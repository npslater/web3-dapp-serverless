import {handler} from "../../lambda/keypair/keypair";
import {Context} from "aws-lambda";
import {Event} from "../../lambda/keypair/event";
import { SecretsManagerClient, DeleteSecretCommand } from "@aws-sdk/client-secrets-manager";


const event:Event = {
    "endpoint":"test",
};

const handlerOutput = {
    "secretArn": "",
    "publicKey": ""
};

const context:Context = {
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

afterAll(() => {
    if ( handlerOutput.secretArn.length < 1 ) return;
    let client = new SecretsManagerClient({});
    let command = new DeleteSecretCommand({
        "SecretId": handlerOutput.secretArn,
        "ForceDeleteWithoutRecovery": true,
    });
    client.send(command);
})

describe("testing keypair handler", () => {
    test("it should return an Arn", async () => {
        const result = await handler(event,context);
            expect(result.secretArn).toBeDefined();
            if ( result.secretArn != null ) {
                handlerOutput.secretArn = result.secretArn;
            }
    });
    test("it should return an publicKey", async () => {
        const result = await handler(event,context);
            expect(result.publicKey).toBeDefined();
    });
});