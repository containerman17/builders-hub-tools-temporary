import { Button } from './ui/Button';
import { ErrorBoundary } from "react-error-boundary";
import { ConnectWallet } from './ui/ConnectWallet';
import { CreateSubnet } from './examples/L1/CreateSubnet';
import { useExampleStore } from './utils/store';
import { CreateChain } from './examples/L1/CreateChain';
import { ConvertToL1 } from './examples/L1/ConvertToL1';
import { GetPChainAddress } from './examples/Wallet/GetPChainAddress';
import { ConvertL1Signatures } from './examples/L1/ConvertL1Signatures';
import { GithubEmbed } from './ui/GithubEmbed';
import { RefreshCw } from 'lucide-react';

const componentGroups = {
    "Wallet": [
        {
            id: 'getPChainAddress',
            label: "Get P-chain Address",
            component: GetPChainAddress,
            fileNames: ["src/demo/examples/Wallet/GetPChainAddress.tsx"]
        }
    ],
    'Create an L1': [
        {
            id: 'createSubnet',
            label: "Create Subnet",
            component: CreateSubnet,
            fileNames: ["src/demo/examples/L1/CreateSubnet.tsx"]
        },
        {
            id: 'createChain',
            label: "Create Chain",
            component: CreateChain,
            fileNames: ["src/demo/examples/L1/CreateChain.tsx"]
        },
        {
            id: 'convertToL1',
            label: "Convert to L1",
            component: ConvertToL1,
            fileNames: ["src/demo/examples/L1/ConvertToL1.tsx"]
        },
        {
            id: 'convertL1Signatures',
            label: "Convert L1 Signatures",
            component: ConvertL1Signatures,
            fileNames: ["src/demo/examples/L1/ConvertL1Signatures.tsx", "src/demo/examples/L1/convertWarp.ts"]
        }
    ]
};

const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error, resetErrorBoundary: () => void }) => {
    return (
        <div className="space-y-2">
            <div className="text-red-500 text-sm">
                {error.message}
            </div>
            <Button onClick={resetErrorBoundary}>
                Try Again
            </Button>
        </div>
    );
};

function App() {
    const { selectedTool, setSelectedTool } = useExampleStore();

    const handleComponentClick = (toolId: string) => {
        setSelectedTool(toolId);
    };

    const renderSelectedComponent = () => {
        const allComponents = Object.values(componentGroups).flat();
        const comp = allComponents.find(c => c.id === selectedTool);
        if (!comp) {
            return <div>Component not found</div>;
        }
        return <>
            <ErrorBoundary
                FallbackComponent={ErrorFallback}
                onReset={() => {
                    window.location.reload();
                }}
            >
                <ConnectWallet>
                    <div className="space-y-4">
                        <comp.component />
                    </div>
                    <div className="overflow-x-hidden">
                        {comp.fileNames.map((fileName, index) => (
                            <GithubEmbed
                                key={index}
                                user="containerman17"
                                repo="builders-hub-tools-temporary"
                                filePath={fileName}
                                lang="TS"
                                maxHeight={400}
                            />
                        ))}
                    </div>
                </ConnectWallet>
            </ErrorBoundary>
        </>
    };

    return (
        <div className="container mx-auto max-w-screen-lg flex h-screen">
            <div className="w-64 flex-shrink-0 p-6">
                <h2 className="text-lg font-semibold mb-4">Examples</h2>
                <ul>
                    {Object.entries(componentGroups).map(([groupName, components]) => (
                        <li key={groupName} className="mb-4">
                            <h3 className="text-md font-semibold mb-2">{groupName}</h3>
                            <ul>
                                {components.map(({ id, label }) => (
                                    <li key={id} className="mb-2">
                                        <span
                                            className={`cursor-pointer block hover:bg-gray-200 p-2 rounded ${selectedTool === id ? 'bg-gray-100' : ''}`}
                                            onClick={() => handleComponentClick(id)}
                                        >
                                            {label}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
                <div className="mt-6">
                    <Button
                        onClick={() => {
                            if (window.confirm("Are you sure you want to reset the state?")) {
                                useExampleStore.getState().reset();
                            }
                        }}
                        className="w-full"
                        type="secondary"
                        icon={<RefreshCw className="w-4 h-4 mr-2" />}
                    >
                        Reset State
                    </Button>
                </div>
            </div>
            <div className="flex-1 p-6 min-w-0">
                {renderSelectedComponent()}
            </div>
        </div>
    )
}

export default App
