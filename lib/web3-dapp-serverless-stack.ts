import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambdaNode from 'aws-cdk-lib/aws-lambda-nodejs';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Policy } from 'aws-cdk-lib/aws-iam';
import * as stepfunctions from 'aws-cdk-lib/aws-stepfunctions';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';


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

    const fundHandler = new lambdaNode.NodejsFunction(this, "FundHandler", {
      entry: "./lambda/fund/fund.ts",
      handler: "handler",
    });

    const keyPairState = new tasks.LambdaInvoke(this, "InvokeKeyPairHandler", {
      lambdaFunction: keyPairHandler,
      resultPath: "$.keyPairOutput",
      resultSelector: {
        "secretArn.$": "$.Payload.secretArn",
        "publicKey.$": "$.Payload.publicKey"
      }
    });
    
    
    const fundState = new tasks.LambdaInvoke(this, "InvokeFundHandler", {
      lambdaFunction: fundHandler,
      resultPath: "$.fundOutput",
      resultSelector: {
        "hash.$": "$.Payload.hash"
      }
    });
    
    const startState = new stepfunctions.Pass(this, 'StartState');
    const simpleStateMachine  = new stepfunctions.StateMachine(this, 'Web3DappServerlessPipeline', {
      definition: startState.next(keyPairState).next(fundState),
    });
    keyPairHandler.grantInvoke(simpleStateMachine);
    fundHandler.grantInvoke(simpleStateMachine);
  }
}
