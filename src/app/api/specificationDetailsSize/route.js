// import { getSession } from 'next-auth/react';
import axios from "axios";
import * as Constants from "../../../utils/constants";
import { fetchApiSettings } from '../../../utils/ssm';
import { NextResponse } from "next/server";


export async function GET(req, res) {
    
  const dataReq = new URLSearchParams(req.nextUrl.searchParams);
  const data = Object.fromEntries(dataReq.entries());
    const { apiKey, apiGatewayHost, apiKeyMedia, apiGatewayHostMedia } = await fetchApiSettings();

    console.log(data)

  const headers = {
    accept: "application/json",
    "x-api-key": apiKey,
  };

  const response = await axios.get(
    `${apiGatewayHost}/wh_building_specification_data_size`,
    {
      params: data,
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
