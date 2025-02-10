import {
  utils,
  secp256k1,
  networkIDs,
} from "@avalabs/avalanchejs";
import { Buffer as BufferPolyfill } from "buffer";
import { SigningKey } from 'ethers';
import { useEffect, useState } from "react";
import { useErrorBoundary } from "react-error-boundary";
import { Button } from "../../ui/Button";
import { useExampleStore } from "../../utils/store";

export const GetPChainAddress = () => {
  const { showBoundary } = useErrorBoundary();
  const store = useExampleStore();
  const [isLoading, setIsLoading] = useState(false);

  async function fetchPubKeys() {
    setIsLoading(true);
    try {
      const pubkeys = await window.avalanche!.request({
        method: "avalanche_getAccountPubKey",
      }) as { xp: string, evm: string };
      store.setXpPublicKey(pubkeys.xp);
      store.setEvmPublicKey(pubkeys.evm);
    } catch (error) {
      showBoundary(error as Error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (!store.xpPublicKey) {
      store.setPChainAddress("");
      return;
    }

    const compressed = SigningKey.computePublicKey(`0x${store.xpPublicKey}`, true).slice(2);
    const pubComp = BufferPolyfill.from(compressed, "hex");
    const address = secp256k1.publicKeyBytesToAddress(pubComp);
    store.setPChainAddress(utils.format("P", networkIDs.getHRP(store.networkID), address));
  }, [store.xpPublicKey, store.networkID]);

  return (
    <>
      <h2 className="text-lg font-semibold text-gray-800">Get P-Chain Address</h2>
      {!store.xpPublicKey && !store.evmPublicKey && <div>
        <Button onClick={fetchPubKeys} type="primary" loading={isLoading}>
          Call avalanche_getAccountPubKey
        </Button>
      </div>}
      <div className="space-y-2">
        <p className="text-gray-700">
          <span className="w-36 inline-block">
            XP Public Key:
          </span>
          <span className="font-mono max-w-[400px] inline-block truncate align-bottom" title={store.xpPublicKey}>
            {store.xpPublicKey}
          </span>
        </p>
        <p className="text-gray-700">
          <span className="w-36 inline-block">
            EVM Public Key:
          </span>
          <span className="font-mono max-w-[400px] inline-block truncate align-bottom" title={store.evmPublicKey}>
            {store.evmPublicKey}
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
            value={store.networkID}
            onChange={(e) => store.setNetworkID(Number(e.target.value))}
            className="border border-gray-300 rounded py-1 px-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={networkIDs.FujiID}>Fuji</option>
            <option value={networkIDs.MainnetID}>Mainnet</option>
          </select>
        </p>
      </div>
      <div className="mt-4 p-4 bg-gray-100 rounded-lg">
        <p className="text-gray-700 font-semibold">P-Chain Address:</p>
        <p className="font-mono text-lg break-all">{store.pChainAddress || "Request public keys to see address"}</p>
      </div>
    </>
  );
};
