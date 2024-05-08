//@ts-nocheck
// import { getSession } from 'next-auth/react';
import axios from "axios";
import * as Constants from "../../utils/constants";
import { fetchApiSettings } from '../../utils/ssm';
import { NextResponse } from "next/server";
export async function GET(data, req, res, apiKey, apiGatewayHost) {
    const { apiKey, apiGatewayHost, apiKeyMedia, apiGatewayHostMedia } = await fetchApiSettings();

  const headers = {
    accept: "application/json",
    "x-api-key": apiKey,
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "*",
  };

  const response = await axios.get(
    `${apiGatewayHost}/wh_media_storage_cid`, 
    {
      params: data,
      headers: headers,
    }
  );
  const newData = response.data.response;
  console.log(newData)
  return NextResponse.json({response:newData},{status:200});
  
}

export async function POST(data, req, res, apiKey, apiGatewayHost) {
    const { apiKey, apiGatewayHost, apiKeyMedia, apiGatewayHostMedia } = await fetchApiSettings();

  const updatedString =
    "?CID=" +
    data.CID +
    "&WH_ID=" +
    data.WH_ID +
    "&OWNER_ENTITY_ID=" +
    data.OWNER_ENTITY_ID +
    "&IS_THUMBNAIL=" +
    data.IS_THUMBNAIL +
    "&IS_VERIFIED=" +
    Constants.isVerified +
    "&IS_ACTIVE=" +
    Constants.isActive;

  

  const headers = {
    accept: "application/json",
    "x-api-key": apiKey,
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "*",
  };

  console.log(data);

  const response = await axios.post(
    `${apiGatewayHost}/wh_media_storage_cid${updatedString}`,
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

async function handlePut(data, req, res, apiKey, apiGatewayHost) {
  
  const headers = {
    accept: "application/json",
    "x-api-key": apiKey,
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "*",
  };

  const updatedString =
    "?CID=" +
    data.CID +
    "&WH_ID=" +
    data.WH_ID +
    "&OWNER_ENTITY_ID=" +
    data.OWNER_ENTITY_ID +
    "&IS_THUMBNAIL=" +
    data.IS_THUMBNAIL +
    "&IS_VERIFIED=" +
    Constants.isVerified +
    "&IS_ACTIVE=" +
    Constants.isActive;

    console.log(updatedString)

  
    console.log(data);

  const response = await axios.put(
    `${apiGatewayHost}/wh_media_storage_cid${updatedString}`,
    {},
    {
      params: data,
      headers,
    }
  );
  const newData = response.data;

  console.log(newData);

  res.send(newData);
}

async function handleDelete(req, re, apiKey, apiGatewayHost) {
  
  const headers = {
    accept: "application/json",
    "x-api-key": apiKey,
  };

  const response = await axios.delete(
    `${apiGatewayHost}/wh_media_storage_cid`,
    {
      params: data,
      headers: headers,
    }
  );
  const newData = response.data;

  console.log(newData);

  res.send(newData);
}
