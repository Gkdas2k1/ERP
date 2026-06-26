import { useState, useEffect } from 'react';
import api from '../services/api';

export default function Accounting() {
  const [activeTab, setActiveTab] = useState('coa');
  const [accounts, setAccounts] = useState<any[]>([]);
  const [entries, setEntries] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    if (activeTab === 'coa') api.get('/api/accounting/accounts').then(res => setAccounts(res.data)).catch(() => {});
    if (activeTab === 'entries') api.get('/api/accounting/journal-entries').then(res => setEntries(res.data)).catch(() => {});
    if (activeTab === 'logs') api.get('/api/accounting/audit-logs').then(res => setLogs(res.data)).catch(() => {});
  }, [activeTab]);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Accounting & Auditing</h2>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'coa', name: 'Chart of Accounts' },
            { id: 'entries', name: 'Journal Entries' },
            { id: 'logs', name: 'Audit Trail' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {activeTab === 'coa' && (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {accounts.map(acc => (
                <tr key={acc.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{acc.code}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{acc.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{acc.type}</td>
                </tr>
              ))}
              {accounts.length === 0 && <tr><td colSpan={3} className="px-6 py-4 text-center text-gray-500">No accounts found. (Add via Swagger UI for now)</td></tr>}
            </tbody>
          </table>
        )}

        {activeTab === 'entries' && (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reference</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {entries.map(entry => (
                <tr key={entry.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(entry.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{entry.reference}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${entry.is_posted ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {entry.is_posted ? 'Posted' : 'Draft'}
                    </span>
                  </td>
                </tr>
              ))}
              {entries.length === 0 && <tr><td colSpan={4} className="px-6 py-4 text-center text-gray-500">No journal entries yet.</td></tr>}
            </tbody>
          </table>
        )}

        {activeTab === 'logs' && (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Table</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Record ID</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {logs.map(log => (
                <tr key={log.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{log.action}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.table_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-xs">{log.record_id}</td>
                </tr>
              ))}
              {logs.length === 0 && <tr><td colSpan={4} className="px-6 py-4 text-center text-gray-500">No audit logs yet.</td></tr>}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}