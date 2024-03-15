import { TransactionBlock } from '@mysten/sui.js/transactions';
import { client, keyPair1 } from '../helpers.js';
import data1 from '../../deployed_legacy_objects.json';
import data2 from '../../deployed_tokens_objects.json';

import { getCoinOfValue } from '@polymedia/suits';

const keypair1 = keyPair1();

const packageId = data1.packageId;
const legacy = data1.Legacy.legacy;
const cointype = data2.USDT.UsdtCoinType;
const coinmetadata = data2.USDT.coinmetadata;
const owner_address = "0x863d379fac323bf4caf9b881711a0f41c8ec88db68226ab75287476aa5b4b920";

(async () => {
    const txb = new TransactionBlock

    const [coin] = await getCoinOfValue(client, txb, owner_address, cointype, 10000000000000);

    console.log("Address1 deposit 10000 USDT")

    txb.moveCall({
        target: `${packageId}::assets_legacy::deposit_legacy`,
        arguments: [
           txb.object(legacy),
           coin,
           txb.object(coinmetadata)
        ],
        typeArguments: [cointype]
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