import React, { createContext, useContext, ReactNode } from 'react';
import { useAccount } from 'wagmi';
import { useFHE } from './useFHE';
import FHEAnonymousCrowdfundingABI from '../abi/FHEAnonymousCrowdfunding';

const CONTRACT_ADDRESS = '0x5baB1e95C6Eba8e92CA8f5645A193167E79abD95'; // Updated contract address

interface ContractContextType {
  contractAddress: string;
  abi: any;
  address: string | undefined;
  fheInstance: any;
}

const ContractContext = createContext<ContractContextType | undefined>(undefined);

export function ContractProvider({ children }: { children: ReactNode }) {
  const { address } = useAccount();
  const { instance: fheInstance } = useFHE();

  return (
    <ContractContext.Provider value={{
      contractAddress: CONTRACT_ADDRESS,
      abi: FHEAnonymousCrowdfundingABI.abi,
      address,
      fheInstance
    }}>
      {children}
    </ContractContext.Provider>
  );
}

export function useContract() {
  const context = useContext(ContractContext);
  if (context === undefined) {
    throw new Error('useContract must be used within a ContractProvider');
  }
  return context;
}
