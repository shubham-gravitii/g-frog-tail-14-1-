import AWS from 'aws-sdk';
import dotenv from 'dotenv';
import { aws_region } from './constants';
import { ConsoleLogger } from 'aws-amplify/utils';

dotenv.config(); // to load environment variables

AWS.config.update({ region: aws_region });

const ssm = new AWS.SSM();
console.log('Current NODE_ENV:', process.env.NODE_ENV);
async function fetchParameter(name: string): Promise<string> {
  // For production, fetch from SSM
  if (process.env.NODE_ENV === 'production') {
    try {
      const params = { Name: name, WithDecryption: true };
      const data = await ssm.getParameter(params).promise();
      return data.Parameter!.Value!;
    } catch (error) {
      console.error(`Error fetching ${name} from SSM:`, error);
      throw error;
    }
  } else {
    // In development or nonprod, fetch from .env
    console.log(process.env[name])
    return process.env[name]!;
  }
}

export async function fetchApiSettings() {
  const apiKey = await fetchParameter('G_BADGER_APIKEY');
  const apiGatewayHost = await fetchParameter('API_GATEWAY_HOST');

  // For nonprod and production, reuse apiKey and apiGatewayHost for media
  const apiKeyMedia = process.env.NODE_ENV === 'development' ? await fetchParameter('G_BADGER_APIKEY_MEDIA') : apiKey;
  const apiGatewayHostMedia = process.env.NODE_ENV === 'development' ? await fetchParameter('API_GATEWAY_HOST_MEDIA') : apiGatewayHost;
  
  return { apiKey, apiGatewayHost, apiKeyMedia, apiGatewayHostMedia };
}