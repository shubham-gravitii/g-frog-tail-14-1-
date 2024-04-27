// import { getSession } from 'next-auth/react';
import axios from "axios";
import { NextResponse } from "next/server";
import * as Constants from "../../../utils/constants";
import { fetchApiSettings } from "../../../utils/ssm";

export async function GET(req, res) {
  const { apiKey, apiGatewayHost, apiKeyMedia, apiGatewayHostMedia } = await fetchApiSettings();

  const headers = {
    accept: "application/json",
    "x-api-key": apiKey,
  };

  const response = await axios.get(
    `${apiGatewayHost}/wh_requirement_details_data_size`,
    {
      headers: headers,
    }
  );
  const newData = response.data;

  console.log(newData);
  return NextResponse.json({newData},{status:200});
}

export async function POST(req, res) {
  return NextResponse.json({error:"Method not allowed"},{status:200});
}

export async function PUT(req, res) {
  return NextResponse.json({error:"Method not allowed"},{status:200});
}

export async function DELETE(req, res) {
  return NextResponse.json({error:"Method not allowed"},{status:200});
}
