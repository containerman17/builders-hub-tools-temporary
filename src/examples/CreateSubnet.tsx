import { utils, Context } from "@avalabs/avalanchejs";
import { pvm } from "@avalabs/avalanchejs";
import { bytesToHex } from '@noble/hashes/utils';
import { getRPCEndpoint } from "./utils/rpcEndpoint";
import { useExampleStore } from "./utils/store";
import { Button } from "./utils/Button";
import { useErrorBoundary } from "react-error-boundary";
import { useState } from "react";

export const CreateSubnet = () => {
  const { showBoundary } = useErrorBoundary();
  const { networkID, pChainAddress, setSubnetID, subnetID } = useExampleStore(state => state);
  const [isCreating, setIsCreating] = useState(false);

  async function handleCreateSubnet() {
    setSubnetID("");
    setIsCreating(true);
    try {
      const pvmApi = new pvm.PVMApi(getRPCEndpoint(networkID));
      const feeState = await pvmApi.getFeeState();
      const context = await Context.getContextFromURI(getRPCEndpoint(networkID));

      const addressBytes = utils.bech32ToBytes(pChainAddress);

      const { utxos } = await pvmApi.getUTXOs({
        addresses: [pChainAddress]
      });

      const tx = pvm.e.newCreateSubnetTx({
        feeState,
        fromAddressesBytes: [addressBytes],
        utxos,
        subnetOwners: [addressBytes],
      }, context);

      const txID = await window.avalanche!.request({
        method: 'avalanche_sendTransaction',
        params: {
          transactionHex: bytesToHex(tx.toBytes()),
          chainAlias: 'P',
        }
      }) as string;

      setSubnetID(txID);
    } catch (error) {
      showBoundary(error);
    } finally {
      setIsCreating(false);
    }
  }

  if (!pChainAddress) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">Create Subnet</h2>
        <div className="p-4 bg-gray-100 rounded-lg">
          <p className="text-gray-700">Please get your P-Chain address first using the Get P-Chain Address tool. Make sure to set the networkID to Fuji.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">Create Subnet</h2>
      <div>
        <Button
          onClick={handleCreateSubnet}
          disabled={isCreating}
        >
          {isCreating ? 'Creating Subnet...' : 'Create Subnet'}
        </Button>
      </div>
      <div className="p-4 bg-gray-100 rounded-lg">
        <p className="text-gray-700">
          <span className="w-36 inline-block">P-Chain Address:</span>
          <span className="font-mono break-all">{pChainAddress}</span>
        </p>
      </div>
      {subnetID && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
          <p className="text-gray-700 font-semibold">Subnet ID:</p>
          <p className="font-mono text-lg break-all">{subnetID}</p>
        </div>
      )}
    </div>
  );
};
