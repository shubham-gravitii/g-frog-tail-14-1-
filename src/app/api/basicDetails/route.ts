//@ts-nocheck
// import { getSession } from 'next-auth/react';
import axios, { AxiosRequestConfig } from "axios";
import { NextResponse } from "next/server";
// import { verifyToken } from "../../utils/lib/middleware";
import { fetchApiSettings } from "../../../utils/ssm";

export async function GET(req, res) {
  const dataReq = new URLSearchParams(req.nextUrl.searchParams);
  const data = Object.fromEntries(dataReq.entries());
  const { apiKey, apiGatewayHost, apiKeyMedia, apiGatewayHostMedia } =
    await fetchApiSettings();

  const apiToken = req.headers["api-token"];
  console.log(apiToken);
  // const decodedToken = decodeToken(apiToken);
  // console.log(decodedToken)
  // const verifiedToken = await verifyToken(apiToken as string)

  // console.log(verifiedToken)
  const headers: AxiosRequestConfig["headers"] = {
    accept: "application/json",
    "x-api-key": apiKey,
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS, PUT, DELETE",
    "Content-Type": "application/json",
  };

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

  const response = await axios.get(
    `${apiGatewayHost}/wh_basic_details${updatedBasicDetails}`,
    {
      headers: headers,
    }
  );
  const newData = response.data.response;
  console.log(newData);
  return NextResponse.json({ response: newData }, { status: 200 });
}

export async function POST(req, res) {
  const dataReq = new URLSearchParams(req.nextUrl.searchParams);
  const data = Object.fromEntries(dataReq.entries());
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
  console.log("Hellllo");
  console.log(updatedBasicDetails);
  const response = await axios.post(
    `${apiGatewayHost}/wh_basic_details${updatedBasicDetails}`,
    {},
    {
      headers: headers,
    }
  );
  const newData = response.data.response;
  console.log(newData);
  return NextResponse.json({ response: newData }, { status: 200 });
}

export async function PUT(req, res) {
  const dataReq = new URLSearchParams(req.nextUrl.searchParams);
  const data = Object.fromEntries(dataReq.entries());
  let isFirstParam = true;
  let updatedBasicDetails = "";

  const headers = {
    accept: "application/json",
    "x-api-key": apiKey,
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "*",
  };

  for (const key in data) {
    if (data[key]) {
      const formattedKey =
        key === "latitude" || key === "longitude" ? key : key.toUpperCase();
      updatedBasicDetails +=
        (isFirstParam ? "?" : "&") + `${formattedKey}=${data[key]}`;
      isFirstParam = false;
    }
  }
  const response = await axios.put(
    `${apiGatewayHost}/wh_basic_details${updatedBasicDetails}`,
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
  const headers = {
    accept: "application/json",
    "x-api-key": apiKey,
  };

  const response = await axios.delete(`${apiGatewayHost}/wh_basic_details`, {
    params: data,
    headers: headers,
  });
  const newData = response.data.response;
  console.log(newData);
  return NextResponse.json({ response: newData }, { status: 200 });
}
