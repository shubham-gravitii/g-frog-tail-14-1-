// @ts-nocheck
import axios from "axios";
import * as Constants from "../../../../utils/constants";
import { fetchApiSettings } from "../../../../utils/ssm";
import { NextRequest, NextResponse } from "next/server";
import { json } from "stream/consumers";
import { headers } from "next/headers";
import { getHeaderData } from "@/utils/apiFunctions/getHeaderData";
// export default async function handler(req, res) {
//   const { apiKey, apiGatewayHost, apiKeyMedia, apiGatewayHostMedia } =
//     await fetchApiSettings();

//   console.log("apiGatewayHost--");
//   console.log(apiGatewayHost);

//   console.log("apiKey--");
//   console.log(apiKey);
//   //   const session = await getSession({ req });

//   //   if (!session) {
//   //     return res.status(401).json({ error: 'Unauthorized' });
//   //   }
//   const {
//     query: { id },
//     method,
//     body,
//     query,
//   } = req;

//   switch (req.method) {
//     case "GET":
//       return handleGet(query, req, res, apiKey, apiGatewayHost);
//     case "POST":
//       return handlePost(query, req, res, apiKey, apiGatewayHost);
//     case "PUT":
//       return handlePut(query, req, res, apiKey, apiGatewayHost);
//     case "DELETE":
//       return handleDelete(req, res, apiKey, apiGatewayHost);
//     default:
//       return res.status(405).json({ error: "Method Not Allowed" });
//   }
// }

export async function GET(req: NextRequest) {
  try {
    const headerData = getHeaderData();
    console.log(headerData);
    const data = {
      customer_id: headerData.userId,
    };
    console.log(data);
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
    console.log("Updated customer details");
    console.log(updatedCustomerDetails);
    const response = await axios.get(
      `${apiGatewayHost}/wh_customer_details${updatedCustomerDetails}`,
      {
        headers: headers1,
      }
    );
    const newData = response.data;

    // console.log("----- logging data ----");
    // console.log(newData);
    if(response.data.length>1) {
      console.log(
        "Multiple responses were recieved from the server due to the incomplete details in the query parameters"
      );
      return NextResponse.json(
        {
          Message:
            "Multiple responses were recieved from the server due to the incomplete details in the query parameters",
        },
        { status: 400 }
      );
    }
    let flag = false;
    newData.response.forEach((element: any) => {
      if (element.customer_id !== headerData.userId) {
        flag = true;
      }
    });
    if (flag) {
      console.log(
        "Got response for other users"
      );
      return NextResponse.json(
        {
          Message:
            "Got response for other users",
        },
        { status: 400 }
      );
    }
    return NextResponse.json({ response:newData }, { status: 200 });
  } catch (error: any) {
    console.log(error?.message);
    return NextResponse.json(
      { Error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    console.log("Post Request")
    // const headerData = getHeaderData();
    // console.log(headerData);
    const { apiKey, apiGatewayHost, apiKeyMedia, apiGatewayHostMedia } =
      await fetchApiSettings();
    const dataReq = new URLSearchParams(req.nextUrl.searchParams);
    const data = Object.fromEntries(dataReq.entries());
    const headers = {
      accept: "application/json",
      "x-api-key": apiKey,
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS, PUT, DELETE",
    };

    console.log(data);

    let isFirstParam = true;
    let updatedCustomerDetails = "";

    for (const key in data) {
      if (data[key]) {
        updatedCustomerDetails +=
          (isFirstParam ? "?" : "&") + `${key.toUpperCase()}=${data[key]}`;
        isFirstParam = false;
      }
    }
    console.log(data);
    try {
      const response = await axios.post(
        `${apiGatewayHost}/wh_customer_details${updatedCustomerDetails}`,
        {},
        {
          headers,
        }
      );

      const newData = response.data;
      console.log(newData);
      return NextResponse.json({ newData }, { status: 200 });
    } catch (error: any) {
      console.log("Error in post api call");
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  } catch (error:any) {
    console.log("first catch error")
    console.log(error.message)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 })  }
}

export async function PUT(req: NextRequest) {
  const { apiKey, apiGatewayHost, apiKeyMedia, apiGatewayHostMedia } =
    await fetchApiSettings();
  const dataReq = new URLSearchParams(req.nextUrl.searchParams);
  const data = Object.fromEntries(dataReq.entries());
  const headers = {
    accept: "application/json",
    "x-api-key": apiKey,
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS, PUT, DELETE",
  };

  console.log(data);

  let isFirstParam = true;
  let updatedCustomerDetails = "";

  for (const key in data) {
    if (data[key]) {
      updatedCustomerDetails +=
        (isFirstParam ? "?" : "&") + `${key.toUpperCase()}=${data[key]}`;
      isFirstParam = false;
    }
  }

  try {
    const response = await axios.put(
      `${apiGatewayHost}/wh_customer_details${updatedCustomerDetails}`,
      {},
      {
        headers,
      }
    );

    const newData = response.data;
    console.log(newData);

    return NextResponse.json({ newData }, { status: 200 });
  } catch (error: any) {
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

export async function DELETE(req: NextRequest) {
  const { apiKey, apiGatewayHost, apiKeyMedia, apiGatewayHostMedia } =
    await fetchApiSettings();
  const dataReq = new URLSearchParams(req.nextUrl.searchParams);
  const data = Object.fromEntries(dataReq.entries());
  const headers = {
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

  try {
    const response = await axios.delete(
      `${apiGatewayHost}/wh_customer_details${updatedCustomerDetails}`,

      {
        headers: headers,
      }
    );
    const newData = response.data;
    console.log(newData);
    return NextResponse.json({ newData }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
