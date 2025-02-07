import {
  utils,
  secp256k1,
  networkIDs,
} from "@avalabs/avalanchejs";
import { Buffer as BufferPolyfill } from "buffer";
import { SigningKey } from 'ethers';
import { useState } from "react";
import { useErrorBoundary } from "react-error-boundary";
import { Button } from "./utils/Button";

export const GetPChainAddress = () => {
  const [publicKeys, setPublicKeys] = useState<{ xp: string, evm: string }>({ xp: "", evm: "" });
  const { showBoundary } = useErrorBoundary();
  const [networkID, setNetworkID] = useState<number>(networkIDs.FujiID); // Default to Fuji

  async function fetchPubKeys() {
    try {
      const pubkeys = await window.avalanche!.request({
        method: "avalanche_getAccountPubKey",
      });
      setPublicKeys(pubkeys as { xp: string, evm: string });
    } catch (error) {
      showBoundary(error as Error);
    }
  }

  const [pChainAddress, setPChainAddress] = useState<string>("");

  async function extractPChainAddress() {
    const compressed = SigningKey.computePublicKey(`0x${publicKeys.xp}`, true).slice(2);
    const pubComp = BufferPolyfill.from(compressed, "hex");
    const address = secp256k1.publicKeyBytesToAddress(pubComp);
    setPChainAddress(utils.format("P", networkIDs.getHRP(networkID), address));
  }

  return (
    <>
      <h2 className="text-lg font-semibold text-gray-800">Get P-Chain Address</h2>
      <div>
        <Button onClick={fetchPubKeys}>Request Public Keys</Button>
      </div>
      <div className="space-y-2">
        <p className="text-gray-700">XP Public Key: <span className="font-mono">{publicKeys.xp}</span></p>
        <p className="text-gray-700">EVM Public Key: <span className="font-mono">{publicKeys.evm}</span></p>
      </div>
      <div>
        <label htmlFor="network-select" className="block text-gray-700">Select Network:</label>
        <select
          id="network-select"
          value={networkID}
          onChange={(e) => setNetworkID(Number(e.target.value))}
          className="border border-gray-300 rounded py-1 px-2 mt-1 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value={networkIDs.FujiID}>Fuji</option>
          <option value={networkIDs.MainnetID}>Mainnet</option>
        </select>
      </div>
      <div>
        <Button onClick={extractPChainAddress} disabled={!publicKeys.xp}>Extract P-Chain Address</Button>
      </div>
      <div>
        <p className="text-gray-700">P-Chain Address: <span className="font-mono">{pChainAddress}</span></p>
      </div>
    </>
  );
};
