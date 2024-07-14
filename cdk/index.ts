import * as cdk from 'aws-cdk-lib';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3d from 'aws-cdk-lib/aws-s3-deployment';
import * as cf from 'aws-cdk-lib/aws-cloudfront';
import * as cfo from 'aws-cdk-lib/aws-cloudfront-origins';
import * as r53 from 'aws-cdk-lib/aws-route53';
import * as r53t from 'aws-cdk-lib/aws-route53-targets';
import path from 'path';

const hostedZoneId = process.env.HOSTED_ZONE_ID;
const hostedZoneName = process.env.HOSTED_ZONE_NAME;
const subdomain = process.env.SUBDOMAIN;
const domain = `${subdomain}.${hostedZoneName}`;

const app = new cdk.App();
const stack = new cdk.Stack(app, 'ShrodingerFrontend');

const bucket = new s3.Bucket(stack, 'SiteBucket', {
  publicReadAccess: false,
  blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  autoDeleteObjects: true,
});

const certificateArn = ssm.StringParameter.valueForStringParameter(
  stack,
  `/infrastructure/acm/${hostedZoneName}/certificate_arn`,
);

const certificate = acm.Certificate.fromCertificateArn(
  stack,
  'Certificate',
  certificateArn,
);

const cdn = new cf.Distribution(stack, 'Distribution', {
  certificate,
  domainNames: [`${domain}`],
  defaultBehavior: {
    origin: new cfo.S3Origin(bucket),
  },
  errorResponses: [
    {
      httpStatus: 404,
      responseHttpStatus: 200,
      responsePagePath: '/index.html',
    },
  ],
});

new s3d.BucketDeployment(stack, 'SiteDeployment', {
  destinationBucket: bucket,
  distribution: cdn,
  sources: [s3d.Source.asset(path.resolve(process.cwd(), '..', 'web', 'dist'))],
});

const hostedZone = r53.HostedZone.fromHostedZoneAttributes(
  stack,
  'HostedZone',
  { hostedZoneId, zoneName: hostedZoneName },
);

new r53.ARecord(stack, 'ARecord', {
  zone: hostedZone,
  target: r53.RecordTarget.fromAlias(new r53t.CloudFrontTarget(cdn)),
  recordName: `${domain}.`,
});
