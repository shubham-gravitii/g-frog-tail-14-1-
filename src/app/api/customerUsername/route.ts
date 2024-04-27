//@ts-nocheck
import axios from "axios";
import * as Constants from "../../../../utils/constants";
import { fetchApiSettings } from "../../../utils/ssm";
import { NextRequest, NextResponse } from "next/server";
export async function GET(req: NextRequest) {
  try {
    const dataReq = new URLSearchParams(req.nextUrl.searchParams);
    const data = Object.fromEntries(dataReq.entries());
    const { apiKey, apiGatewayHost, apiKeyMedia, apiGatewayHostMedia } =
      await fetchApiSettings();
    const headers1 = {
      accept: "application/json",
      "x-api-key": apiKey,
    };

    let isFirstParam = true;
    let updatedCustomerDetails = "";

    for (const key in data) {
      if (data[key]) {
        updatedCustomerDetails +=
          (isFirstParam ? "?" : "&") + `${key.toUpperCase()}=${data[key]}`;
        isFirstParam = false;
      }
    }
    // if(updatedCustomerDetails==""){
    //   const errorMessage="Empty parameters"
    //   res.send({errorMessage});
    // }
    console.log("Updated user details");
    console.log(updatedCustomerDetails);
    const response = await axios.get(
      `${apiGatewayHost}/user_profile${updatedCustomerDetails}`,
      {
        headers: headers1,
      }
    );
    const newData = response.data.response;
    console.log(newData)
    if(newData.length>1){
        return NextResponse.json({error:"multiple data recieved"},{status:500})
    }
    if(newData.length==1){
        return NextResponse.json({ response: true }, { status: 200 });
    }
    return NextResponse.json({ response: false }, { status: 200 });
  } catch (error: any) {
    console.log(error?.message);
    return NextResponse.json(
      { Error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
