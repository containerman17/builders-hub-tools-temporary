import { Button } from './ui/Button';
import { ErrorBoundary } from "react-error-boundary";
import { ConnectWallet } from './ui/ConnectWallet';
import { CreateSubnet } from './examples/CreateSubnet';
import { useExampleStore } from './utils/store';
import { CreateChain } from './examples/CreateChain';
import { ConvertToL1 } from './examples/ConvertToL1';
import { GetPChainAddress } from './examples/Wallet/GetPChainAddress';

const componentGroups = {
    Wallet: [
        {
            id: 'getPChainAddress',
            label: "Get P-chain Address",
            component: GetPChainAddress,
            fileName: "GetPChainAddress.tsx"
        }
    ],
    CreateL1: [
        {
            id: 'createSubnet',
            label: "Create Subnet",
            component: CreateSubnet,
            fileName: "CreateSubnet.tsx"
        },
        {
            id: 'createChain',
            label: "Create Chain",
            component: CreateChain,
            fileName: "CreateChain.tsx"
        },
        {
            id: 'convertToL1',
            label: "Convert to L1",
            component: ConvertToL1,
            fileName: "ConvertToL1.tsx"
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
                    <div className="space-y-4 p-6 border border-blue-200 rounded">
                        <comp.component />
                    </div>
                    <div>
                        <iframe frameBorder="0" scrolling="no" style={{ width: "100%", height: "557px" }} src={`https://emgithub.com/iframe.html?target=https%3A%2F%2Fgithub.com%2Fcontainerman17%2Fbuilders-hub-tools-temporary%2Fblob%2Fmain%2Fsrc%2Fexamples%2F${comp.fileName}&style=default&type=code&showBorder=on&showLineNumbers=on&showFileMeta=on&showFullPath=on&fetchFromJsDelivr=on&maxHeight=500`}></iframe>
                    </div>
                </ConnectWallet>
            </ErrorBoundary>
        </>
    };

    return (
        <div className="container mx-auto max-w-screen-lg flex h-screen">
            <div className="w-64 p-6 bg-gray-100 h-full">
                <h2 className="text-lg font-semibold mb-4">Examples</h2>
                <ul>
                    {Object.entries(componentGroups).map(([groupName, components]) => (
                        <li key={groupName} className="mb-4">
                            <h3 className="text-md font-semibold mb-2">{groupName}</h3>
                            <ul>
                                {components.map(({ id, label }) => (
                                    <li key={id} className="mb-2">
                                        <span
                                            className={`cursor-pointer block hover:bg-gray-200 p-2 rounded ${selectedTool === id ? 'bg-gray-200' : ''}`}
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
                    >
                        Reset State
                    </Button>
                </div>
            </div>
            <div className="flex-1 p-6">
                {renderSelectedComponent()}
            </div>
        </div>
    )
}

export default App
