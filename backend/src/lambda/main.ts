import { SESClient, SendEmailCommand, SendEmailCommandInput } from '@aws-sdk/client-ses';
import { renderCustomTemplate } from '../template/custom'
import { SQSEvent } from 'aws-lambda';
import type { Properties } from '../template/custom'
import { env } from 'node:process';

const client = new SESClient({
  region: env.AWS_SES_REGION ??  '',
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID ?? '',
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY ?? '',
  },
});

const send = async (data: Properties, toAddresses: Array<string>, subject: string) => {
  const emailHtml = await renderCustomTemplate(data);
  const params: SendEmailCommandInput = {
    Source: env.VERIFIED_EMAIL ?? '', 
    Destination: {
      ToAddresses: toAddresses,
    },
    Message: {
      Subject: {
        Charset: 'UTF-8',
        Data: subject,
      },
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: emailHtml,
        },
      },
    },
  };

  try {
    const result = await client.send(new SendEmailCommand(params));
    console.log('Sent', result);
  } catch (error) {
    console.error('Error', error);
    throw error;
  }
}

/**
 * @description
 * @param event 
 */
export const handler = async (event: SQSEvent) => {

  try {
    
    const records = event.Records;
    if(!records) {
      throw new Error('Records not available');
    }

    for (const record of records) {
      const { data, toAddresses, subject } = JSON.parse(record.body ?? '{}');
      await send(data, [toAddresses], subject);
    }
  } catch (error) {
    throw error;
  }

}