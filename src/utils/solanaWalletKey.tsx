// @ts-nocheck
import React, { useEffect, useState } from "react";
import { useWallet, WalletProvider, ConnectionProvider } from '@solana/wallet-adapter-react';
import { Program, AnchorProvider, web3 } from '@project-serum/anchor';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { values } from "lodash";
import PropTypes from "prop-types"

const network = clusterApiUrl("devnet");

const opts = {
    preflightCommitment: "processed"
}

//const wallet = useWallet()

const PubKey = ({ wallet, network}) => {
    
    const [walletAddress, setWalletAddress] = useState<HTMLInputElement | void | string>('')
    //var walletAddress = "";
    async function getWalletAddress() {
        // create the provider and return it to the caller 
        const connection = new Connection(network, opts.preflightCommitment);
        const provider = new AnchorProvider(
            connection, wallet, opts.preflightCommitment,
        );

        return await provider.wallet.publicKey;
    }

    const publicKey = getWalletAddress();
    publicKey.then(value => {
        setWalletAddress(value);
    })

    return walletAddress;
}

PubKey.propTypes = {
    data: PropTypes.any,
    datas: PropTypes.any
}

export default PubKey;