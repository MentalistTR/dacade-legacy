import { TransactionBlock } from '@mysten/sui.js/transactions';
import { client, keyPair1 } from '../helpers.js';
import data from '../../deployed_tokens_objects.json';

const keypair1 = keyPair1();

const packageId = data.packageId;
const capwrapper = data.USDC.CapWrapper;

(async () => {
    const txb = new TransactionBlock

    console.log("Address1 mints 10k USDC")

    const amount = txb.moveCall({
        target: `${packageId}::usdc::mint`,
        arguments: [
           txb.object(capwrapper),
           txb.pure(10000000000000),
        ],
    });

    txb.transferObjects([amount], keypair1.getPublicKey().toSuiAddress());

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