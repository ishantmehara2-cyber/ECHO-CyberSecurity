import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import CommandCenter from './pages/CommandCenter';
import LiveTelemetry from './pages/LiveTelemetry';
import EvidenceVault from './pages/EvidenceVault';
import CorrelationEnginePage from './pages/CorrelationEnginePage';
import AttackReconstructionPage from './pages/AttackReconstructionPage';
import EvidenceIntelligencePage from './pages/EvidenceIntelligencePage';
import IncidentReplayPage from './pages/IncidentReplayPage';
import { InvestigationProvider } from './context/InvestigationContext';

function App() {
  return (
    <InvestigationProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<CommandCenter />} />
            <Route path="evidence-vault" element={<EvidenceVault />} />
            <Route path="live-telemetry" element={<LiveTelemetry />} />
            <Route path="attack-graph" element={<CorrelationEnginePage />} />
            <Route path="correlation-engine" element={<Navigate to="/attack-graph" replace />} />
            <Route path="attack-reconstruction" element={<AttackReconstructionPage />} />
            <Route path="evidence-intelligence" element={<EvidenceIntelligencePage />} />
            <Route path="incident-replay" element={<IncidentReplayPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Router>
    </InvestigationProvider>
  );
}

export default App;
