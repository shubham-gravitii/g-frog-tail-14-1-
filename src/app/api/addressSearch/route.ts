//@ts-nocheck
// pages/api/addressSearch.js
import { aws_region } from "../../../utils/constants";
import { generateAndStoreApiKey } from '../generateApiKeyMappls/route';
import { cors } from '../../../utils/corsMiddleware'; // Path might need adjustment
import fetch from 'node-fetch';
import AWS from 'aws-sdk';


// Initialize AWS SSM
const ssm = new AWS.SSM({ region: aws_region });
export default async function POST(req, res) {
  // Run CORS middleware
  await cors(req, res);
  
  const { query } = req.body;
  try {
    const apiKey = process.env.NODE_ENV === 'development'
      ? process.env["MAPPLS_API_KEY"] // From .env.development in local development
      : await fetchApiKeyFromSSM('MAPPLS_API_KEY'); // From SSM in production
    const apiUrl = `https://atlas.mapmyindia.com/api/places/search/json?query=${encodeURIComponent(query)}`;
    // Proxy the request
    let apiResponse = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': '*/*',
      },
    });

    if (apiResponse.status === 401) {
      // API key expired or invalid logic here - make sure to handle infinite calling
      
      generateAndStoreApiKey()
      apiResponse = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Accept': '*/*',
        },
      });

      // return res.status(401).json({ error: 'API key expired or invalid.' });
    }

    const data = await apiResponse.json();
    console.log(data);
    res.status(200).json(data.suggestedLocations.slice(1, 4));
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch address suggestions.' });
  }
}

async function fetchApiKeyFromSSM(parameterName) {
  const params = {
    Name: parameterName,
    WithDecryption: true,
  };

  const { Parameter: { Value = '' } = {} } = await ssm.getParameter(params).promise();
  return Value;
}
