import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import CommandCenter from './pages/CommandCenter';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<CommandCenter />} />
          <Route path="live-telemetry" element={<div className="p-8">Live Telemetry - Coming in Future Phase</div>} />
          <Route path="correlation-engine" element={<div className="p-8">Correlation Engine - Coming in Future Phase</div>} />
          <Route path="attack-reconstruction" element={<div className="p-8">Attack Reconstruction - Coming in Future Phase</div>} />
          <Route path="evidence-intelligence" element={<div className="p-8">Evidence Intelligence - Coming in Future Phase</div>} />
          <Route path="incident-replay" element={<div className="p-8">Incident Replay - Coming in Future Phase</div>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
