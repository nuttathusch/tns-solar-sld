import React, { useState, useEffect, useRef } from 'react';
import { Edit3, Check, RotateCcw, X } from 'lucide-react';

interface TextEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  initialValue: string;
  defaultValue?: string;
  onSave: (newValue: string) => void;
  onReset?: () => void;
}

export const TextEditModal: React.FC<TextEditModalProps> = ({
  isOpen,
  onClose,
  title,
  initialValue,
  defaultValue,
  onSave,
  onReset,
}) => {
  const [value, setValue] = useState(initialValue);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setValue(initialValue);
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 50);
    }
  }, [isOpen, initialValue]);

  if (!isOpen) return null;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSave(value);
      onClose();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const handleSave = () => {
    onSave(value);
    onClose();
  };

  const handleReset = () => {
    if (defaultValue !== undefined) {
      setValue(defaultValue);
      if (onReset) {
        onReset();
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 animate-in fade-in duration-100">
      <div className="bg-slate-900 border border-amber-500/50 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-amber-500/20 text-amber-400 rounded-lg border border-amber-500/30">
              <Edit3 size={16} />
            </div>
            <h3 className="text-sm font-bold text-slate-100">{title || 'แก้ไขข้อความในแบบ'}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-3">
          <label className="block text-xs font-semibold text-slate-300">
            พิมพ์ข้อความใหม่ที่ต้องการให้แสดงผลในแบบ:
          </label>
          <textarea
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={4}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm text-slate-100 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 font-sans resize-none"
            placeholder="พิมพ์ข้อความที่นี่..."
          />
          <p className="text-[11px] text-slate-400">
            💡 กด <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-300">Enter</kbd> เพื่อบันทึก, <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-300">Shift + Enter</kbd> ขึ้นบรรทัดใหม่, หรือ <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-300">Esc</kbd> เพื่อยกเลิก
          </p>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <div>
            {defaultValue !== undefined && (
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 px-2.5 py-1.5 rounded-lg border border-slate-700 transition"
              >
                <RotateCcw size={12} />
                <span>คืนค่าเดิม</span>
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="text-xs text-slate-300 hover:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 transition"
            >
              ยกเลิก
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-1 text-xs bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-1.5 rounded-lg shadow-md transition"
            >
              <Check size={14} />
              <span>บันทึกข้อความ</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
