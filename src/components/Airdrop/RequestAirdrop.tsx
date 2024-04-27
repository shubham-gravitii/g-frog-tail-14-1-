import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey, clusterApiUrl, RpcResponseAndContext, SignatureResult, LAMPORTS_PER_SOL, TransactionSignature } from '@solana/web3.js';
import { FC, useCallback } from 'react';
import { notify } from '../../utils/notifications';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';

export const RequestAirdrop: FC = () => {
    const { connection } = useConnection();
    const { publicKey } = useWallet();

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
        <div>
            <button
                className="btn-airdrop1"
                onClick={onClick}
            >
                <span style={{ color: 'white' }}>Airdrop 1 </span>
            </button>
        </div>
    );
};

