import { useExampleStore } from "../../utils/store";
import { useErrorBoundary } from "react-error-boundary";
import { useState } from "react";
import { Button } from "../../ui";
import { Success } from "../../ui/Success";
import { createWalletClient, custom, createPublicClient } from 'viem';
import ValidatorMessagesABI from "../../../../contracts/icm-contracts/compiled/ValidatorMessages.json";



export const DeployValidatorMessages = () => {
    const { showBoundary } = useErrorBoundary();
    const { validatorMessagesLibAddress, setValidatorMessagesLibAddress, walletChainId } = useExampleStore();
    const [isDeploying, setIsDeploying] = useState(false);

    async function handleDeploy() {
        if (!window.avalanche) {
            throw new Error('No ethereum wallet found');
        }

        setIsDeploying(true);
        try {
            const publicClient = createPublicClient({
                transport: custom(window.avalanche),
            });

            const walletClient = createWalletClient({
                transport: custom(window.avalanche),
            });

            const [address] = await walletClient.requestAddresses();

            const hash = await walletClient.deployContract({
                abi: ValidatorMessagesABI.abi,
                bytecode: ValidatorMessagesABI.bytecode.object as `0x${string}`,
                account: address,
                chain: {
                    //It all doesn't matter, we are using the walletChainId to identify the L1
                    id: walletChainId,
                    name: "My L1",
                    rpcUrls: {
                        default: { http: [] },
                    },
                    nativeCurrency: {
                        name: "COIN",
                        symbol: "COIN",
                        decimals: 18,
                    },
                },
            });

            const receipt = await publicClient.waitForTransactionReceipt({ hash });

            if (!receipt.contractAddress) {
                throw new Error('No contract address in receipt');
            }

            setValidatorMessagesLibAddress(receipt.contractAddress);
        } catch (error) {
            showBoundary(error);
        } finally {
            setIsDeploying(false);
        }
    }

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Deploy Validator Messages Library</h2>
            <div className="space-y-4">
                <div className="p-4 bg-gray-100 rounded-lg">
                    <p className="text-gray-700 mb-4">
                        This will deploy the <code>ValidatorMessages</code> contract to the currently connected EVM network <code>{walletChainId}</code>.
                    </p>
                    <p className="text-gray-700">
                        <code>ValidatorMessages</code> is a library required by the <code>ValidatorManager</code> family of contracts.
                    </p>
                    {knownNetwoks[walletChainId] && (
                        <p className="text-gray-700 mt-4">
                            ⚠️ Warning: You are connected to {knownNetwoks[walletChainId]}, not to your L1.
                        </p>
                    )}
                </div>
                <Button
                    type="primary"
                    onClick={handleDeploy}
                    loading={isDeploying}
                    disabled={isDeploying}
                >
                    Deploy Contract
                </Button>
            </div>
            <Success
                label="Library Address"
                value={validatorMessagesLibAddress}
            />
        </div>
    );
};


const knownNetwoks: Record<number, string> = {
    43114: "Avalanche Mainnet",
    43113: "Avalanche Fuji Testnet",
    43117: "Avalanche Devnet",
}
