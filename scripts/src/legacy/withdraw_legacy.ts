import { TransactionBlock } from '@mysten/sui.js/transactions';
import { client, keyPair } from '../helpers.js';
import data1 from '../../deployed_legacy_objects.json';
import data2 from '../../deployed_tokens_objects.json';

const keypair = keyPair();

const packageId = data1.packageId;
const legacy = data1.Legacy.legacy;
const cointype1 = data2.USDC.UsdcCoinType;
const cointype2 = data2.USDT.UsdtCoinType;


(async () => {
    const txb = new TransactionBlock
    const name1: String = "USDC Stabil"
    const name2: String = "USDT Stabil"
    console.log("Heir Withdraw funds")

    let amount1 =  txb.moveCall({
        target: `${packageId}::assets_legacy::withdraw`,
        arguments: [
           txb.object(legacy),
           txb.pure(name1)
        ],
        typeArguments: [cointype1]
    });

    txb.transferObjects([amount1], keypair.getPublicKey().toSuiAddress());

    let amount2 =  txb.moveCall({
        target: `${packageId}::assets_legacy::withdraw`,
        arguments: [
           txb.object(legacy),
           txb.pure(name2)
        ],
        typeArguments: [cointype2]
    });

    txb.transferObjects([amount2], keypair.getPublicKey().toSuiAddress());

    const {objectChanges}= await client.signAndExecuteTransactionBlock({
        signer: keypair,
        transactionBlock: txb,
        options: {showObjectChanges: true}
    })

    if (!objectChanges) {
        console.log("Error: objectChanges is null or undefined");
        process.exit(1);
    }

    console.log(objectChanges);

})()