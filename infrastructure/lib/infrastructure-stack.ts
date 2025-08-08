import { Stack, StackProps } from 'aws-cdk-lib';
import { CfnEmailIdentity, EmailIdentity, Identity, ConfigurationSet, CfnConfigurationSet } from 'aws-cdk-lib/aws-ses';
import { PolicyDocument, PolicyStatement, Effect } from 'aws-cdk-lib/aws-iam';
import { CfnIdentity } from 'aws-cdk-lib/aws-pinpointemail';
import { Construct } from 'constructs';
import { env } from 'node:process';



const verifiedEmail = env.VERIFIED_EMAIL ?? 'your-name@your-domain.your-top-level-domain';

export class InfrastructureStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);


    new EmailIdentity(this, 'EmailIdentity', {
      identity: Identity.email(verifiedEmail),
    });

    const configurationSet = new ConfigurationSet(this, 'ConfigurationSet', {
      configurationSetName: 'CustomConfigurationSet',

    });

    // new CfnConfigurationSet(this, 'IdentityConfigSetAssociation', {
    //     identity: 'your-verified-email@example.com', 
    //     configurationSetName: configSet.configurationSetName,
    // });


    // new CfnIdentityConfigurationSet(this, 'IdentityConfigSetAssociation', {
    //     identity: 'your-verified-email@example.com', // The email address you verified
    //     configurationSetName: myConfigSet.configurationSetName,
    // });


    // new CfnEmailIdentity(this, '', {})
    // const identity = new CfnIdentity(this, 'Identity', {
      
    // }) 
    // const identity = new CfnIdentity(this)

    //  const identity = new ses.CfnIdentity(this, 'Identity', {
    //   identityName: senderEmail
    // });


    const policy = new PolicyDocument({
      statements: [
        new PolicyStatement({
          effect: Effect.ALLOW,
          actions: [
            'ses:SendEmail',
            'ses:SendRawEmail',
          ],
          resources: ['*'],
          conditions: {
            StringEquals: { 'ses:FromAddress': verifiedEmail },
          }
        })
      ]
    })



  }
}
