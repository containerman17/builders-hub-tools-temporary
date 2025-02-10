import { bytesToHex, hexToBytes } from '@noble/hashes/utils';
import { getRPCEndpoint } from "../utils/rpcEndpoint";
import { useExampleStore } from "../utils/store";
import { Button } from "../ui/Button";
import { useErrorBoundary } from "react-error-boundary";
import { useState } from "react";
import { Input } from "../ui/Input";
import { utils, pvm, Context, L1Validator, pvmSerial, PChainOwner } from "@avalabs/avalanchejs";
import { InputArray } from "../ui/InputArray";

export const ConvertToL1 = () => {
    const { showBoundary } = useErrorBoundary();
    const {
        networkID,
        pChainAddress,
        subnetID,
        chainID,
        setSubnetID,
        setChainID,
        nodePopJsons,
        setNodePopJsons,
        managerAddress,
        setManagerAddress,
        L1ID,
        setL1ID
    } = useExampleStore(state => state);
    const [isConverting, setIsConverting] = useState(false);

    async function handleConvertToL1() {
        setL1ID("");
        setIsConverting(true);
        try {
            const pvmApi = new pvm.PVMApi(getRPCEndpoint(networkID));
            const feeState = await pvmApi.getFeeState();
            const context = await Context.getContextFromURI(getRPCEndpoint(networkID));

            const addressBytes = utils.bech32ToBytes(pChainAddress);

            const { utxos } = await pvmApi.getUTXOs({
                addresses: [pChainAddress]
            });

            const validators = nodePopJsons.map(nodePopJson => {
                const { nodeID, nodePOP } = JSON.parse(nodePopJson).result;
                const publicKey = utils.hexToBuffer(nodePOP.publicKey);
                if (!nodePOP.proofOfPossession) throw new Error("Proof of possession is missing");
                const signature = utils.hexToBuffer(nodePOP.proofOfPossession);
                if (!nodeID) throw new Error("Node ID is missing");

                const pChainOwner = PChainOwner.fromNative([addressBytes], 1);

                return L1Validator.fromNative(
                    nodeID,
                    BigInt(100), // weight 
                    BigInt(1000000000), // balance 
                    new pvmSerial.ProofOfPossession(publicKey, signature),
                    pChainOwner,
                    pChainOwner
                );
            });

            const managerAddressBytes = hexToBytes(managerAddress.replace('0x', ''));

            const tx = pvm.e.newConvertSubnetToL1Tx(
                {
                    feeState,
                    fromAddressesBytes: [addressBytes],
                    subnetId: subnetID,
                    utxos,
                    chainId: chainID,
                    validators,
                    subnetAuth: [0],
                    address: managerAddressBytes,
                },
                context,
            );

            const transactionID = await window.avalanche!.request({
                method: 'avalanche_sendTransaction',
                params: {
                    transactionHex: bytesToHex(tx.toBytes()),
                    chainAlias: 'P',
                }
            }) as string;

            setL1ID(transactionID);
        } catch (error) {
            showBoundary(error);
        } finally {
            setIsConverting(false);
        }
    }

    if (!pChainAddress) {
        return (
            <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-800">Convert Subnet to L1</h2>
                <div className="p-4 bg-gray-100 rounded-lg">
                    <p className="text-gray-700">Please get your P-Chain address first</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Convert Subnet to L1</h2>
            <div className="space-y-4">
                <Input
                    label="Your P-Chain Address"
                    value={pChainAddress}
                    disabled={true}
                    type="text"
                />
                <Input
                    label="Subnet ID"
                    value={subnetID}
                    onChange={setSubnetID}
                    type="text"
                />
                <Input
                    label="Chain ID"
                    value={chainID}
                    onChange={setChainID}
                    type="text"
                />
                <Input
                    label="Manager Address (0x...)"
                    value={managerAddress}
                    onChange={setManagerAddress}
                    placeholder="0x..."
                    type="text"
                />
                <InputArray
                    label="Info.getNodeID responses of the initial validators"
                    values={nodePopJsons}
                    onChange={setNodePopJsons}
                    type="textarea"
                    placeholder={'{"result":{"nodeID":"NodeID-7Xhw2mDxuDS44j42TCB6U5579esbSt3Lg","nodePOP":{"publicKey":"0x...","proofOfPossession":"0x..."}}}'}
                    rows={4}
                />
                <div className="text-sm text-gray-500 ">
                    Type in terminal: <span className="font-mono block">{`curl -X POST --data '{"jsonrpc":"2.0","id":1,"method":"info.getNodeID"}' -H "content-type:application/json;" 127.0.0.1:9650/ext/info`}</span>
                </div>
                <Button
                    type="primary"
                    onClick={handleConvertToL1}
                    disabled={isConverting || !managerAddress || nodePopJsons.length === 0}
                >
                    {isConverting ? 'Converting to L1...' : 'Convert to L1'}
                </Button>
            </div>
            {L1ID && (
                <div className="p-4 bg-gray-100 rounded-lg">
                    <p className="text-gray-700 font-semibold">L1 ID:</p>
                    <p className="font-mono text-lg break-all">{L1ID}</p>
                </div>
            )}
        </div>
    );
};
