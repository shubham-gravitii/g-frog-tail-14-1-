//@ts-nocheck
// import { getSession } from 'next-auth/react';
import axios from "axios";
import { fetchApiSettings } from "../../../utils/ssm";
import { getHeaderData } from "@/utils/apiFunctions/getHeaderData";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res) {
  const headerData = getHeaderData();
  console.log("headerData");
  console.log(headerData);
  const data = {
    OWNER_ENTITY_ID: headerData.userId,
  };
  console.log(data);
  const { apiKey, apiGatewayHost, apiKeyMedia, apiGatewayHostMedia } =
    await fetchApiSettings();
  const headers = {
    accept: "application/json",
    "x-api-key": apiKey,
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS, PUT, DELETE",
  };

  let isFirstParam = true;
  let updatedOwnerDetails = "";

  for (const key in data) {
    if (data[key]) {
      updatedOwnerDetails +=
        (isFirstParam ? "?" : "&") + `${key.toUpperCase()}=${data[key]}`;
      isFirstParam = false;
    }
  }

  console.log(updatedOwnerDetails);

  const response = await axios.get(
    `${apiGatewayHost}/wh_owner_details` + updatedOwnerDetails.toString(),
    {
      headers: headers,
    }
  );
  const newData = response.data;

  console.log(newData);

  // return jsonResponse(200, newData)
  return NextResponse.json({ response: newData }, { status: 200 });
}

export async function POST(req, res) {
  const { apiKey, apiGatewayHost, apiKeyMedia, apiGatewayHostMedia } = await fetchApiSettings();
  const dataReq = new URLSearchParams(req.nextUrl.searchParams);
  const data = Object.fromEntries(dataReq.entries());
  console.log(data);

  const headers = {
    accept: "application/json",
    "x-api-key": apiKey,
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS, PUT, DELETE",
  };

  let isFirstParam = true;
  let updatedOwnerDetails = "";

  for (const key in data) {
    if (data[key]) {
      updatedOwnerDetails +=
        (isFirstParam ? "?" : "&") + `${key.toUpperCase()}=${data[key]}`;
      isFirstParam = false;
    }
  }

  console.log(updatedOwnerDetails);

  try {
    const response = await axios.post(
      `${apiGatewayHost}/wh_owner_details` + updatedOwnerDetails,
      {},
      {
        headers: headers,
      }
    );

    const newData = response.data;
    console.log(newData);
    return NextResponse.json({ newData }, { status: 200 });
  } catch (error) {
    console.error(
      "Error:",
      error.response ? error.response.data : error.message
    );
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(req, res) {
  const { apiKey, apiGatewayHost, apiKeyMedia, apiGatewayHostMedia } = await fetchApiSettings();
  const dataReq = new URLSearchParams(req.nextUrl.searchParams);
  const data = Object.fromEntries(dataReq.entries());
  console.log(data);

  const headers = {
    accept: "application/json",
    "x-api-key": apiKey,
  };

  let isFirstParam = true;
  let updatedOwnerDetails = "";

  for (const key in data) {
    if (data[key]) {
      updatedOwnerDetails +=
        (isFirstParam ? "?" : "&") + `${key.toUpperCase()}=${data[key]}`;
      isFirstParam = false;
    }
  }

  const response = await axios.put(
    `${apiGatewayHost}/wh_owner_details${updatedOwnerDetails}`,
    {},

    {
      headers: headers,
    }
  );
  const newData = response.data;

  console.log(newData);
  return NextResponse.json({ newData }, { status: 200 });
}

async function handleDelete(data, req, res, apiKey, apiGatewayHost) {
  const headers = {
    accept: "application/json",
    "x-api-key": apiKey,
  };

  let isFirstParam = true;
  let updatedOwnerDetails = "";

  for (const key in data) {
    if (data[key]) {
      updatedOwnerDetails +=
        (isFirstParam ? "?" : "&") + `${key.toUpperCase()}=${data[key]}`;
      isFirstParam = false;
    }
  }

  const response = await axios.delete(
    `${apiGatewayHost}/wh_owner_details${updatedOwnerDetails}`,
    {},
    {
      params: data,
      headers: headers,
    }
  );
  const newData = response.data;

  console.log(newData);

  res.send(newData);
}
