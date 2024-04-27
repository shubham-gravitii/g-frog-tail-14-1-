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

const jsonParser = bodyParser.json();

export const config = {
  api: {
    bodyParser: false,
  },
};



export async function GET( req, res) {
  const dataReq = new URLSearchParams(req.nextUrl.searchParams);
  const data = Object.fromEntries(dataReq.entries());
  const { apiKey, apiGatewayHost, apiKeyMedia, apiGatewayHostMedia } =
    await fetchApiSettings();
    console.log(data)
  try {
    const headers = {
      Accept: "*/*",
      "x-api-key": apiKeyMedia,
      "Content-Length": "0",
      "Content-Type": "application/json",
    };
    console.log(`${apiGatewayHostMedia}/generate_presigned_url?cid=${data.cid}`)
    const response = await axios.get(
      `${apiGatewayHostMedia}/generate_presigned_url?cid=${data.cid}`,
      null,
      {
        headers: headers,
      }
    );
    const newData = response.data.response;
    console.log(newData);
    return NextResponse.json({ url: newData.presigned_url }, { status: 200 });
  } catch (error) {
    console.error("Error getting image:", error.message);
    return NextResponse.json({ error: error}, { status: 500 });
  }
}


export async function POST(req, res) {
  jsonParser(req, res, async() => {
    const dataReq = new URLSearchParams(req.nextUrl.searchParams);
    const data = Object.fromEntries(dataReq.entries());
    const { apiKey, apiGatewayHost, apiKeyMedia, apiGatewayHostMedia } = await fetchApiSettings();
    upload.single("file")(req, res, async (err) => {
      if (err) {
        console.error("Error uploading file:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      try {
        const headers = {
          Accept: "*/*",
          "x-api-key": apiKeyMedia,
          "Content-Type": "multipart/form-data",
        };

        const formData = new FormData();
        formData.append("file", Buffer.from(req.file.buffer), {
          filename: req.file.originalname,
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
        return NextResponse.json({ cid:  newData.cid}, { status: 200 });
      } catch (error) {
        console.error("Error uploading image:", error);
        return NextResponse({error:"Internal server error"},{status:500})
      }
    });
  });
}

