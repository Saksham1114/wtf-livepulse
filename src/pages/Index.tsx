import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { StatsBar } from '@/components/dashboard/StatsBar';
import { OccupancyGrid } from '@/components/dashboard/OccupancyGrid';
import { LiveFeed } from '@/components/dashboard/LiveFeed';
import { HeatmapPanel } from '@/components/dashboard/HeatmapPanel';
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { AnomalyLog } from '@/components/dashboard/AnomalyLog';
import { ChurnPanel } from '@/components/dashboard/ChurnPanel';
import { useLiveEvents } from '@/hooks/use-live-events';

const Index = () => {
  const {
    gyms, events, anomalies, isRunning, setIsRunning,
    totalCheckIns, totalCheckOuts, totalOccupancy, totalCapacity,
    totalRevenue, unacknowledgedAnomalies, acknowledgeAnomaly,
  } = useLiveEvents(1);

  return (
    <div className="min-h-screen bg-background px-4 pb-8 max-w-[1440px] mx-auto">
      <DashboardHeader isRunning={isRunning} onToggle={() => setIsRunning(r => !r)} />
      
      <StatsBar
        totalOccupancy={totalOccupancy}
        totalCapacity={totalCapacity}
        totalCheckIns={totalCheckIns}
        totalCheckOuts={totalCheckOuts}
        totalRevenue={totalRevenue}
        unacknowledgedAnomalies={unacknowledgedAnomalies}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mt-3">
        {/* Left column: Occupancy + Live Feed */}
        <div className="space-y-3">
          <OccupancyGrid gyms={gyms} />
          <LiveFeed events={events} />
        </div>

        {/* Center column: Heatmap + Revenue */}
        <div className="space-y-3">
          <HeatmapPanel />
          <RevenueChart />
        </div>

        {/* Right column: Anomalies + Churn */}
        <div className="space-y-3">
          <AnomalyLog anomalies={anomalies} onAcknowledge={acknowledgeAnomaly} />
          <ChurnPanel gyms={gyms} />
        </div>
      </div>
    </div>
  );
};

export default Index;
