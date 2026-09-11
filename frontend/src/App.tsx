import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import CommandCenter from './pages/CommandCenter';
import LiveTelemetry from './pages/LiveTelemetry';
import EvidenceVault from './pages/EvidenceVault';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<CommandCenter />} />
          <Route path="evidence-vault" element={<EvidenceVault />} />
          <Route path="live-telemetry" element={<LiveTelemetry />} />
          <Route path="correlation-engine" element={<div className="p-8 font-mono text-slate-400">Correlation Engine - Coming in Future Phase</div>} />
          <Route path="attack-reconstruction" element={<div className="p-8 font-mono text-slate-400">Attack Reconstruction - Coming in Future Phase</div>} />
          <Route path="evidence-intelligence" element={<div className="p-8 font-mono text-slate-400">Evidence Intelligence - Coming in Future Phase</div>} />
          <Route path="incident-replay" element={<div className="p-8 font-mono text-slate-400">Incident Replay - Coming in Future Phase</div>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
