import React, { createContext, useContext, useState } from 'react';
import { BackendAnalysisResult } from '../services/investigationService';
import { InvestigationCandidate } from '../types/candidates';

interface InvestigationContextType {
  analysisData: BackendAnalysisResult | null;
  setAnalysisData: (data: BackendAnalysisResult | null) => void;
  selectedCandidate: InvestigationCandidate | null;
  setSelectedCandidate: (candidate: InvestigationCandidate | null) => void;
  clearAnalysisData: () => void;
  hasAnalysisData: boolean;
}

const InvestigationContext = createContext<InvestigationContextType | undefined>(undefined);

export const InvestigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [analysisData, setAnalysisData] = useState<BackendAnalysisResult | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<InvestigationCandidate | null>(null);

  const clearAnalysisData = () => {
    setAnalysisData(null);
    setSelectedCandidate(null);
  };

  const hasAnalysisData = Boolean(analysisData && analysisData.total_records > 0);

  return (
    <InvestigationContext.Provider
      value={{
        analysisData,
        setAnalysisData,
        selectedCandidate,
        setSelectedCandidate,
        clearAnalysisData,
        hasAnalysisData
      }}
    >
      {children}
    </InvestigationContext.Provider>
  );
};

export const useInvestigation = () => {
  const context = useContext(InvestigationContext);
  if (!context) {
    throw new Error('useInvestigation must be used within an InvestigationProvider');
  }
  return context;
};
