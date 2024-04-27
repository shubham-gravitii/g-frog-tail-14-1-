//@ts-nocheck


import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import React, { useState } from "react"
import { Connection, PublicKey, clusterApiUrl, RpcResponseAndContext, SignatureResult, LAMPORTS_PER_SOL, TransactionSignature } from '@solana/web3.js';
import { Card, CardBody, Container, Col, Row, UncontrolledTooltip, Input, Button, Modal, ModalHeader, ModalBody, Label } from "reactstrap"
//import {Select} from "reactstrap/lib/Select";
import Select from 'react-select'
import { FC, useCallback } from 'react';
import { notify } from '../../utils/notifications';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import { AiOutlineSearch, AiOutlineUndo} from "react-icons/ai";
import 'react-notifications/lib/notifications.css';
import * as Constants from '../../utils/constants';

type Props = {
    onDestinationAddressChange?: (newType: string) => void;
  };

export var AddressSuggestionsDestination: FC = ({
    onDestinationAddressChange
  }: Props) => {

    const { connection } = useConnection();
    const { publicKey } = useWallet();

    const [selectedDestinationCountry, setSelectedDestinationCountry] = useState('')

    const [searchAddress, setSearchAddress] = useState("");

    const [locationsArray, setLocationsArray] = useState([])
    const [triggerSearch, setTriggerSearch] = useState('')

    const getAddressLocations = async () => {

        var query_string = ""

        query_string = "?COUNTRY=" + selectedDestinationCountry + "&SEARCH_WORD=" + searchAddress

        console.log("query_string-->", Constants.api_gateway_host + '/address_locations/' + query_string);

        const res = await fetch(Constants.api_gateway_host + '/address_locations/' + query_string)
        const data = await res.json()
        setLocationsArray(data)
        console.log("response--->", data);
        //setGlobalData(data.response)

        setTriggerSearch("true")
    }

    const onClick = useCallback(async () => {
        if (!publicKey) {
            console.log('error', 'Wallet not connected!');
            NotificationManager.error('Wallet not connected!');
            return;
        }

        let signature: TransactionSignature = '';

        try {
            signature = await connection.requestAirdrop(publicKey, 1 * LAMPORTS_PER_SOL);
            await connection.confirmTransaction(signature, 'confirmed');
            NotificationManager.success('Airdrop successful!', signature);
            alert('Airdrop successful!')
        } catch (error: any) {
            NotificationManager.error('Airdrop failed!', signature);
            console.log('error', `Airdrop failed! ${error?.message}`, signature);
        }
    }, [publicKey, connection]);


    return (
        <>
            {   /* show search filters when the user has not triggered search */
                triggerSearch != "true" && (
                    <>
                        <div className="input-group mt-3">

                            <Select
                                className="form-control width100"
                                placeholder='Country *'
                                onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                                    setSelectedDestinationCountry(event['value']);
                                }}
                                options={Constants.country_list}
                                classNamePrefix="select2-selection"
                            />
                            <Input
                                className="form-control width100"
                                type="text"
                                placeholder='Zipcode or Location *'
                                onChange={(event) => {
                                    setSearchAddress(event.target.value);

                                }}
                            />

                            <span className="input-group-btn">
                                <Button
                                    color="dark"
                                    className="btn btn-dark w-100 h-100"
                                    onClick={() => getAddressLocations()}
                                >
                                    <AiOutlineSearch />
                                </Button>
                            </span>
                        </div>
                    </>
                )
            }

            {
                /* populate the search results */
                triggerSearch == "true" && (

                    <div className="mt-3">
                        <p className="mb-1 select2-container">

                        </p>
                        <Select
                            onChange={(event: React.ChangeEvent<HTMLSelectElement>) => onDestinationAddressChange?.(event['value'])}
                            placeholder='results in the dropdown'
                            options={locationsArray}
                            classNamePrefix="select2-selection"
                        />
                        <p className="mb-0" />

                        <Button

                            color="grey"
                            className="btn btn-grey w-10"
                            onClick={() => setTriggerSearch("false")}
                        >

                            <AiOutlineUndo />
                            Search Again
                        </Button>

                    </div>

                )
            }
        </>
    );
};

