import { useRef, useState } from 'react';
import {
  Upload,
  Trash2,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Lock,
  Globe,
  ShieldAlert,
  Monitor,
  FileText
} from 'lucide-react';
import { SiloSlotConfig, SiloSlotKey, UploadedEvidenceFile } from '../../types/vault';

interface SiloCardProps {
  config: SiloSlotConfig;
  file: UploadedEvidenceFile | null;
  onUpload: (slotKey: SiloSlotKey, files: File[]) => void;
  onRemove: (slotKey: SiloSlotKey) => void;
  onMoveSlot?: (fromSlotKey: SiloSlotKey, targetSlotKey: SiloSlotKey) => void;
}

const ALLOWED_EXTENSIONS = ['.pdf', '.csv', '.json', '.jsonl', '.ndjson', '.log', '.txt', '.xml'];

const iconMap: Record<string, React.ElementType> = {
  Lock,
  Globe,
  ShieldAlert,
  Monitor
};

export const SiloCard = ({ config, file, onUpload, onRemove, onMoveSlot }: SiloCardProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const IconComponent = iconMap[config.iconName] || FileText;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const filterSupportedFiles = (fileList: File[]): File[] => {
    return fileList.filter((f) => {
      const lower = f.name.toLowerCase();
      return ALLOWED_EXTENSIONS.some((ext) => lower.endsWith(ext));
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const validFiles = filterSupportedFiles(Array.from(e.dataTransfer.files));
      if (validFiles.length > 0) {
        onUpload(config.key, validFiles);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const validFiles = filterSupportedFiles(Array.from(e.target.files));
      if (validFiles.length > 0) {
        onUpload(config.key, validFiles);
      }
      e.target.value = '';
    }
  };

  const fileExtension = file ? file.name.split('.').pop()?.toUpperCase() : '';

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`bg-dark-800 border rounded-xl p-5 flex flex-col justify-between transition-all duration-300 relative overflow-hidden group shadow-lg ${
        isDragging
          ? 'border-cyan-400 bg-cyan-950/40 shadow-[0_0_20px_rgba(6,182,212,0.25)]'
          : file
          ? 'border-cyan-800/80 bg-dark-800'
          : 'border-dark-700 bg-dark-800/80 hover:border-dark-600'
      }`}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf,.csv,.json,.jsonl,.ndjson,.log,.txt,.xml"
        className="hidden"
      />

      {/* Silo Card Header */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-lg ${
              file ? 'bg-cyan-950 text-cyan-400 border border-cyan-800' : 'bg-dark-900 text-slate-400 border border-dark-700'
            }`}>
              <IconComponent className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-mono font-bold text-slate-100 uppercase tracking-wider">
              {config.title}
            </h3>
          </div>

          <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase border ${
            file
              ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
              : 'bg-dark-900 text-slate-500 border-dark-700'
          }`}>
            {file ? '✓ EVIDENCE LOADED' : '○ WAITING FOR DATA'}
          </span>
        </div>

        <p className="text-xs text-slate-400 mb-4 font-sans leading-relaxed">
          {config.description}
        </p>

        {/* Mismatch Warning Banner if present */}
        {file?.warningMismatch && (
          <div className="mb-4 p-3 bg-amber-950/80 border border-amber-800 rounded-lg text-xs space-y-2 font-mono">
            <div className="flex items-start gap-1.5 text-amber-300 font-bold">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>SOURCE MISMATCH WARNING</span>
            </div>
            <p className="text-[11px] text-amber-200/90 font-sans leading-snug">
              {file.warningMismatch}
            </p>

            {file.suggestedSlotKey && onMoveSlot && (
              <button
                onClick={() => onMoveSlot(config.key, file.suggestedSlotKey!)}
                className="mt-1 flex items-center gap-1.5 px-2.5 py-1 bg-amber-900 hover:bg-amber-800 text-amber-100 rounded text-[11px] font-mono transition-colors cursor-pointer font-bold"
              >
                <span>MOVE TO SUGGESTED SILO ({file.suggestedSlotKey.toUpperCase()})</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        )}

        {/* SLOT CONTENT Area */}
        {!file ? (
          /* EMPTY SLOT STATE */
          <div
            onClick={() => fileInputRef.current?.click()}
            className="p-5 border-2 border-dashed border-dark-700 hover:border-cyan-500/60 rounded-xl text-center cursor-pointer transition-colors bg-dark-900/60 group/drop flex flex-col items-center justify-center space-y-2"
          >
            <Upload className="w-5 h-5 text-slate-500 group-hover/drop:text-cyan-400 transition-colors" />
            <div className="text-xs font-mono font-bold text-slate-300">
              {config.uploadLabel}
            </div>
            <div className="text-[10px] font-mono text-slate-500">
              Supports: .PDF .CSV .JSON .JSONL .LOG .TXT .XML
            </div>
          </div>
        ) : (
          /* LOADED SLOT STATE */
          <div className="p-4 bg-dark-900 border border-cyan-900/60 rounded-xl space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200 truncate pr-2">
                📄 {file.name}
              </span>
              <span className="px-1.5 py-0.5 rounded bg-dark-800 border border-dark-700 text-[10px] font-bold text-slate-300 shrink-0">
                {fileExtension}
              </span>
            </div>

            <div className="text-[11px] text-slate-400 flex items-center justify-between">
              <span>Size: <strong className="text-slate-200">{file.size}</strong></span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> READY
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-2 border-t border-dark-800">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-dark-800 hover:bg-dark-700 text-slate-300 border border-dark-700 rounded text-[11px] font-mono transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Replace</span>
              </button>

              <button
                onClick={() => onRemove(config.key)}
                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-dark-800 hover:bg-red-950/80 text-slate-300 hover:text-red-400 border border-dark-700 hover:border-red-800 rounded text-[11px] font-mono transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Silo Footer Status */}
      <div className="mt-4 pt-3 border-t border-dark-700/60 flex items-center justify-between text-[11px] font-mono">
        <span className="text-slate-500">SILO STATUS:</span>
        <span className={file ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
          {file ? '● EVIDENCE CONNECTED' : `○ ${config.emptyStatusText}`}
        </span>
      </div>
    </div>
  );
};
