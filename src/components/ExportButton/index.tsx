/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { FormSubmission } from '@/payload-types';
import React from 'react';
import './index.scss'
import { Download } from 'lucide-react';

function convertToCSV(objArray: Record<string, any>[]) {
  const headers = Object.keys(objArray[0]);
  const rows = objArray.map(obj => headers.map(header => obj[header] || ''));
  const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\r\n');
  return csvContent;
}

function exportCSVFile(items: any[], fileTitle: string) {
  const csv = convertToCSV(items);
  const exportedFilename = `${fileTitle}.csv` || 'export.csv';

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', exportedFilename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export const ExportButton: React.FC = () => {
  const getFormSubmissions = async () => {
    try {
      const response = await fetch('/api/form-submissions?limit=3000');
      if (!response.ok) {
        throw new Error('Failed to fetch form submissions');
      }
      const data = (await response.json()) as { docs: FormSubmission[] };
      return data.docs;
    } catch (error) {
      console.error(error);
      alert('Error fetching form submissions');
      return [];
    }
  };

  const handleClick = async () => {
    const submissions = await getFormSubmissions();
  
    const headersSet = new Set<string>();
    const processedDocs = submissions.map(doc => {
      const customData = doc.customData || [];
      customData.forEach(item => {
        headersSet.add(item.label);
      });

      const customDataObject = customData.reduce<Record<string, any>>((acc, curr) => {
        acc[curr.label] = curr.value;
        return acc;
      }, {});

      const formattedDate = new Intl.DateTimeFormat('en-US').format(new Date(doc.createdAt));
  
      return {
        entryTime: formattedDate,
        url: doc.url,
        ...customDataObject,
      };
    });  
    exportCSVFile(processedDocs, 'payload_export_formsubmissions');
  };

  return (
    <div className='export-btn-wrapper gutter--left gutter--right'>
        <button onClick={handleClick} type="button" className='export-btn'>
            <Download width='20' height='20' />
            <span className='export-text'>Export Submissions</span>
        </button>
    </div>
  );
};