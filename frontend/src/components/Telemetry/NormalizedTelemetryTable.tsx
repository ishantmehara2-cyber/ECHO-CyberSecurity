import { useState } from 'react';
import {
  Search,
  Database,
  ChevronLeft,
  ChevronRight,
  Info
} from 'lucide-react';
import { REPRESENTATIVE_100_EVENTS } from '../../data/normalizedTelemetryData';

export const NormalizedTelemetryTable = () => {
  const [searchTerm, setSearchType] = useState<string>('');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  const filteredEvents = REPRESENTATIVE_100_EVENTS.filter((evt) => {
    // Source filter
    if (sourceFilter !== 'all' && evt.source !== sourceFilter) return false;
    // Status filter
    if (statusFilter !== 'all' && evt.status !== statusFilter) return false;
    // Search query
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const match =
        evt.user.toLowerCase().includes(term) ||
        evt.host.toLowerCase().includes(term) ||
        evt.ip.toLowerCase().includes(term) ||
        evt.eventType.toLowerCase().includes(term) ||
        evt.description.toLowerCase().includes(term);
      if (!match) return false;
    }
    return true;
  });

  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="bg-dark-800 border border-dark-700 rounded-xl p-6 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-dark-700 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-cyan-400" />
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase">
              INVESTIGATION DATA // NORMALIZED TELEMETRY
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-100 mt-1">
            Normalized Telemetry Registry
          </h2>
        </div>

        <span className="text-xs font-mono px-3 py-1 bg-cyan-950 text-cyan-400 border border-cyan-800 rounded-lg font-bold">
          100 REPRESENTATIVE EVENTS / 2,214 INGESTED
        </span>
      </div>

      {/* Explanatory Banner */}
      <div className="p-3.5 bg-dark-900 border border-dark-700 rounded-lg text-xs font-sans text-slate-300 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-100 font-mono text-xs uppercase block">THE NEED FOR CORRELATION:</strong>
          <span>
            Out of thousands of routine corporate actions across hundreds of employees and hosts, suspicious events are hidden in plain sight. ECHO compares shared identities and timestamps across data silos to identify the few correlated events that actually matter.
          </span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs font-mono">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchType(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by user (e.g. employee_07), host (e.g. WORKSTATION-07), IP, or event type..."
            className="w-full bg-dark-900 border border-dark-700 text-slate-200 placeholder-slate-500 rounded-lg pl-9 pr-3 py-2 text-xs font-mono outline-none focus:border-cyan-500"
          />
        </div>

        {/* Source Filter */}
        <select
          value={sourceFilter}
          onChange={(e) => {
            setSourceFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="bg-dark-900 border border-dark-700 text-slate-300 rounded-lg px-3 py-2 text-xs outline-none focus:border-cyan-500"
        >
          <option value="all">Source: All</option>
          <option value="authentication">Auth</option>
          <option value="endpoint">Endpoint</option>
          <option value="network">Network</option>
          <option value="application">Application</option>
          <option value="file">File</option>
        </select>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="bg-dark-900 border border-dark-700 text-slate-300 rounded-lg px-3 py-2 text-xs outline-none focus:border-cyan-500"
        >
          <option value="all">Status: All</option>
          <option value="Normal">Normal</option>
          <option value="Observed">Observed</option>
          <option value="Requires correlation">Requires correlation</option>
          <option value="Potentially suspicious">Potentially suspicious</option>
        </select>
      </div>

      {/* Normalized Data Table */}
      <div className="bg-dark-900 border border-dark-700 rounded-xl overflow-x-auto">
        <table className="w-full text-left font-mono text-xs">
          <thead className="bg-dark-950 text-slate-400 border-b border-dark-700 text-[11px] uppercase">
            <tr>
              <th className="p-3">TIME</th>
              <th className="p-3">SOURCE</th>
              <th className="p-3">ENTITY / USER</th>
              <th className="p-3">HOST</th>
              <th className="p-3">IP ADDRESS</th>
              <th className="p-3">EVENT TYPE</th>
              <th className="p-3">STATUS / RISK</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-800 text-[11px]">
            {paginatedEvents.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-500">
                  No telemetry records match the search filter.
                </td>
              </tr>
            ) : (
              paginatedEvents.map((evt) => (
                <tr key={evt.id} className="hover:bg-dark-800/60 transition-colors">
                  <td className="p-3 text-cyan-400 font-bold">{evt.time}</td>
                  <td className="p-3 uppercase text-slate-400">{evt.source}</td>
                  <td className="p-3 text-purple-300 font-bold">{evt.user}</td>
                  <td className="p-3 text-blue-300">{evt.host}</td>
                  <td className="p-3 text-emerald-300">{evt.ip}</td>
                  <td className="p-3 text-slate-200 font-bold">{evt.eventType}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      evt.status === 'Potentially suspicious' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                      evt.status === 'Requires correlation' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' :
                      evt.status === 'Observed' ? 'bg-purple-950 text-purple-300 border border-purple-800' :
                      'bg-dark-800 text-slate-400'
                    }`}>
                      {evt.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-slate-400 border-t border-dark-700/60 pt-3">
        <span>
          Showing {filteredEvents.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredEvents.length)} of {filteredEvents.length} filtered records (100 representative events)
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded bg-dark-900 border border-dark-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-dark-700 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span>Page {currentPage} of {Math.max(totalPages, 1)}</span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="p-1.5 rounded bg-dark-900 border border-dark-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-dark-700 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
