import { TransactionBlock } from '@mysten/sui.js/transactions';
import { client, keyPair1, parse_amount, find_one_by_type } from './helpers.js';
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { writeFileSync } from "fs";

const { execSync } = require('child_process');
const keypair =  keyPair1();

const path_to_scripts = dirname(fileURLToPath(import.meta.url))
const path_to_contracts = path.join(path_to_scripts, "../../contracts/tokens/sources")

console.log("Building move code...")

const { modules, dependencies } = JSON.parse(execSync(
    `sui move build --dump-bytecode-as-base64 --path ${path_to_contracts}`,
    { encoding: "utf-8" }
))

console.log("Deploying contracts...");
console.log(`Deploying from ${keypair.toSuiAddress()}`)

const tx = new TransactionBlock();

const [upgradeCap] = tx.publish({
	modules,
	dependencies,
});

tx.transferObjects([upgradeCap], keypair.getPublicKey().toSuiAddress());

const { objectChanges, balanceChanges } = await client.signAndExecuteTransactionBlock({
    signer: keypair, transactionBlock: tx, options: {
        showBalanceChanges: true,
        showEffects: true,
        showEvents: true,
        showInput: false,
        showObjectChanges: true,
        showRawInput: false
    }
})

if (!balanceChanges) {
    console.log("Error: Balance Changes was undefined")
    process.exit(1)
}
if (!objectChanges) {
    console.log("Error: object  Changes was undefined")
    process.exit(1)
}

console.log(objectChanges)
console.log(`Spent ${Math.abs(parse_amount(balanceChanges[0].amount))} on deploy`);

const published_change = objectChanges.find(change => change.type == "published")
if (published_change?.type !== "published") {
    console.log("Error: Did not find correct published change")
    process.exit(1)
}

// get package_id
const package_id = published_change.packageId

export const deployed_address = {
    packageId: published_change.packageId,
    
    USDC: {
        CapWrapper: "",
        UsdcCoinType: `${package_id}::usdc::USDC`,
        coinmetadata: ""  
    },
    USDT: {
        CapWrapper: "",
        UsdtCoinType: `${package_id}::usdt::USDT`,
        coinmetadata: ""  
    }

}
// Get usdc Capwrapper object
const cap_wrapper = `${deployed_address.packageId}::usdc::CapWrapper`

const cap_wrapper_id = find_one_by_type(objectChanges, cap_wrapper)
if (!cap_wrapper_id) {
    console.log("Error: Could not find listed_types object")
    process.exit(1)
}

deployed_address.USDC.CapWrapper = cap_wrapper_id;

// Get USDT Capwrapper object
const cap_wrapper2 = `${deployed_address.packageId}::usdt::CapWrapper`

const cap_wrapper_id2 = find_one_by_type(objectChanges, cap_wrapper2)
if (!cap_wrapper_id2) {
    console.log("Error: Could not find listed_types object")
    process.exit(1)
}

deployed_address.USDT.CapWrapper = cap_wrapper_id2;

// Get USDC Coinmetadata
const Usdcmetadata = `0x2::coin::CoinMetadata<${deployed_address.packageId}::usdc::USDC>`

const Usdcmetadata_id = find_one_by_type(objectChanges, Usdcmetadata)
if (!Usdcmetadata_id) {
    console.log("Error: Could not find Admin object ")
    process.exit(1)
}

deployed_address.USDC.coinmetadata = Usdcmetadata_id;

// Get USDT Coinmetadata
const Usdtmetadata = `0x2::coin::CoinMetadata<${deployed_address.packageId}::usdt::USDT>`

const Usdtmetadata_id = find_one_by_type(objectChanges, Usdtmetadata)
if (!Usdtmetadata_id) {
    console.log("Error: Could not find Admin object ")
    process.exit(1)
}

deployed_address.USDT.coinmetadata = Usdtmetadata_id;

writeFileSync(path.join(path_to_scripts, "../deployed_tokens_objects.json"), JSON.stringify(deployed_address, null, 4))
