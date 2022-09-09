import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambdaNode from 'aws-cdk-lib/aws-lambda-nodejs';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Policy } from 'aws-cdk-lib/aws-iam';

export class Web3DappServerlessStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const secretsManagerPolicy = new iam.PolicyStatement({
      actions: ["secretsmanager:CreateSecret"],
      resources: ["*"],
    });

    // The code that defines your stack goes here
    const keyPairHandler = new lambdaNode.NodejsFunction(this, "KeyPairHandler", {
      entry: "./lambda/keypair/keypair.ts",
      handler: "handler",
    });
    keyPairHandler.role?.attachInlinePolicy(new Policy(this, "secrets-manager-policy", {
      "statements": [secretsManagerPolicy]
    }));
  }
}
