//@ts-nocheck
import axios from "axios";
import * as Constants from "../../../utils/constants";
import { fetchApiSettings } from "../../../utils/ssm";
import { NextResponse } from "next/server";
export async function GET(req, res) {
  try {
    const data={}
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
    const response = await axios.get(
      `${apiGatewayHost}/wh_rental_information_data_size${updatedRentalDetails}`,
      {
        headers: headers,
      }
    );
    const newData = response.data;
    const res=newData.response;
    console.log(newData);
    return NextResponse.json({ response:res }, { status: 200 });
  } catch (error) {
    console.log(error.message);
    return NextResponse.json({error},{status:500});
  }
}
