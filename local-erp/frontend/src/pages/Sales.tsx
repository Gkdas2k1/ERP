import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { FileText } from 'lucide-react';

export default function Sales() {
  const [invoices, setInvoices] = useState<any[]>([]);

  useEffect(() => {
    api.get('/api/sales/invoices').then(res => setInvoices(res.data)).catch(err => console.error(err));
  }, []);

  const downloadPDF = (invoiceId: string) => {
    // We use axios with responseType 'blob' to download the file
    api.get(`/api/sales/invoices/${invoiceId}/pdf`, { responseType: 'blob' })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Invoice_${invoiceId}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch(err => console.error("PDF Download failed", err));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Sales & Invoicing</h2>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice #</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {invoices.map(inv => (
              <tr key={inv.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{inv.number}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{inv.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-bold">${inv.total_amount}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button 
                    onClick={() => downloadPDF(inv.id)}
                    className="flex items-center text-blue-600 hover:text-blue-800"
                  >
                    <FileText size={16} className="mr-1" /> Download PDF
                  </button>
                </td>
              </tr>
            ))}
            {invoices.length === 0 && (
              <tr><td colSpan={4} className="px-6 py-4 text-center text-gray-500">No invoices yet. (Use Swagger UI to POST a test invoice for now)</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}