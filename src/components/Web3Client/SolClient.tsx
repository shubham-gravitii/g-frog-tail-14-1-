// @ts-nocheck
import React, { useEffect, useState } from 'react';

import { Program, AnchorProvider, web3 } from '@project-serum/anchor';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet, WalletProvider, ConnectionProvider } from '@solana/wallet-adapter-react';
import { getRPC, setRPC } from '../../redux/web3/rpcSlice';
//const network = new Connection(clusterApiUrl("devnet"), "confirmed");
import { useDispatch, useSelector } from "react-redux";

import idl from '../../idl.json';

require('@solana/wallet-adapter-react-ui/styles.css');

const network = clusterApiUrl("devnet");
const wallets = [ new PhantomWalletAdapter() ]

const { SystemProgram, Keypair } = web3;
const baseAccount = Keypair.generate();
const opts = {
  preflightCommitment: "processed"
}
const programID = new PublicKey(idl.metadata.address);

const SolClient = () => {
    const [value, setValue] = useState('');
    const [dataList, setDataList] = useState([]);
    const [input, setInput] = useState('');
    const wallet = useWallet()
  
    const dispatch = useDispatch();
  
    //dispatch(setRPC("50"))
  
    async function getProvider() {
      /* create the provider and return it to the caller */
      const connection = new Connection(network, opts.preflightCommitment);
  
      const provider = new AnchorProvider(
        connection, wallet, opts.preflightCommitment,
      );
      return provider;
    }
  
    async function initialize() {    
      const provider = await getProvider();
      /* create the program interface combining the idl, program ID, and provider */
      const program = new Program(idl, programID, provider);
      try {
        /* interact with the program via rpc */
        await program.rpc.initialize("ok", {
          accounts: {
            baseAccount: baseAccount.publicKey,
            user: provider.wallet.publicKey,
            systemProgram: SystemProgram.programId,
          },
          signers: [baseAccount]
        });
        
        console.log('programId: ', SystemProgram.programId);
        const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
        console.log('account: ', account);
        setValue(account.data.toString());
        setDataList(account.dataList);
      } catch (err) {
        console.log("Transaction error: ", err);
      }
    }
  
    async function update() {
      //const baseAccountSt = dispatch(getRPC);
      //console.log('fetched baseAccount is : ', baseAccountSt);
      //console.log('baseAccount is : ', baseAccount);
  
      if (!input) return
      const provider = await getProvider();
      const program = new Program(idl, programID, provider);
      await program.rpc.update(input, {
        accounts: {
          baseAccount: baseAccount.publicKey
        }
      });
      const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
      console.log('account: ', account);
      setValue(account.data.toString());
      setDataList(account.dataList);
      setInput('');
    }
  
    if (!wallet.connected) {
  
      return (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop:'100px' }}>
          <WalletMultiButton />
        </div>
      )
    } else {
  
      return (
        <div className="App">
          <div>
            {
              !value && (<button onClick={initialize}>Initialize</button>)
            }
  
            {
              value ? (
                <div>
                  <h2>Current value: {value}</h2>
                  <input
                    placeholder="Add new data"
                    onChange={e => setInput(e.target.value)}
                    value={input}
                  />
                  <button onClick={update}>Add data</button>
                </div>
              ) : (
                <h3>Please Initialize.</h3>
              )
            }
            {
              dataList.map((d, i) => <h4 key={i}>{d}</h4>)
            }
          </div>
        </div>
      );
    }
  }

export default SolClient;