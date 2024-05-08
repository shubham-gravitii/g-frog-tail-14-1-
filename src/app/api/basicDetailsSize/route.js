// import { getSession } from 'next-auth/react';
import axios from "axios";
import * as Constants from "../../../utils/constants";
import { fetchApiSettings } from "../../../utils/ssm";
import { NextResponse } from "next/server";
// export default async function handler(req, res) {
//   const { apiKey, apiGatewayHost, apiKeyMedia, apiGatewayHostMedia } =
//     await fetchApiSettings();

//   //   const session = await getSession({ req });

//   //   if (!session) {
//   //     return res.status(401).json({ error: 'Unauthorized' });
//   //   }
//   const {
//     query: { id },
//     method,
//     body,
//     query,
//   } = req;

//   switch (req.method) {
//     case "GET":
//       return handleGet(query, req, res, apiKey, apiGatewayHost);
//     case "POST":
//       return handlePost(query, req, res, apiKey, apiGatewayHost);
//     case "PUT":
//       return handlePut(query, req, res, apiKey, apiGatewayHost);
//     case "DELETE":
//       return handleDelete(req, res, apiKey, apiGatewayHost);
//     default:
//       return res.status(405).json({ error: "Method Not Allowed" });
//   }
// }

export async function GET( req, res) {
  const dataReq = new URLSearchParams(req.nextUrl.searchParams);
  const data = Object.fromEntries(dataReq.entries());
  const { apiKey, apiGatewayHost, apiKeyMedia, apiGatewayHostMedia } =
    await fetchApiSettings();
  const headers = {
    accept: "application/json",
    "x-api-key": apiKey,
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "*",
  };

  console.log(data);
  let isFirstParam = true;
  let updatedBasicDetails = "";

  for (const key in data) {
    if (data[key]) {
      const formattedKey =
        key === "latitude" || key === "longitude" ? key : key.toUpperCase();
      updatedBasicDetails +=
        (isFirstParam ? "?" : "&") + `${formattedKey}=${data[key]}`;
      isFirstParam = false;
    }
  }

  console.log(updatedBasicDetails);

  const response = await axios.get(
    `${apiGatewayHost}/wh_basic_details_data_size${updatedBasicDetails}`,
    {
      headers: headers,
    }
  );
  const newData = response.data.response;

  console.log(newData);
  return NextResponse.json({response:newData},{status:200})
}

async function handlePost(data, req, res, apiKey, apiGatewayHost) {
  res.status(200).json({ name: "Gavitii" });
}

async function handlePut(data, req, res, apiKey, apiGatewayHost) {
  res.status(200).json({ name: "Gavitii" });
}

async function handleDelete(req, res, apiKey, apiGatewayHost) {
  res.status(200).json({ name: "Gavitii" });
}
