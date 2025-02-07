import { useState, useEffect } from "react";

export const ConnectWallet = ({ children }: { children: React.ReactNode }) => {
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [hasWallet, setHasWallet] = useState<boolean>(false);
    const [address, setAddress] = useState<string>("");

    useEffect(() => {
        setHasWallet(!!window.avalanche);
    }, []);

    async function connectWallet() {
        try {
            const accounts = await window.avalanche?.request({
                method: "eth_requestAccounts",
            });
            if (accounts?.[0]) {
                setAddress(accounts[0]);
                setIsConnected(true);
            }
        } catch (error) {
            setError((error as Error).message || "Unknown error");
        }
    }

    useEffect(() => {
        window.avalanche?.request({
            method: "eth_accounts",
        }).then((accounts) => {
            if (accounts.length > 0) {
                console.log(`ConnectWallet:Connected to ${accounts[0]}`);
                setAddress(accounts[0]);
                setIsConnected(true);
            } else {
                console.log(`ConnectWallet:Not connected`);
                setIsConnected(false);
            }
        }).catch((error) => {
            console.log(`ConnectWallet:Error connecting to wallet: ${error}`);
            setError((error as Error).message || "Unknown error");
        });
    }, []);

    if (!hasWallet) {
        return (
            <div className="space-y-2">
                <a
                    href="https://chromewebstore.google.com/detail/core-crypto-wallet-nft-ex/agoakfejjabomempkjlepdflaleeobhb"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <button className="bg-blue-500 hover:bg-blue-600 text-white py-1.5 px-3 rounded transition-colors cursor-pointer">
                        Download Core Wallet
                    </button>
                </a>
            </div>
        );
    }

    if (!isConnected) {
        return (
            <div className="space-y-2">
                <button
                    onClick={connectWallet}
                    className="bg-blue-500 hover:bg-blue-600 text-white py-1.5 px-3 rounded transition-colors cursor-pointer"
                >
                    Connect Wallet
                </button>
                {error && (
                    <div className="text-red-500 text-sm">
                        {error}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="border border-blue-200 rounded p-3 flex justify-between items-center">
                <div className="text-blue-800 ">
                    Connected to <span className="font-mono">{address}</span>
                </div>
            </div>
            {children}
        </div>
    );
}; 
