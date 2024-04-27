// @ts-nocheck
import axios from 'axios';
/*
export function get_user_role(publikey) {
    
    var urole = "";

    axios.get("https://g-badger.herokuapp.com/user_profile/?WALLET_ADDRESS="+publikey.toString()).then((res) => {
            
        urole = JSON.parse(res.request.response).response[0].user_role;

        console.log("now printing user role--->")
        console.log(urole);

        });
        
    return urole;
}; */


import React, { useEffect, useState } from "react";
import { useWallet, WalletProvider, ConnectionProvider } from '@solana/wallet-adapter-react';
import { Program, AnchorProvider, web3 } from '@project-serum/anchor';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { values } from "lodash";
import PropTypes from "prop-types"

const UserRole = ( wallet_id ) => {
    
    var userRowle = "";

    async function getUserRole() {

        var res_val ="";
        axios.get("https://g-badger.herokuapp.com/user_profile/?WALLET_ADDRESS="+wallet_id.toString()).then((res) => {
            console.log("wallet_id9999",wallet_id);
            console.log("axios");
            
            res_val = JSON.parse(res.request.response).response[0].user_role;
            console.log(res_val);

        console.log("now printing user role--->")
        

        });
        console.log(res_val);
        return await res_val;
    }

    const res = getUserRole();
    
    res.then(value => {
        //console.log("hoohaa")
        //userRole =  JSON.parse(res.request.response).response[0].user_role;
        userRowle = value;
    })

    return res;
}

UserRole.propTypes = {
    data: PropTypes.any,
    datas: PropTypes.any
}
  

export default UserRole;