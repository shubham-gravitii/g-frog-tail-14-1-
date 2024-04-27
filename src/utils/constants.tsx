// @ts-nocheck 
import React from "react";

export const aws_region = "ap-south-1";
export const solana_network = "devnet";
// export const api_gateway_host = "https://4n5cm6zhwj.execute-api.ap-south-1.amazonaws.com/default"

export const local_api_gateway_host = "/api"
export const api_gateway_host = "http://localhost:8000";
//export const api_gateway_host = "http://localhost:8081";
// export const local_api_gateway_host = process.env.REACT_APP_FRONTEND_API
// export const api_gateway_host = process.env.REACT_APP_BACKEND_API
// const host ={
//     wh_basic = "wh_basic"
// }
export const isActive="True";
export const isVerified="False";

import { TS } from './currentTimestamp';

export function HashedEmailComponent( email:String ) {
    const salt = bcrypt.genSaltSync(10);
    const hashedEmail = bcrypt.hashSync(email, salt);
    const cleanedHashedEmail = hashedEmail.replace(/[^a-zA-Z0-9]/g, '') + TS();
    return cleanedHashedEmail.substring(0, 15);
  }

export const paginationPostPerPage = 30
export const imagesPerPostAllowed = 30

export const web3ApiToken = 'test123'

export const country_list = [
    {
        options: [
            { label: "India", value: "India" },
            { label: "USA", value: "USA"},
            { label: "Canada", value: "Canada"},
            { label: "Netherlands", value: "Netherlands"},
            { label: "Estonia", value: "Estonia"},
            { label: "France", value: "France"},
            { label: "Belgium", value: "Belgium"},
            { label: "Norway", value: "Norway"},
            { label: "Poland", value: "Poland"},
            { label: "UK", value: "UK"},
            { label: "Germany", value: "Germany"},
            { label: "Czech Republic", value: "Czech Republic"}
            
        ]
    }
    
]

export const emailjsPublicKey = process.env.REACT_APP_EMAILJS_API
export const emailjsServiceId = process.env.REACT_APP_EMAILJS_SERVICE_ID
export const emailjsTemplateID = process.env.REACT_APP_EMAILJS_TEMPLATE_ID
export const adminEmail = process.env.REACT_APP_EMAILJS_ADMIN_EMAIL
