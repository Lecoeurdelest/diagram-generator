import { useState, useEffect } from 'react';

const SettingsModal = ({ isSettingsModalOpen, setIsSettingsModalOpen }) => {
  const [imageWidth, setImageWidth] = useState(localStorage.getItem('imageWidth') || '800');
  const [imageHeight, setImageHeight] = useState(localStorage.getItem('imageHeight') || '600');
  const [apiKey, setApiKey] = useState(localStorage.getItem('apiKey') || '');
  const [serverUrl, setServerUrl] = useState(localStorage.getItem('serverUrl') || 'https://kroki.io');
  const [provider, setProvider] = useState(localStorage.getItem('provider') || 'gemini');
  const [model, setModel] = useState(localStorage.getItem('model') || 'gemini-1.5-flash-latest');

  const models = {
    gemini: ['gemini-1.5-flash-latest', 'gemini-1.5-pro-latest'],
    openai: ['gpt-4o', 'gpt-3.5-turbo']
  };

  const handleSave = () => {
    localStorage.setItem('imageWidth', imageWidth);
    localStorage.setItem('imageHeight', imageHeight);
    localStorage.setItem('apiKey', apiKey);
    localStorage.setItem('serverUrl', serverUrl);
    localStorage.setItem('provider', provider);
    localStorage.setItem('model', model);
    setIsSettingsModalOpen(false);
  };

  const handleClose = () => {
    setIsSettingsModalOpen(false);
    setImageWidth(localStorage.getItem('imageWidth') || '800');
    setImageHeight(localStorage.getItem('imageHeight') || '600');
    setApiKey(localStorage.getItem('apiKey') || '');
    setServerUrl(localStorage.getItem('serverUrl') || 'https://kroki.io');
    setProvider(localStorage.getItem('provider') || 'gemini');
    setModel(localStorage.getItem('model') || 'gemini-1.5-flash-latest');
  };

  const handleProviderChange = (e) => {
    const newProvider = e.target.value;
    setProvider(newProvider);
    // Đặt model mặc định cho provider mới
    setModel(newProvider === 'gemini' ? 'gemini-1.5-flash-latest' : 'gpt-4o');
  };

  if (!isSettingsModalOpen) return null;

  return (
    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[90%] max-w-[500px] shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Cài đặt</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Chiều rộng ảnh (px)</label>
          <input
            type="number"
            value={imageWidth}
            onChange={(e) => setImageWidth(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            min="100"
            max="2000"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Chiều cao ảnh (px)</label>
          <input
            type="number"
            value={imageHeight}
            onChange={(e) => setImageHeight(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            min="100"
            max="2000"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">API Key</label>
          <input
            type="text"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            placeholder={provider === 'gemini' ? 'Nhập API key của Gemini' : 'Nhập API key của Open AI'}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Server URL</label>
          <input
            type="text"
            value={serverUrl}
            onChange={(e) => setServerUrl(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            placeholder="Nhập URL server (ví dụ: https://kroki.io)"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">API Provider</label>
          <select
            value={provider}
            onChange={handleProviderChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          >
            <option value="gemini">Gemini</option>
            <option value="openai">Open AI</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Model</label>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          >
            {models[provider].map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
        <div className="flex justify-end gap-2">
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
            onClick={handleClose}
          >
            Hủy
          </button>
          <button
            className="bg-[#6f42c1] text-white px-4 py-2 rounded-md hover:bg-purple-700"
            onClick={handleSave}
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;