import { create } from 'zustand'
import { persist, createJSONStorage, combine } from 'zustand/middleware'
import { networkIDs } from "@avalabs/avalanchejs";

export const initialState = {
    pChainAddress: "",
    networkID: networkIDs.FujiID,
    xpPublicKey: "",
    evmPublicKey: "",
    subnetID: "",
    selectedTool: "getPChainAddress",
    chainName: "My Chain",
    vmId: "srEXiWaHuhNyGwPUi444Tu47ZEDwxTWrbQiuD7FmgSAQ6X7Dy",
    genesisData: '{"hello":"world"}',
    chainID: "",
}

export const useExampleStore = create(
    persist(
        combine(initialState, (set) => ({
            setPChainAddress: (pChainAddress: string) => set({ pChainAddress }),
            setNetworkID: (networkID: number) => set({ networkID }),
            setXpPublicKey: (xpPublicKey: string) => set({ xpPublicKey }),
            setEvmPublicKey: (evmPublicKey: string) => set({ evmPublicKey }),
            setSubnetID: (subnetID: string) => set({ subnetID }),
            setSelectedTool: (selectedTool: string) => set({ selectedTool }),
            setChainName: (chainName: string) => set({ chainName }),
            setVmId: (vmId: string) => set({ vmId }),
            setGenesisData: (genesisData: string) => set({ genesisData }),
            setChainID: (chainID: string) => set({ chainID }),
            reset: () => set(initialState),
        })),
        {
            name: 'example-storage',
            storage: createJSONStorage(() => sessionStorage),
        },
    ),
)
