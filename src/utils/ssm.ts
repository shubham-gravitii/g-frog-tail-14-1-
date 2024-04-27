// import AWS from 'aws-sdk';
import dotenv from 'dotenv';
import { aws_region } from './constants';

dotenv.config();

// AWS.config.update({ region: aws_region });

// const ssm = new AWS.SSM();
console.log('Current NODE_ENV:', process.env.NODE_ENV);

async function fetchParameter(name: string): Promise<string> {
  // For production, fetch from environment variables
  if ((process.env.NODE_ENV as string) === 'production' || (process.env.NODE_ENV as string) === 'staging') {
    const value = process.env[name];
    if (!value) {
      throw new Error(`Environment variable ${name} not found`);
    }
    console.log(`Fetched ${name} from environment variables`);
    return value;
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

export async function fetchMapplsApiSettings() {
  const mapplsClientId = await fetchParameter("MAPPLS_CLIENT_ID_1");
  const mapplsClientSecret = await fetchParameter( "MAPPLS_SECRET_ID_1");
  const mapplsTokenUrl = await fetchParameter("MAPPLS_TOKEN_API_URL");
  return { client_id: mapplsClientId, client_secret: mapplsClientSecret, tokenapiurl: mapplsTokenUrl };
}

export async function fetchOpenCageApiSettings(opencage_api_key_param:any) {
  const opencageApiKey = await fetchParameter(opencage_api_key_param);

  return { opencageApiKey };
}
