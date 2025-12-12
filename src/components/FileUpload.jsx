// src/components/FileUpload.jsx
import React from 'react';
import { Badge, Button } from 'react-bootstrap';
import { X as XIcon } from 'react-bootstrap-icons';

/** Format bytes into human readable sizes */
export const humanFileSize = (size) => {
  if (!size && size !== 0) return '';
  const i = size === 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  return `${(size / Math.pow(1024, i)).toFixed((i === 0) ? 0 : (i < 2 ? 1 : 2))} ${sizes[i]}`;
};

/** File metadata UI used in modals */
export const FileMeta = ({ file, onRemove }) => {
  if (!file) return null;
  return (
    <div className="mt-2 d-flex align-items-center gap-2 file-meta">
      <Badge bg="success" pill style={{ fontSize: 12, padding: '6px 8px' }}>✓</Badge>
      <div style={{ fontSize: 13 }}>
        <strong style={{ display: 'block' }}>{file.name}</strong>
        <small className="text-muted">{humanFileSize(file.size)}</small>
      </div>
      <Button variant="outline-secondary" size="sm" className="ms-auto" onClick={onRemove} title="Remove selected file">
        <XIcon size={14} />
      </Button>
    </div>
  );
};

/**
 * downloadTemplate(headersArray, sampleArray, filenameBase = 'template')
 * - headers: ['name','description']
 * - sample: ['Info Technology','Handles IT...']
 * - filenameBase: 'departments-template' (without extension)
 */
export const downloadTemplate = (headers, sample, filenameBase = 'template') => {
  const csvContent = [headers.join(','), (sample || []).join(',')].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const filename = filenameBase.endsWith('.csv') ? filenameBase : `${filenameBase}.csv`;

  if (navigator.msSaveBlob) {
    navigator.msSaveBlob(blob, filename);
  } else {
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};

/** Generic CSV parser (naive split) -> array of objects keyed by lowercased header */
export const parseCSV = (text) => {
  const lines = text.split(/\r\n|\n/).map(l => l.trim()).filter(l => l !== '');
  if (lines.length < 1) return [];
  const header = lines[0].split(',').map(h => h.trim().toLowerCase());
  const rows = lines.slice(1);
  return rows.map(row => {
    const cols = row.split(',').map(c => c.trim());
    const obj = {};
    header.forEach((h, idx) => { obj[h] = cols[idx] ?? ''; });
    return obj;
  });
};

/**
 * importFromCSV(options)
 *
 * Generic CSV importer:
 * - selectedCSVFile, selectedXLSXFile
 * - list (current array), setList (setter)
 * - mapRow: (parsedRow) => itemWithoutId  // REQUIRED
 * - validateRow: (candidate, { existing, newItems }) => { valid, errors }  // optional
 * - getNextIdStart (optional)
 * - onFinish (optional)
 * - UI helpers: setSelectedCSVFile, setSelectedXLSXFile, setShowAddModal, setActiveTab (optional)
 */
export const importFromCSV = async ({
  selectedCSVFile,
  selectedXLSXFile,
  list,
  setList,
  mapRow,
  validateRow,
  getNextIdStart = (existing) => (existing.length === 0 ? 1 : Math.max(...existing.map(x => x.id ?? 0)) + 1),
  onFinish,
  setSelectedCSVFile,
  setSelectedXLSXFile,
  setShowAddModal,
  setActiveTab
}) => {
  if (!selectedCSVFile && !selectedXLSXFile) {
    alert('Please select a CSV or XLSX file to import.');
    return;
  }

  if (selectedCSVFile) {
    try {
      const text = await selectedCSVFile.text();
      const parsedRows = parseCSV(text); // array of objects keyed by header
      const baseId = getNextIdStart(list);

      const newItems = [];
      let skipped = 0;
      const errors = [];

      for (let i = 0; i < parsedRows.length; i++) {
        const parsed = parsedRows[i];
        const mapped = mapRow(parsed || {});
        const candidate = { ...mapped, id: baseId + newItems.length };

        if (typeof validateRow === 'function') {
          const validation = await Promise.resolve(validateRow(candidate, { existing: list, newItems }));
          if (!validation || !validation.valid) {
            skipped++;
            errors.push({ rowIndex: i + 1, parsed, mapped: candidate, errors: validation?.errors || 'invalid' });
            continue;
          }
        }

        newItems.push(candidate);
      }

      if (newItems.length > 0) {
        setList(prev => [...prev, ...newItems]);
      }

      if (typeof setSelectedCSVFile === 'function') setSelectedCSVFile(null);
      if (typeof setSelectedXLSXFile === 'function') setSelectedXLSXFile(null);
      if (typeof setShowAddModal === 'function') setShowAddModal(false);
      if (typeof setActiveTab === 'function') setActiveTab('manual');

      if (onFinish) onFinish({ addedCount: newItems.length, skippedCount: skipped, errors });

      if (errors.length > 0) {
        const summary = errors.map(e => `Row ${e.rowIndex}: ${JSON.stringify(e.errors)}`).join('\n');
        alert(`Import finished — added: ${newItems.length}, skipped: ${skipped}\n\nDetails:\n${summary}\n(See console for full diagnostics.)`);
        console.log('importFromCSV diagnostics:', errors);
      } else {
        alert(`Import finished — added: ${newItems.length}, skipped: ${parsedRows.length - newItems.length}`);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to read CSV file.');
    }
    return;
  }

  if (selectedXLSXFile) {
    alert('XLSX import selected. To parse XLSX files client-side, install "xlsx" (SheetJS) and implement parsing.');
    return;
  }
};
