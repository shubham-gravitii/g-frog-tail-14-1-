//@ts-nocheck
// import { getSession } from 'next-auth/react';
import axios from "axios";
import * as Constants from "../../../utils/constants";
import { fetchApiSettings } from "../../../utils/ssm";
import { NextResponse } from "next/server";
export async function GET(req, res) {
  const dataReq = new URLSearchParams(req.nextUrl.searchParams);
  const data = Object.fromEntries(dataReq.entries());
  const { apiKey, apiGatewayHost, apiKeyMedia, apiGatewayHostMedia } =
    await fetchApiSettings();
  const headers = {
    accept: "application/json",
    "x-api-key": apiKey,
  };

  const response = await axios.get(
    `${apiGatewayHost}/wh_building_specification`,
    {
      params: data,
      headers: headers,
    }
  );
  const newData = response.data.response;
  console.log(newData);
  return NextResponse.json({ response: newData }, { status: 200 });
}

export async function POST(req, res) {
  console.log("spec details post start")

  const dataReq = new URLSearchParams(req.nextUrl.searchParams);
  const data = Object.fromEntries(dataReq.entries());
  const { apiKey, apiGatewayHost, apiKeyMedia, apiGatewayHostMedia } =
    await fetchApiSettings();
  console.log(data);

  const headers = {
    accept: "application/json",
    "x-api-key": apiKey,
  };

  let isFirstParam = true;
  let updatedSpecificationDetails = "";

  for (const key in data) {
    if (data[key]) {
      updatedSpecificationDetails +=
        (isFirstParam ? "?" : "&") + `${key.toUpperCase()}=${data[key]}`;
      isFirstParam = false;
    }
  }

  const response = await axios.post(
    `${apiGatewayHost}/wh_building_specification${updatedSpecificationDetails}`,
    {},
    {
      headers,
    }
  );
  const newData = response.data.response;
  console.log(newData);
  console.log("spec details post end")

  return NextResponse.json({ response: newData }, { status: 200 });
}

export async function PUT(req, res) {
  const dataReq = new URLSearchParams(req.nextUrl.searchParams);
  const data = Object.fromEntries(dataReq.entries());
  const { apiKey, apiGatewayHost, apiKeyMedia, apiGatewayHostMedia } =
    await fetchApiSettings();
  console.log(data);
  let isFirstParam = true;
  let updatedSpecificationDetails = "";

  const headers = {
    accept: "application/json",
    "x-api-key": apiKey,
  };

  for (const key in data) {
    if (data[key]) {
      updatedSpecificationDetails +=
        (isFirstParam ? "?" : "&") + `${key.toUpperCase()}=${data[key]}`;
      isFirstParam = false;
    }
  }
  const response = await axios.put(
    `${apiGatewayHost}/wh_building_specification${updatedSpecificationDetails}`,
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
  const { apiKey, apiGatewayHost, apiKeyMedia, apiGatewayHostMedia } =
    await fetchApiSettings();
  let isFirstParam = true;
  let updatedSpecificationDetails = "";

  const headers = {
    accept: "application/json",
    "x-api-key": apiKey,
  };

  for (const key in data) {
    if (data[key]) {
      updatedSpecificationDetails +=
        (isFirstParam ? "?" : "&") + `${key.toUpperCase()}=${data[key]}`;
      isFirstParam = false;
    }
  }

  const response = await axios.delete(
    `${apiGatewayHost}/wh_building_specification${updatedSpecificationDetails}`,
    {},
    {
      headers: headers,
    }
  );
  const newData = response.data.response;
  console.log(newData);
  return NextResponse.json({ response: newData }, { status: 200 });
}
