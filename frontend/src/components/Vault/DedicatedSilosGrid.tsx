import { SiloCard } from './SiloCard';
import { SILO_SLOT_CONFIGS } from '../../data/vaultDemoData';
import { SiloSlotKey, UploadedEvidenceFile } from '../../types/vault';

interface DedicatedSilosGridProps {
  siloFiles: Record<SiloSlotKey, UploadedEvidenceFile | null>;
  onUploadToSlot: (slotKey: SiloSlotKey, files: File[]) => void;
  onRemoveFromSlot: (slotKey: SiloSlotKey) => void;
  onMoveSlot: (fromSlotKey: SiloSlotKey, targetSlotKey: SiloSlotKey) => void;
}

export const DedicatedSilosGrid = ({
  siloFiles,
  onUploadToSlot,
  onRemoveFromSlot,
  onMoveSlot
}: DedicatedSilosGridProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
          FOUR DEDICATED EVIDENCE UPLOAD SILOS
        </h2>
        <span className="text-[11px] font-mono text-slate-500">
          Upload PDF files into their respective source channels.
        </span>
      </div>

      {/* 2x2 Grid Desktop, Stacked Mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {SILO_SLOT_CONFIGS.map((config) => (
          <SiloCard
            key={config.key}
            config={config}
            file={siloFiles[config.key]}
            onUpload={onUploadToSlot}
            onRemove={onRemoveFromSlot}
            onMoveSlot={onMoveSlot}
          />
        ))}
      </div>
    </div>
  );
};
