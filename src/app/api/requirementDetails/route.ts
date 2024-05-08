//@ts-nocheck
// import { getSession } from 'next-auth/react';
import axios from "axios";
import * as Constants from "../../../utils/constants";
import { NextResponse } from "next/server";
import { fetchApiSettings } from "../../../utils/ssm";
export async function GET(req, res) {
  const dataReq = new URLSearchParams(req.nextUrl.searchParams);
  const data = Object.fromEntries(dataReq.entries());
  const { apiKey, apiGatewayHost, apiKeyMedia, apiGatewayHostMedia } =
    await fetchApiSettings();
  const headers = {
    accept: "application/json",
    "x-api-key": apiKey,
  };
  let isFirstParam = true;
  let updatedRequirementsDetails = "";

  for (const key in data) {
    if (data[key]) {
      updatedRequirementsDetails +=
        (isFirstParam ? "?" : "&") + `${key.toUpperCase()}=${data[key]}`;
      isFirstParam = false;
    }
  }

  const response = await axios.get(
    `${apiGatewayHost}/wh_requirement_details${updatedRequirementsDetails}`,
    {
      params: data,
      headers: headers,
    }
  );
  const newData = response.data.response;
  return NextResponse.json({ response: newData }, { status: 200 });
}

export async function POST(req, res) {
  const dataReq = new URLSearchParams(req.nextUrl.searchParams);
  const data = Object.fromEntries(dataReq.entries());
  const { apiKey, apiGatewayHost, apiKeyMedia, apiGatewayHostMedia } = await fetchApiSettings();
  const headers = {
    accept: "application/json",
    "x-api-key": apiKey,
  };

  console.log(data);
  let isFirstParam = true;
  let updatedRequirementsDetails = "";

  for (const key in data) {
    if (data[key]) {
      const formattedKey =
        key === "latitude" || key === "longitude" ? key : key.toUpperCase();
      updatedRequirementsDetails +=
        (isFirstParam ? "?" : "&") + `${formattedKey}=${data[key]}`;
      isFirstParam = false;
    }
  }

  const queryParams = new URLSearchParams(data).toString();
  console.log(updatedRequirementsDetails)
  try {
    const response = await axios.post(
      `${apiGatewayHost}/wh_requirement_details${updatedRequirementsDetails}`,
      {},
      {
        headers: headers,
        
      }
    );

    const newData = response.data.response;
    console.log(newData);

    return NextResponse.json({ response: newData }, { status: 200 });
} catch (error) {
    console.error(
      "Error:",
      error.response ? error.response.data : error.message
    );
    console.log(error.message)
    // console.log(error)
    return NextResponse.json({ error:"Internal Server Error"  }, { status: 500 });
  }
}

export async function PUT( req, res) {
  const dataReq = new URLSearchParams(req.nextUrl.searchParams);
  const data = Object.fromEntries(dataReq.entries());
  const { apiKey, apiGatewayHost, apiKeyMedia, apiGatewayHostMedia } = await fetchApiSettings();

  const headers = {
    accept: "application/json",
    "x-api-key": apiKey,
  };
  let isFirstParam = true;
  let newRequirementDetails = "";
  for (const key in data) {
    if (data[key]) {
      const formattedKey =
        key === "latitude" || key === "longitude" ? key : key.toUpperCase();
      newRequirementDetails +=
        (isFirstParam ? "?" : "&") + `${formattedKey}=${data[key]}`;
      isFirstParam = false;
    }
  }
  const response = await axios.put(
    `${apiGatewayHost}/wh_requirement_details${newRequirementDetails}`,
    {},
    {
      headers: headers,
    }
  );
  const newData = response.data.response;
  console.log(newData);
  return NextResponse.json({ response: newData }, { status: 200 });

}

export async function DELETE(req, res) {
  const dataReq = new URLSearchParams(req.nextUrl.searchParams);
  const data = Object.fromEntries(dataReq.entries());
  const { apiKey, apiGatewayHost, apiKeyMedia, apiGatewayHostMedia } = await fetchApiSettings();
  const headers = {
    accept: "application/json",
    "x-api-key": apiKey,
  };

  const response = await axios.delete(
    `${apiGatewayHost}/wh_requirement_details`,
    {},
    {
      params: data,
      headers: headers,
    }
  );
  const newData = response.data.response;

  console.log(newData);
  return NextResponse.json({ response: newData }, { status: 200 });

}
