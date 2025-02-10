import { useState } from 'react';
import { GetPChainAddress } from '../examples/GetPChainAddress';
import { Button } from '../examples/utils/Button';
import { ErrorBoundary } from "react-error-boundary";
import { ConnectWallet } from '../examples/utils/ConnectWallet';
import { CreateSubnet } from '../examples/CreateSubnet';

const components = {
    "Get P-chain Address": {
        component: GetPChainAddress,
        fileName: "GetPChainAddress.tsx"
    },
    "Create Subnet": {
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

const componentList = Object.keys(components);

function App() {
    const [selectedComponent, setSelectedComponent] = useState<keyof typeof components>(componentList[0] as keyof typeof components); // Initialize with the first component

    const handleComponentClick = (componentName: keyof typeof components) => {
        setSelectedComponent(componentName);
    };

    const renderSelectedComponent = () => {
        const comp = components[selectedComponent as keyof typeof components];
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
                    {componentList.map((componentName) => (
                        <li key={componentName} className="mb-1">
                            <a
                                href="#"
                                className={`block hover:bg-gray-200 p-2 rounded ${selectedComponent === componentName ? 'bg-gray-200' : ''}`}
                                onClick={() => handleComponentClick(componentName as keyof typeof components)}
                            >
                                {componentName}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="flex-1 p-4">
                {renderSelectedComponent()}
            </div>
        </div>
    )
}

export default App
