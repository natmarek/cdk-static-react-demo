import * as cdk from '@aws-cdk/core';
import * as iam from '@aws-cdk/aws-iam'
import * as s3 from '@aws-cdk/aws-s3'
import * as s3Deployment from '@aws-cdk/aws-s3-deployment'

export class CdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const bucket = new s3.Bucket(this, 'nm-static-react-hosting', {
      websiteIndexDocument: 'index.html',
      publicReadAccess:true,
      removalPolicy:cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true
    });

    new s3Deployment.BucketDeployment(this, "nm-static-react-deployment", {
      destinationBucket: bucket,
      sources: [s3Deployment.Source.asset("../build")],
    })

    const boundary = iam.ManagedPolicy.fromManagedPolicyArn(
      this,
      "Boundary",
      `arn:aws:iam::${process.env.AWS_ACCOUNT}:policy/ScopePermissions`
    );
    iam.PermissionsBoundary.of(this).apply(boundary);


    new cdk.CfnOutput(this, 'Bucket-URL', {
      value: bucket.bucketDomainName
    })
  }
}
