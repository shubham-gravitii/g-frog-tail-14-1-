//@ts-nocheck
// pages/api/generateApiKey.js
import AWS from 'aws-sdk';
import { aws_region } from "../../../utils/constants";
import fs from 'fs';
import path from 'path'
import {fetchMapplsApiSettings} from "../../../utils/ssm.ts"
// Initialize AWS SSM
const ssm = new AWS.SSM({ region: aws_region }); // Specify your AWS region

//export default async function handler(req, res) {
export async function generateAndStoreApiKey() {

    const { client_id, client_secret, tokenapiurl } = await fetchMapplsApiSettings();
  // This endpoint should be secured or limited to prevent unauthorized usage

  try {
    
    const apiKey = await authenticateWithMappls(client_id, client_secret, tokenapiurl); // Assume this function authenticates and returns a new API key
    await storeApiKeyInSSM(apiKey); // Store the new API key in SSM
    //res.status(200).json({ success: true, message: 'API key generated and stored successfully.' });
  } catch (error) {
    console.error('Error generating or storing API key:', error);
    //res.status(500).json({ error: 'Failed to generate or store API key.' });
  }
}

async function authenticateWithMappls(client_id, client_secret, tokenapiurl) {
  const response = await fetch(tokenapiurl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: client_id,
      client_secret: client_secret,
      grant_type: 'client_credentials',
    }),
  });

  if (!response.ok) {
    throw new Error('Authentication failed');
  }

  const data = await response.json();
  console.log(data.access_token);
  return data.access_token;
}

async function storeApiKeyInSSM(apiKey) {
    if (process.env.NODE_ENV === 'development') {
      // Path to your .env.development file
      const envPath = path.join(__dirname, '../../../../../app/.env.development');
      
      try {
        // Check if .env.development file exists, if not, create it
        if (!fs.existsSync(envPath)) {
          fs.writeFileSync(envPath, '');
        }
        
        // Read the current contents of the file
        const content = fs.readFileSync(envPath, 'utf8');
        const updatedContent = updateEnvFile(content, "MAPPLS_API_KEY", apiKey);
  
        // Write the updated content back to the file
        fs.writeFileSync(envPath, updatedContent);
        console.log('API Key updated in .env.development');
      } catch (error) {
        console.error('Failed to update API Key in .env.development:', error);
      }
    } else {
      // nonprod/prod logic to store or update the API Key in SSM Parameter Store
      const params = {
        Name: 'MAPPLS_API_KEY', // SSM parameter name
        Value: apiKey,
        Type: 'SecureString',
        Overwrite: true
      };
  
      ssm.putParameter(params, function(err, data) {
        if (err) {
          console.error('Failed to store/update MAPPL API Key in SSM Parameter Store:', err);
        } else {
          console.log('MAPPL API Key stored/updated in SSM Parameter Store.');
        }
      });
    }
  }

  function updateEnvFile(content, key, value) {
    const envRegex = new RegExp(`^${key}=.*`, 'm');
    const newEntry = `${key}=${value}`;
    if (content.match(envRegex)) {
        return content.replace(envRegex, newEntry);
    } else {
        return `${content}${content ? '\n' : ''}${newEntry}`;
    }
}

