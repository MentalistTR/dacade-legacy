import { TransactionBlock } from '@mysten/sui.js/transactions';
import { client, keyPair } from '../helpers.js';
import data1 from '../../deployed_legacy_objects.json';
import data2 from '../../deployed_tokens_objects.json';
import {SUI_CLOCK_OBJECT_ID} from '@mysten/sui.js/utils';

const keypair1 = keyPair();

const packageId = data1.packageId;
const legacy = data1.Legacy.legacy;
const cointype1 = data2.USDC.UsdcCoinType;
const cointype2= data2.USDT.UsdtCoinType;

(async () => {
    const txb = new TransactionBlock

    console.log("Heirs distribute funds")

    txb.moveCall({
        target: `${packageId}::assets_legacy::distribute`,
        arguments: [
           txb.object(legacy),
           txb.object(SUI_CLOCK_OBJECT_ID)
        ],
        typeArguments: [cointype1]
    });

    txb.moveCall({
        target: `${packageId}::assets_legacy::distribute`,
        arguments: [
           txb.object(legacy),
           txb.object(SUI_CLOCK_OBJECT_ID)
        ],
        typeArguments: [cointype2]
    });

    const {objectChanges}= await client.signAndExecuteTransactionBlock({
        signer: keypair1,
        transactionBlock: txb,
        options: {showObjectChanges: true}
    })

    if (!objectChanges) {
        console.log("Error: objectChanges is null or undefined");
        process.exit(1);
    }

    console.log(objectChanges);

})()