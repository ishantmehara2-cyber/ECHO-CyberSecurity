import { HeroHeader } from '../components/CommandCenter/HeroHeader';
import { StatusCards } from '../components/CommandCenter/StatusCards';
import { DataJourneyPipeline } from '../components/CommandCenter/DataJourneyPipeline';
import { ConnectionDemo } from '../components/CommandCenter/ConnectionDemo';
import { LiveActivity } from '../components/CommandCenter/LiveActivity';
import { DataSourceReadiness } from '../components/CommandCenter/DataSourceReadiness';
import { DigitalDnaPreview } from '../components/CommandCenter/DigitalDnaPreview';

const CommandCenter = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Section 1: Hero */}
      <HeroHeader />

      {/* Section 2: Security Overview Cards */}
      <StatusCards />

      {/* Section 3: ECHO Data Journey Pipeline */}
      <DataJourneyPipeline />

      {/* Section 4: Signature Interactive Connection Demo */}
      <ConnectionDemo />

      {/* Section 5 & 6 Grid: Live System Activity & Data Source Readiness */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LiveActivity />
        <DataSourceReadiness />
      </div>

      {/* Section 7: Digital DNA Preparation */}
      <DigitalDnaPreview />
    </div>
  );
};

export default CommandCenter;
