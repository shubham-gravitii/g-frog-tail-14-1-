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
  console.log("rental details get request")
  const headers = {
    accept: "application/json",
    "x-api-key": apiKey,
  };

  let isFirstParam = true;
  let updatedRentalDetails = "";

  for (const key in data) {
    if (data[key]) {
      updatedRentalDetails +=
        (isFirstParam ? "?" : "&") + `${key.toUpperCase()}=${data[key]}`;
      isFirstParam = false;
    }
  }
  console.log(updatedRentalDetails)
  const response = await axios.get(
    `${apiGatewayHost}/wh_rental_information${updatedRentalDetails}`,
    {
      headers,
    }
  );
  const newData = response.data.response;
  console.log(newData);
  return NextResponse.json({ response: newData }, { status: 200 });
}

export async function POST(req, res) {
  const dataReq = new URLSearchParams(req.nextUrl.searchParams);
  const data = Object.fromEntries(dataReq.entries());
  console.log("rental details post request")

  const { apiKey, apiGatewayHost, apiKeyMedia, apiGatewayHostMedia } =
    await fetchApiSettings();
  console.log(data);

  const headers = {
    accept: "application/json",
    "x-api-key": apiKey,
  };

  let isFirstParam = true;
  let updatedRentalDetails = "";

  for (const key in data) {
    if (data[key]) {
      updatedRentalDetails +=
        (isFirstParam ? "?" : "&") + `${key.toUpperCase()}=${data[key]}`;
      isFirstParam = false;
    }
  }

  const response = await axios.post(
    `${apiGatewayHost}/wh_rental_information${updatedRentalDetails}`,
    {},
    {
      headers,
    }
  );
  const newData = response.data.response;
  
  return NextResponse({response:newData},{status:200})
}

export async function PUT(req, res) {
  const dataReq = new URLSearchParams(req.nextUrl.searchParams);
  const data = Object.fromEntries(dataReq.entries());
  const { apiKey, apiGatewayHost, apiKeyMedia, apiGatewayHostMedia } =
    await fetchApiSettings();
  console.log(data);

  const headers = {
    accept: "application/json",
    "x-api-key": apiKey,
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS, PUT, DELETE",
  };

  let isFirstParam = true;
  let updatedRentalDetails = "";

  for (const key in data) {
    if (data[key]) {
      updatedRentalDetails +=
        (isFirstParam ? "?" : "&") + `${key.toUpperCase()}=${data[key]}`;
      isFirstParam = false;
    }
  }

  const response = await axios.put(
    `${apiGatewayHost}/wh_rental_information${updatedRentalDetails}`,
    {},
    {
      params: data,
      headers: headers,
    }
  );
  const newData = response.data.response;
  
  return NextResponse({response:newData},{status:200})
}

export async function DELETE(req, res) {
  const dataReq = new URLSearchParams(req.nextUrl.searchParams);
  const data = Object.fromEntries(dataReq.entries());
  const { apiKey, apiGatewayHost, apiKeyMedia, apiGatewayHostMedia } =
    await fetchApiSettings();
  const headers = {
    accept: "application/json",
    "x-api-key": apiKey,
  };

  let isFirstParam = true;
  let updatedRentalDetails = "";

  for (const key in data) {
    if (data[key]) {
      updatedRentalDetails +=
        (isFirstParam ? "?" : "&") + `${key.toUpperCase()}=${data[key]}`;
      isFirstParam = false;
    }
  }

  const response = await axios.delete(
    `${apiGatewayHost}/wh_rental_information${updatedRentalDetails}`,
    {},
    {
      headers: headers,
    }
  );
  const newData = response.data.response;
  
  return NextResponse({response:newData},{status:200})
}
