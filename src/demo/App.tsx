import { useState } from 'react';
import { GetPChainAddress } from '../examples/GetPChainAddress';
import { Button } from '../examples/utils/Button';
import { ErrorBoundary } from "react-error-boundary";
import { ConnectWallet } from '../examples/utils/ConnectWallet';
import { CreateSubnet } from '../examples/CreateSubnet';
import { useExampleStore } from '../examples/utils/store';

const components = {
    getPChainAddress: {
        label: "Get P-chain Address",
        component: GetPChainAddress,
        fileName: "GetPChainAddress.tsx"
    },
    createSubnet: {
        label: "Create Subnet",
        component: CreateSubnet,
        fileName: "CreateSubnet.tsx"
    },
    // ... add other components here
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
        const comp = components[selectedTool as keyof typeof components];
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
                    <div className="space-y-4 p-4 border border-blue-200 rounded">
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
            <div className="w-64 p-4 bg-gray-100 h-full">
                <h2 className="text-lg font-semibold mb-2">Examples</h2>
                <ul>
                    {Object.entries(components).map(([id, { label }]) => (
                        <li key={id} className="mb-1">
                            <a
                                href="#"
                                className={`block hover:bg-gray-200 p-2 rounded ${selectedTool === id ? 'bg-gray-200' : ''}`}
                                onClick={() => handleComponentClick(id)}
                            >
                                {label}
                            </a>
                        </li>
                    ))}
                </ul>
                <div className="mt-4">
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
            <div className="flex-1 p-4">
                {renderSelectedComponent()}
            </div>
        </div>
    )
}

export default App
