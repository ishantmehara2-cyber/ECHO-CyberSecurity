import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import CommandCenter from './pages/CommandCenter';
import LiveTelemetry from './pages/LiveTelemetry';
import EvidenceVault from './pages/EvidenceVault';
import CorrelationEnginePage from './pages/CorrelationEnginePage';
import AttackReconstructionPage from './pages/AttackReconstructionPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<CommandCenter />} />
          <Route path="evidence-vault" element={<EvidenceVault />} />
          <Route path="live-telemetry" element={<LiveTelemetry />} />
          <Route path="correlation-engine" element={<CorrelationEnginePage />} />
          <Route path="attack-reconstruction" element={<AttackReconstructionPage />} />
          <Route path="evidence-intelligence" element={<div className="p-8 font-mono text-slate-400">Evidence Intelligence - Coming in Future Phase</div>} />
          <Route path="incident-replay" element={<div className="p-8 font-mono text-slate-400">Incident Replay - Coming in Future Phase</div>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
