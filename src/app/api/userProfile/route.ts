// @ts-nocheck
// import { getSession } from 'next-auth/react';
import axios from "axios";
import * as Constants from "../../../utils/constants";
import { fetchApiSettings } from "../../../utils/ssm";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { getHeaderData } from "@/utils/apiFunctions/getHeaderData";

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

export async function GET(req: NextRequest) {
  const headerData = getHeaderData();
  console.log("headerData");
  console.log(headerData);
  const url = new URL(req.url);
  const data = {
    WALLET_ADDRESS:headerData.userId,
  };
  if(!data.WALLET_ADDRESS){
    return NextResponse.json({Error:"No WALLET_ADDRESS recieved"},{status:401})
  }
  console.log(data);
  // console.log(headerData);
  const { apiKey, apiGatewayHost, apiKeyMedia, apiGatewayHostMedia } =
    await fetchApiSettings();
  const headers = {
    accept: "application/json",
    "x-api-key": apiKey,
  };
  try {
    let isFirstParam = true;
    let updatedUserDetails = "";

    for (const key in data) {
      if (data[key]) {
        updatedUserDetails +=
          (isFirstParam ? "?" : "&") + `${key.toUpperCase()}=${data[key]}`;
        isFirstParam = false;
      }
    }

    const response = await axios.get(
      `${apiGatewayHost}/user_profile` + updatedUserDetails.toString(),
      {
        headers: headers,
      }
    );
    const newData = response.data;
    console.log("response from userProfile")
    console.log(newData);
    return NextResponse.json({response:newData},{status:200})
  } catch (error:any) {
    console.log(error.message)
    return NextResponse.json({error},{status:405})
  }
}

export async function POST(req:NextRequest) {
  const { apiKey, apiGatewayHost, apiKeyMedia, apiGatewayHostMedia } = await fetchApiSettings();
  const dataReq = new URLSearchParams(req.nextUrl.searchParams);
  const data = Object.fromEntries(dataReq.entries());
  const headers = {
    accept: "*/*",
    "x-api-key": apiKey,
    "Content-Type": "application/json",
  };
  console.log("User Profile POST--->")
  const headerData = getHeaderData();
  console.log(headerData);
  data.email_address=headerData.email;
  data.WALLET_ADDRESS=headerData.userId;
  console.log(data);
  let isFirstParam = true;
  let updatedUserDetails = "";

  for (const key in data) {
    if (data[key]) {
      updatedUserDetails +=
        (isFirstParam ? "?" : "&") + `${key.toUpperCase()}=${data[key]}`;
      isFirstParam = false;
    }
  }

  try {
    console.log(`${apiGatewayHost}/user_profile`);
    const response = await axios.post(
      `${apiGatewayHost}/user_profile` + updatedUserDetails.toString(),
      {},
      {
        headers: headers,
      }
    );

    const newData = response.data;
    console.log(newData);
    return NextResponse.json({response:newData},{status:200});
  } catch (error:any) {
    console.log(error);
    console.error(
      "Error:",
      error.response ? error.response.data : error.message
    );
    return NextResponse.json(
      { Error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(req:NextRequest) {
  const { apiKey, apiGatewayHost, apiKeyMedia, apiGatewayHostMedia } = await fetchApiSettings();
  const dataReq = new URLSearchParams(req.nextUrl.searchParams);
  const data = Object.fromEntries(dataReq.entries());
  const headers = {
    accept: "application/json",
    "x-api-key": apiKey,
    "Content-Type": "application/json",
  };
  console.log("User Profile PUT --->")
  const headerData = getHeaderData();
  console.log(headerData);
  data.email=headerData.email;
  data.WALLET_ADDRESS=headerData.userId;
  console.log(data)
  let isFirstParam = true;
  let updatedUserDetails = "";

  for (const key in data) {
    if (data[key]) {
      updatedUserDetails +=
        (isFirstParam ? "?" : "&") + `${key.toUpperCase()}=${data[key]}`;
      isFirstParam = false;
    }
  }
  console.log(updatedUserDetails)
  console.log(`${apiGatewayHost}/user_profile` + updatedUserDetails);
  try {
    const response = await axios.put(
      `${apiGatewayHost}/user_profile` + updatedUserDetails.toString(),
      {},
      {
        headers: headers,
      }
    );

    const newData = response.data;
    console.log(newData);
    // console.log("before next response")
    return NextResponse.json({response:newData},{status:200});
  } catch (error:any) {
    console.error(
      "Error:",
      error.response ? error.response.data : error.message
    );
    return NextResponse.json(
      { Error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, res) {
  const headers = {
    accept: "application/json",
    "x-api-key": apiKey,
    "Content-Type": "application/json",
  };

  const response = await axios.delete(`${apiGatewayHost}/user_profile/`, {
    params: data,
    headers: headers,
  });
  const newData = response.data;

  console.log(newData);

  res.send(newData);
}
