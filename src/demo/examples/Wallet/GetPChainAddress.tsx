import {
  utils,
  secp256k1,
  networkIDs,
} from "@avalabs/avalanchejs";
import { Buffer as BufferPolyfill } from "buffer";
import { SigningKey } from 'ethers';
import { useEffect } from "react";
import { useErrorBoundary } from "react-error-boundary";
import { Button } from "../../ui/Button";
import { useExampleStore } from "../../utils/store";

export const GetPChainAddress = () => {
  const { showBoundary } = useErrorBoundary();
  const {
    xpPublicKey,
    evmPublicKey,
    setXpPublicKey,
    setEvmPublicKey,
    networkID,
    setNetworkID,
    pChainAddress,
    setPChainAddress
  } = useExampleStore();

  async function fetchPubKeys() {
    try {
      const pubkeys = await window.avalanche!.request({
        method: "avalanche_getAccountPubKey",
      }) as { xp: string, evm: string };
      setXpPublicKey(pubkeys.xp);
      setEvmPublicKey(pubkeys.evm);
    } catch (error) {
      showBoundary(error as Error);
    }
  }

  useEffect(() => {
    if (!xpPublicKey) {
      setPChainAddress("");
      return;
    }

    const compressed = SigningKey.computePublicKey(`0x${xpPublicKey}`, true).slice(2);
    const pubComp = BufferPolyfill.from(compressed, "hex");
    const address = secp256k1.publicKeyBytesToAddress(pubComp);
    setPChainAddress(utils.format("P", networkIDs.getHRP(networkID), address));
  }, [xpPublicKey, networkID, setPChainAddress]);

  return (
    <>
      <h2 className="text-lg font-semibold text-gray-800">Get P-Chain Address</h2>
      {!xpPublicKey && !evmPublicKey && <div>
        <Button onClick={fetchPubKeys} type="primary">Call avalanche_getAccountPubKey</Button>
      </div>}
      <div className="space-y-2">
        <p className="text-gray-700">
          <span className="w-36 inline-block">
            XP Public Key:
          </span>
          <span className="font-mono max-w-[400px] inline-block truncate align-bottom" title={xpPublicKey}>
            {xpPublicKey}
          </span>
        </p>
        <p className="text-gray-700">
          <span className="w-36 inline-block">
            EVM Public Key:
          </span>
          <span className="font-mono max-w-[400px] inline-block truncate align-bottom" title={evmPublicKey}>
            {evmPublicKey}
          </span>
        </p>
      </div>
      <div>
        <p className="text-gray-700">
          <span className="w-36 inline-block">
            Select Network:
          </span>
          <select
            id="network-select"
            value={networkID}
            onChange={(e) => setNetworkID(Number(e.target.value))}
            className="border border-gray-300 rounded py-1 px-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={networkIDs.FujiID}>Fuji</option>
            <option value={networkIDs.MainnetID}>Mainnet</option>
          </select>
        </p>
      </div>
      <div className="mt-4 p-4 bg-gray-100 rounded-lg">
        <p className="text-gray-700 font-semibold">P-Chain Address:</p>
        <p className="font-mono text-lg break-all">{pChainAddress || "Request public keys to see address"}</p>
      </div>
    </>
  );
};
