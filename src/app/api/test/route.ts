// import { NextApiRequest, NextApiResponse } from 'next';
// import { IncomingForm } from 'formidable';
// import { promises as fs } from 'fs';

// export const config = {
//   api: {
//     bodyParser: false,  // Disable the default body parser
//   },
// };

// export  async function POST(req, res: NextApiResponse) {
//   const data = await parseFormData(req);

//   if (data.files && data.files.image) {
//     const file = data.files.image;
//     // Now you can access the file and its metadata
//     // For example, you could read the file and do something with its content
//     const content = await fs.readFile(file.filepath);
//     // Process or respond with the file content
//     return NextResponse.json({ message: 'File processed successfully', content: content.toString('base64') },{status:200})
// } else {
//       return NextResponse.json({  error: 'No file uploaded'  },{status:400})
//   }
// }

// function parseFormData(req) {
//   return new Promise((resolve, reject) => {
//     const form = new IncomingForm();
//     form.parse(req, (err, fields, files) => {
//       if (err) reject(err);
//       resolve({ fields, files });
//     });
//   });
// }
import { NextApiRequest, NextApiResponse } from 'next';
import { IncomingForm, File, Files } from 'formidable';
import { promises as fs } from 'fs';

export const config = {
  api: {
    bodyParser: false,  // This is important, as we're handling multipart data.
  },
};

export  async function POST(req: NextApiRequest, res: NextApiResponse) {
 

  try {
    const data = await parseFormData(req);

    if (data.files && data.files.image) {
      const file = data.files.image as File;
      // Here, you can access file properties like file.path, file.size, etc.
      const content = await fs.readFile(file.filepath);
      // Example response, convert file content to base64 (just for demonstration)
      res.status(200).json({ message: 'File processed successfully', content: content.toString('base64') });
    } else {
      res.status(400).json({ error: 'No file uploaded' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to parse form data' });
  }
}

function parseFormData(req: NextApiRequest): Promise<{ fields: any; files: Files }> {
  return new Promise((resolve, reject) => {
    const form = new IncomingForm();
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err);
      } else {
        resolve({ fields, files });
      }
    });
  });
}
