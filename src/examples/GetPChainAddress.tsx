import {
  utils,
  secp256k1,
  networkIDs,
} from "@avalabs/avalanchejs";
import { hexToBytes } from "@noble/hashes/utils";
import { ProjectivePoint } from "@noble/secp256k1";
import { Buffer } from "buffer";
import { SigningKey } from 'ethers';
import { ConnectWallet } from "./utils/ConnectWallet";

export const GetPChainAddress = () => {
  return <ConnectWallet>
    <div>GetPChainAddress</div>
  </ConnectWallet>
};
