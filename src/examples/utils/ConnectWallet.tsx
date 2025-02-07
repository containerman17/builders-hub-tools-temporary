import { useState, useEffect } from "react";
import { Button } from "./Button";
import { useErrorBoundary } from "react-error-boundary";


export const ConnectWallet = ({ children }: { children: React.ReactNode }) => {
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [hasWallet, setHasWallet] = useState<boolean>(false);
    const [address, setAddress] = useState<string>("");
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const { showBoundary } = useErrorBoundary();


    useEffect(() => {
        setHasWallet(!!window.avalanche);
    }, []);

    async function connectWallet() {
        try {
            const accounts = await window.avalanche?.request({
                method: "eth_requestAccounts",
            });
            if (!accounts?.[0]) {
                throw new Error("No accounts found");
            }
            setAddress(accounts[0]);
            setIsConnected(true);
        } catch (error) {
            showBoundary(error as Error);
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
            // We can still log errors here, but no need to set localError for initial connection check
            console.log(`ConnectWallet:Error connecting to wallet: ${error}`);
        }).finally(() => {
            setIsLoaded(true);
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
                    <Button>Download Core Wallet</Button>
                </a>
            </div>
        );
    }

    if (!isConnected && isLoaded) {
        return (
            <div className="space-y-2">
                <Button onClick={connectWallet}>
                    Connect Wallet
                </Button>
            </div>
        );
    }

    if (!isLoaded) {
        return null;
    }

    return (
        <div className={`space-y-4 transition `}>
            <div className="border border-blue-200 rounded p-3 flex justify-between items-center">
                <div className="text-blue-800">
                    Connected to <span className="font-mono">{address}</span>
                </div>
            </div>
            {children}
        </div>
    );
};
