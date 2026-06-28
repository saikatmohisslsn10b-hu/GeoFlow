import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2 } from 'lucide-react';

export default function EditableTable({ columns, rows, onChange, addLabel = 'Add Row' }) {
  const updateRow = (index, key, val) => {
    const next = [...rows];
    next[index] = { ...next[index], [key]: val };
    onChange(next);
  };

  const addRow = () => {
    const newRow = {};
    columns.forEach((c) => { newRow[c.key] = ''; });
    onChange([...rows, newRow]);
  };

  const deleteRow = (index) => {
    onChange(rows.filter((_, i) => i !== index));
  };

  return (
    <div className="rounded-xl border border-slate-200/60 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="gis-table">
          <thead>
            <tr>
              {columns.map((c) => (
                <th key={c.key}>{c.label}</th>
              ))}
              <th className="w-12"></th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {rows.map((row, i) => (
                <motion.tr
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {columns.map((c) => (
                    <td key={c.key}>
                      <input
                        type={c.type || 'text'}
                        value={row[c.key]}
                        onChange={(e) => updateRow(i, c.key, e.target.value)}
                        className="gis-input text-sm py-1.5 px-2"
                        placeholder={c.placeholder || ''}
                      />
                    </td>
                  ))}
                  <td>
                    <button
                      onClick={() => deleteRow(i)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
      <div className="px-4 py-3 border-t border-slate-100">
        <button
          onClick={addRow}
          className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1.5 transition"
        >
          <Plus className="w-4 h-4" /> {addLabel}
        </button>
      </div>
    </div>
  );
}