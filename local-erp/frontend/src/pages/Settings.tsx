import { useState, useEffect } from 'react';
import api from '../services/api';

export default function Settings() {
  const [companyName, setCompanyName] = useState('');
  const [address, setAddress] = useState('');
  const [taxId, setTaxId] = useState('');
  const [logo, setLogo] = useState<File | null>(null);
  const [watermark, setWatermark] = useState<File | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch existing settings on load
    api.get('/api/settings/').then((res) => {
      if (res.data) {
        setCompanyName(res.data.company_name || '');
        setAddress(res.data.address || '');
        setTaxId(res.data.tax_id || '');
      }
    }).catch(() => console.log('No settings found yet.'));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/api/settings/', { company_name: companyName, address, tax_id: taxId });
      
      if (logo) {
        const formData = new FormData();
        formData.append('file', logo);
        await api.post('/api/settings/logo', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      
      if (watermark) {
        const formData = new FormData();
        formData.append('file', watermark);
        await api.post('/api/settings/watermark', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      
      setMessage('Settings saved successfully!');
    } catch (error) {
      setMessage('Error saving settings.');
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Company Settings & Branding</h1>
      
      {message && <div className="mb-4 p-3 bg-green-100 text-green-800 rounded">{message}</div>}

      <form onSubmit={handleSave} className="space-y-6 bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Company Name</label>
            <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Tax ID</label>
            <input type="text" value={taxId} onChange={(e) => setTaxId(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Address</label>
          <textarea value={address} onChange={(e) => setAddress(e.target.value)} rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Upload Logo</label>
            <input type="file" accept="image/*" onChange={(e) => setLogo(e.target.files?.[0] || null)}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Upload Watermark</label>
            <input type="file" accept="image/*" onChange={(e) => setWatermark(e.target.files?.[0] || null)}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
          </div>
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 font-semibold">
          Save Settings
        </button>
      </form>
    </div>
  );
}