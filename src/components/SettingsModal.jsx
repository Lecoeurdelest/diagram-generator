import { useState, useEffect } from 'react';

const SettingsModal = ({ isSettingsModalOpen, setIsSettingsModalOpen }) => {
  const [imageWidth, setImageWidth] = useState(localStorage.getItem('imageWidth') || '800');
  const [imageHeight, setImageHeight] = useState(localStorage.getItem('imageHeight') || '600');
  const [apiKey, setApiKey] = useState(localStorage.getItem('apiKey') || '');

  const handleSave = () => {
    localStorage.setItem('imageWidth', imageWidth);
    localStorage.setItem('imageHeight', imageHeight);
    localStorage.setItem('apiKey', apiKey);
    setIsSettingsModalOpen(false);
  };

  const handleClose = () => {
    setIsSettingsModalOpen(false);
    setImageWidth(localStorage.getItem('imageWidth') || '800');
    setImageHeight(localStorage.getItem('imageHeight') || '600');
    setApiKey(localStorage.getItem('apiKey') || '');
  };

  if (!isSettingsModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[400px] shadow-lg">
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
          <label className="block text-sm font-medium text-gray-700">API Key (Gemini)</label>
          <input
            type="text"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            placeholder="Nhập API key của Gemini"
          />
        </div>
        <div className="flex justify-end gap-2">
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
            onClick={handleClose}
          >
            Hủy
          </button>
          <button
            className="bg-[#28A745] text-white px-4 py-2 rounded-md hover:bg-green-600"
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