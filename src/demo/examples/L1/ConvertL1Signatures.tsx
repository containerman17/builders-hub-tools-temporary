import { useExampleStore } from "../../utils/store";
import { Button } from "../../ui/Button";
import { useErrorBoundary } from "react-error-boundary";
import { useState } from "react";
import { Input } from "../../ui/Input";
import { InputArray } from "../../ui/InputArray";

export const ConvertL1Signatures = () => {
    const { showBoundary } = useErrorBoundary();
    const {
        pChainAddress,
        subnetID,
        chainID,
        setSubnetID,
        setChainID,
        managerAddress,
        setManagerAddress,
        nodePopJsons,
        setNodePopJsons,
        L1ID,
        setL1ID,
    } = useExampleStore(state => state);
    const [isConverting, setIsConverting] = useState(false);

    async function handleConvertSignatures() {
        setL1ID("");
        setIsConverting(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
            showBoundary(error);
        } finally {
            setIsConverting(false);
        }
    }

    if (!pChainAddress) {
        return (
            <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-800">Collect conversion signatures</h2>
                <div className="p-4 bg-gray-100 rounded-lg">
                    <p className="text-gray-700">Please get your P-Chain address first</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Collect conversion signatures</h2>
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
                    placeholder="Enter subnet ID to convert"
                />
                <Input
                    label="Chain ID"
                    value={chainID}
                    onChange={setChainID}
                    type="text"
                    placeholder="Enter chain ID"
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
                <div className="text-sm text-gray-500">
                    Type in terminal: <span className="font-mono block">{`curl -X POST --data '{"jsonrpc":"2.0","id":1,"method":"info.getNodeID"}' -H "content-type:application/json;" 127.0.0.1:9650/ext/info`}</span>
                </div>
                <Button
                    type="primary"
                    onClick={handleConvertSignatures}
                    disabled={isConverting || !managerAddress || nodePopJsons.length === 0}
                >
                    {isConverting ? 'Collecting...' : 'Collect Signatures'}
                </Button>
            </div>
            {L1ID && (
                <div className="p-4 bg-gray-100 rounded-lg">
                    <p className="text-gray-700 font-semibold">Transaction ID:</p>
                    <p className="font-mono text-lg break-all">{L1ID}</p>
                </div>
            )}
        </div>
    );
};
