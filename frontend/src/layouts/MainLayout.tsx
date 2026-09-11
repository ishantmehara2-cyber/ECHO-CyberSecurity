import { useEffect, useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import {
  ShieldAlert,
  Activity,
  Network,
  GitBranch,
  Search,
  PlayCircle,
  Bell,
  UserCircle
} from 'lucide-react';

const MainLayout = () => {
  const [backendStatus, setBackendStatus] = useState<'LOADING' | 'ONLINE' | 'OFFLINE'>('LOADING');

  useEffect(() => {
    const checkBackendHealth = async () => {
      try {
        const response = await fetch('http://localhost:8000/health');
        if (response.ok) {
          setBackendStatus('ONLINE');
        } else {
          setBackendStatus('OFFLINE');
        }
      } catch (error) {
        setBackendStatus('OFFLINE');
      }
    };

    checkBackendHealth();
    const interval = setInterval(checkBackendHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { name: 'Command Center', path: '/', icon: ShieldAlert },
    { name: 'Live Telemetry', path: '/live-telemetry', icon: Activity },
    { name: 'Correlation Engine', path: '/correlation-engine', icon: Network },
    { name: 'Attack Reconstruction', path: '/attack-reconstruction', icon: GitBranch },
    { name: 'Evidence Intelligence', path: '/evidence-intelligence', icon: Search },
    { name: 'Incident Replay', path: '/incident-replay', icon: PlayCircle },
  ];

  return (
    <div className="flex h-screen bg-dark-900 text-slate-300 font-sans overflow-hidden selection:bg-cyan-900 selection:text-cyan-50">

      {/* Sidebar */}
      <div className="w-64 bg-dark-800 border-r border-dark-700 flex flex-col z-20 shadow-xl relative">
        <div className="h-16 flex items-center px-6 border-b border-dark-700 bg-dark-900/50">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-cyan-400" />
            <span className="font-bold text-xl tracking-wider text-slate-100">ECHO</span>
          </div>
        </div>

        <div className="flex-1 py-6 overflow-y-auto">
          <div className="px-4 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Investigation</div>
          <nav className="space-y-1 px-3">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                    isActive
                      ? 'bg-cyan-900/40 text-cyan-400 font-medium'
                      : 'text-slate-400 hover:bg-dark-700 hover:text-slate-200'
                  }`
                }
              >
                <item.icon className="w-4 h-4" />
                <span className="text-sm">{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Environment Tag */}
        <div className="p-4 border-t border-dark-700">
          <div className="text-xs text-slate-500 font-mono">ENV: DEV / LOCAL</div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative">
        {/* Header */}
        <header className="h-16 bg-dark-800 border-b border-dark-700 flex items-center justify-between px-6 z-10">

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-dark-900 rounded-full border border-dark-700">
              <span className="text-xs font-medium text-slate-400">BACKEND:</span>
              <div className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${
                  backendStatus === 'ONLINE' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' :
                  backendStatus === 'OFFLINE' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' :
                  'bg-yellow-500 animate-pulse'
                }`} />
                <span className={`text-xs font-bold ${
                  backendStatus === 'ONLINE' ? 'text-emerald-500' :
                  backendStatus === 'OFFLINE' ? 'text-red-500' :
                  'text-yellow-500'
                }`}>
                  {backendStatus}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-sm font-mono text-slate-400">
              {new Date().toISOString().split('T')[1].substring(0,8)} UTC
            </div>

            <div className="flex items-center gap-4 border-l border-dark-700 pl-6">
              <button className="text-slate-400 hover:text-slate-200 transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2 cursor-pointer group">
                <UserCircle className="w-7 h-7 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-slate-200">Analyst 01</span>
                  <span className="text-[10px] text-cyan-400 font-mono">THREAT INTEL</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-dark-900 relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
