import { getFullnodeUrl, SuiClient } from '@mysten/sui.js/client';
import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519';
import { fromB64 } from "@mysten/sui.js/utils";
import dotenv from "dotenv";
import type { SuiObjectChange } from "@mysten/sui.js/client";
import * as fs from "fs";

dotenv.config();

 // const cointype = data.sui_dollar.SUID_cointype;

export interface IObjectInfo {
    type: string | undefined
	id: string | undefined
}

export const keyPair = () => {
    const privkey = process.env.PRIVATE_KEY
if (!privkey) {
    console.log("Error: DEPLOYER_B64_PRIVKEY not set as env variable.")
    process.exit(1)
}
const keypair = Ed25519Keypair.fromSecretKey(fromB64(privkey).slice(1))
return keypair
}

export const keyPair1 = () => {
    const privkey = process.env.PRIVATE_KEY
if (!privkey) {
    console.log("Error: DEPLOYER_B64_PRIVKEY not set as env variable.")
    process.exit(1)
}
const keypair = Ed25519Keypair.fromSecretKey(fromB64("AJ0R9xsnv/L89+HpLJHbrszjfl6NDrEbfT7AVU3mlyZK").slice(1))
return keypair
}

export const keyPair2 = () => {
    const privkey = process.env.PRIVATE_KEY
if (!privkey) {
    console.log("Error: DEPLOYER_B64_PRIVKEY not set as env variable.")
    process.exit(1)
}
const keypair = Ed25519Keypair.fromSecretKey(fromB64("AFCPsZVajXQBCWQBjQfI4y9u+RDmzL8Y3JTWWApnRxOA").slice(1))
return keypair
}

export const client = new SuiClient({ url: getFullnodeUrl('testnet') });

export const parse_amount = (amount: string) => {
    return parseInt(amount) / 1_000_000_000
}

export const find_one_by_type = (changes: SuiObjectChange[], type: string) => {
    const object_change = changes.find(change => change.type == "created" && change.objectType == type)
    if (object_change?.type == "created") {
        return object_change.objectId
    }
}

export const getId = (type: string): string | undefined => {
    try {
        const rawData = fs.readFileSync('./deployed_objects.json', 'utf8');
        const parsedData: IObjectInfo[] = JSON.parse(rawData);
        const typeToId = new Map(parsedData.map(item => [item.type, item.id]));
        return typeToId.get(type);
    } catch (error) {
        console.error('Error reading the created file:', error);
    }
}

