// utils/corsMiddleware.js

function runMiddleware(req, res, fn) {
    return new Promise((resolve, reject) => {
      fn(req, res, (result) => {
        if (result instanceof Error) {
          return reject(result);
        }
        return resolve(result);
      });
    });
  }
  
  export async function cors(req, res) {
    const allowedOrigins = ['https://nonprod.gravitii.in', 'https://gravitii.in'];
    const origin = req.headers.origin;
  
    if (allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }
  
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
    // If it's a preflight request, end it after setting headers
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }
  }
  