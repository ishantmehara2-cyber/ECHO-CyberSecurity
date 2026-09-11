import { useState, useEffect, useRef } from 'react';
import { TelemetryHeader } from '../components/Telemetry/TelemetryHeader';
import { TelemetrySourcesGrid } from '../components/Telemetry/TelemetrySourcesGrid';
import { IngestionFlowDiagram } from '../components/Telemetry/IngestionFlowDiagram';
import { LiveEventStream } from '../components/Telemetry/LiveEventStream';
import { NormalizationPreview } from '../components/Telemetry/NormalizationPreview';
import { IntelligenceSummary } from '../components/Telemetry/IntelligenceSummary';
import { NormalizedTelemetryTable } from '../components/Telemetry/NormalizedTelemetryTable';
import { INITIAL_SOURCES } from '../data/telemetryData';
import { TelemetryEvent, TelemetrySourceInfo, TelemetrySourceType, EventSeverity } from '../types/telemetry';
import { useInvestigation } from '../context/InvestigationContext';

export const LiveTelemetry = () => {
  const { analysisData, hasAnalysisData } = useInvestigation();
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [events, setEvents] = useState<TelemetryEvent[]>([]);
  const [sources, setSources] = useState<TelemetrySourceInfo[]>(INITIAL_SOURCES);
  const [selectedEvent, setSelectedEvent] = useState<TelemetryEvent | null>(null);
  const [sourceFilter, setSourceFilter] = useState<TelemetrySourceType | 'all'>('all');
  const [severityFilter, setSeverityFilter] = useState<EventSeverity | 'all'>('all');

  const streamIndexRef = useRef<number>(0);
  const simulationDataRef = useRef<TelemetryEvent[]>([]);

  // Initialize with full dataset
  useEffect(() => {
    const currentEvents = (analysisData?.normalized_events || []).map((event: any, index: number) => ({
      id: event.id || `normalized-${index}`,
      timestamp: event.timestamp || 'unknown',
      rawTimestamp: event.timestamp || 'unknown',
      source: event.source,
      eventType: event.eventType,
      title: event.eventType,
      description: event.description,
      severity: event.severity,
      user: event.entity_user,
      ip: event.entity_ip,
      device: event.entity_host,
      rawData: event.raw_source,
      normalizedData: event,
    } as TelemetryEvent));
    setEvents(currentEvents);
    simulationDataRef.current = currentEvents;
    setSelectedEvent(currentEvents[0] || null);
  }, [analysisData]);

  // Streaming timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (isStreaming && !isPaused) {
      interval = setInterval(() => {
        if (streamIndexRef.current < simulationDataRef.current.length) {
          const nextEvent = simulationDataRef.current[streamIndexRef.current];

          setEvents((prev) => {
            if (prev.some((e) => e.id === nextEvent.id)) return prev;
            return [...prev, nextEvent];
          });

          setSources((prevSources) =>
            prevSources.map((s) => {
              if (s.id === nextEvent.source) {
                return {
                  ...s,
                  eventCount: s.eventCount + 1,
                  latestActivity: nextEvent.timestamp
                };
              }
              return s;
            })
          );

          setSelectedEvent(nextEvent);
          streamIndexRef.current += 1;
        } else {
          setIsStreaming(false);
        }
      }, 1200);
    }

    return () => clearInterval(interval);
  }, [isStreaming, isPaused]);

  const handleStartDemo = () => {
    setEvents([]);
    setSelectedEvent(null);
    streamIndexRef.current = 0;
    setIsStreaming(true);
    setIsPaused(false);
  };

  const handlePause = () => setIsPaused(true);
  const handleResume = () => setIsPaused(false);
  const handleClear = () => {
    setEvents([]);
    setSelectedEvent(null);
    setIsStreaming(false);
    setIsPaused(false);
    streamIndexRef.current = 0;
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* 1. Header & Controls */}
      <TelemetryHeader
        isStreaming={isStreaming}
        isPaused={isPaused}
        eventCount={events.length}
        onStartDemo={handleStartDemo}
        onPause={handlePause}
        onResume={handleResume}
        onClear={handleClear}
      />

      {/* 2. Active Telemetry Connectors Grid */}
      <TelemetrySourcesGrid
        sources={sources}
        activeFilter={sourceFilter}
        onSelectFilter={setSourceFilter}
        isStreaming={isStreaming && !isPaused}
      />

      {/* 3. Ingestion & Normalization Visual Flow Diagram */}
      <IngestionFlowDiagram isStreaming={isStreaming && !isPaused} />

      {/* 4. Normalization Preview Component */}
      <NormalizationPreview
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />

      {/* 5. Live Event Stream & Intelligence Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <LiveEventStream
            events={events}
            selectedEventId={selectedEvent?.id || null}
            onSelectEvent={setSelectedEvent}
            sourceFilter={sourceFilter}
            severityFilter={severityFilter}
            onChangeSourceFilter={setSourceFilter}
            onChangeSeverityFilter={setSeverityFilter}
          />
        </div>

        <div className="lg:col-span-1">
          <IntelligenceSummary events={events} />
        </div>
      </div>

      {/* 6. Normalized Telemetry Registry (100 Representative Events Table) */}
      {hasAnalysisData ? <NormalizedTelemetryTable events={analysisData?.normalized_events} /> : (
        <div className="p-8 text-center bg-dark-800 border border-dark-700 rounded-xl text-slate-400">
          Upload telemetry in the Evidence Vault to view normalized events.
        </div>
      )}
    </div>
  );
};

export default LiveTelemetry;
