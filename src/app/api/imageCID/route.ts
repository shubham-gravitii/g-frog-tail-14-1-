//@ts-nocheck
// import { getSession } from 'next-auth/react';s
import axios from "axios";
import FormData from "form-data";
import * as Constants from "../../../utils/constants";
import { fetchApiSettings } from "../../../utils/ssm";
import formidable from "formidable";
import { NextResponse } from "next/server";
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const bodyParser = require("body-parser");
// const jsonParser = bodyParser.json();

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// // export const routeConfig = {
// //   api: {
// //     bodyParser: false,
// //   },
// // };

// // export default routeConfig;

export async function GET(req, res) {
  const dataReq = new URLSearchParams(req.nextUrl.searchParams);
  const data = Object.fromEntries(dataReq.entries());
  const { apiKey, apiGatewayHost, apiKeyMedia, apiGatewayHostMedia } =
    await fetchApiSettings();
  console.log("Image Cid api get request");
  console.log(data);
  console.log(apiGatewayHostMedia)
  console.log(apiKeyMedia)
  try {
    const headers = {
      Accept: "*/*",
      "x-api-key": apiKeyMedia,
      "Content-Length": "0",
      "Content-Type": "application/json",
    };
    console.log(
      `${apiGatewayHostMedia}/generate_presigned_url?cid=${data.cid}`
    );
    const response = await axios.post(
      `${apiGatewayHostMedia}/generate_presigned_url?cid=${data.cid}`,
      null,
      {
        headers: headers,
      }
    );
    const newData = response.data;
    console.log(newData);
    return NextResponse.json({ url: newData.presigned_url }, { status: 200 });
  } catch (error) {
    console.error("Error getting image:", error.message);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

// export async function POST(req, res) {
//   console.log("Image Cid api post request");
//   try {
//     const dataReq = new URLSearchParams(req.nextUrl.searchParams);
//     const data = Object.fromEntries(dataReq.entries());
//     const { apiKey, apiGatewayHost, apiKeyMedia, apiGatewayHostMedia } =
//       await fetchApiSettings();
//     upload.single("file")(req, res, async (err) => {
//       if (err) {
//         console.error("Error uploading file:", err);
//         return NextResponse.json(
//           { response: "Internal Server Error" },
//           { status: 500 }
//         );
//         // return res.status(500).json({ error: "Internal Server Error" });
//       }

//       try {
//         const headers = {
//           Accept: "*/*",
//           "x-api-key": apiKeyMedia,
//           "Content-Type": "multipart/form-data",
//         };
//         const formData1 = await req.formData();
//         const files = formData1.getAll("file") as File[];
//         console.log(files)

//         console.log("error h")
//         return NextResponse.json({ response: files }, { status: 200 });

//         return new NextResponse(formData1,{status:200})
//         return NextResponse.json({response:formData1},{status:200})

//       } catch (error) {
//         console.error("Error uploading image:", error);
//         return NextResponse.json(
//           { error: "Internal server error" },
//           { status: 500 }
//         );
//       }
//     });
//   } catch (error) {
//     console.log(error);
//     return NextResponse.json({ error }, { status: 500 });
//   }
// }
export async function POST(req, res) {
  console.log("image cid post");
  const dataReq = new URLSearchParams(req.nextUrl.searchParams);
  const data = Object.fromEntries(dataReq.entries());
  console.log(data)
  const { apiKey, apiGatewayHost, apiKeyMedia, apiGatewayHostMedia } =
    await fetchApiSettings();
  const cid =await upload.single("file")(req, res, async (err) => {
    if (err) {
      console.error("Error uploading file:", err);
      return NextResponse.json(
        { response: "Internal Server Error" },
        { status: 500 }
      );
      // return res.status(500).json({ error: "Internal Server Error" });
    }

    const headers = {
      Accept: "*/*",
      "x-api-key": apiKeyMedia,
      "Content-Type": "multipart/form-data",
    };
    const formData1 = await req.formData();
    const files = formData1.getAll("file") as File[];
    const fileBuffer=await files[0].arrayBuffer()
    console.log(files);
    const formData = new FormData();
    const filename="image"+"."+data.fileExtension;
    console.log(filename)
    formData.append("file", Buffer.from(fileBuffer), {
      filename: filename,
    });

    const response = await axios.post(
      `${apiGatewayHostMedia}/upload_object`,
      formData,
      {
        headers,
      }
    );
    const newData = response.data;
    console.log(newData);
    return newData.cid;
    return NextResponse.json({ response: files }, { status: 200 });
  });
  console.log("cid")
  console.log(cid)
  return NextResponse.json({ res: cid }, { status: 200 });
}
