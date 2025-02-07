import { useState } from 'react';
import { GetPChainAddress } from '../examples/GetPChainAddress';

// Define your components here - you can import more as needed
const components = {
    "Get P-chain Address": GetPChainAddress
    // ... add other components here
};

const componentList = Object.keys(components);

function App() {
    const [selectedComponent, setSelectedComponent] = useState<keyof typeof components>(componentList[0] as keyof typeof components); // Initialize with the first component

    const handleComponentClick = (componentName: keyof typeof components) => {
        setSelectedComponent(componentName);
    };

    const renderSelectedComponent = () => {
        const Component = components[selectedComponent as keyof typeof components];
        if (Component) {
            return <Component />; // Or pass props as needed
        }
        return <div>Component not found</div>; // Handle case where component is not found
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
