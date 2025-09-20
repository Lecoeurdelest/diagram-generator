import { useState, useEffect, useRef } from 'react';
import pako from 'pako';
import { apiProviders } from '../public/llm-config.js';
import DiagramTypeSelector from './components/DiagramTypeSelector.jsx';
import DiagramInput from './components/DiagramInput.jsx';
import ActionButtons from './components/ActionButtons.jsx';
import TopActionButtons from './components/TopActionButtons.jsx';
import LlmModal from './components/LlmModal.jsx';
import SettingsModal from './components/SettingsModal.jsx';
import './index.css';

const encodeDiagram = (diagramSource) => {
  const textData = new TextEncoder().encode(diagramSource);
  const compressed = pako.deflate(textData, { level: 9 });
  const binaryString = Array.from(compressed).reduce(
    (str, byte) => str + String.fromCharCode(byte), ''
  );
  return btoa(binaryString).replace(/\+/g, '-').replace(/\//g, '_');
};

const getUrl = () => localStorage.getItem('serverUrl') || 'https://kroki.io';

function App() {
  const [diagramType, setDiagramType] = useState('mermaid');
  const [diagramSource, setDiagramSource] = useState('');
  const [currentDiagramUrl, setCurrentDiagramUrl] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [llmInput, setLlmInput] = useState('');
  const [isLlmLoading, setIsLlmLoading] = useState(false);
  const selectWrapperRef = useRef(null);

  const handleCompress = () => {
    if (!diagramSource.trim()) {
      alert('Vui lòng nhập mã diagram trước khi mở link.');
      return;
    }
    try {
      const encodedData = encodeDiagram(diagramSource);
      const newUrl = `${getUrl()}/${diagramType}/svg/${encodedData}`;
      setCurrentDiagramUrl(newUrl);
      if (typeof window.chrome !== 'undefined' && window.chrome.tabs) {
        chrome.tabs.create({ url: newUrl });
      } else {
        window.open(newUrl, '_blank');
      }
    } catch (error) {
      alert(`Lỗi khi mã hóa: ${error.message}`);
    }
  };

  const handleDownload = () => {
    if (!diagramSource.trim()) {
      alert('Vui lòng nhập mã diagram trước khi tải.');
      return;
    }
    try {
      const encodedData = encodeDiagram(diagramSource);
      let newUrl = `${getUrl()}/${diagramType}/svg/${encodedData}`;
      const imageWidth = localStorage.getItem('imageWidth') || '800';
      const imageHeight = localStorage.getItem('imageHeight') || '600';
      newUrl += `?width=${imageWidth}&height=${imageHeight}`;
      setCurrentDiagramUrl(newUrl);
      if (typeof window.chrome !== 'undefined' && window.chrome.downloads) {
        chrome.downloads.download({
          url: newUrl,
          filename: `${diagramType}-diagram.svg`,
          saveAs: true
        }, (downloadId) => {
          if (chrome.runtime.lastError) {
            console.error("Download failed:", chrome.runtime.lastError.message);
            alert('Không thể tải file. Vui lòng kiểm tra console của extension.');
          }
        });
      } else {
        const link = document.createElement('a');
        link.href = newUrl;
        link.download = `${diagramType}-diagram.svg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      alert(`Lỗi khi mã hóa: ${error.message}`);
    }
  };

  const handleClearAll = () => {
    setDiagramSource('');
    setCurrentDiagramUrl('');
  };

  const handleSubmitLlm = async () => {
    if (!llmInput.trim()) return;
    setIsLlmLoading(true);
    try {
      const resultSource = await apiProviders.gemini(llmInput, diagramType);
      setDiagramSource(resultSource);
      setIsModalOpen(false);
      setLlmInput('');
    } catch (error) {
      alert(`Có lỗi xảy ra: ${error.message}`);
    } finally {
      setIsLlmLoading(false);
    }
  };

  useEffect(() => {
    if (diagramSource.trim()) {
      try {
        const encodedData = encodeDiagram(diagramSource);
        const imageWidth = localStorage.getItem('imageWidth') || '800';
        const imageHeight = localStorage.getItem('imageHeight') || '600';
        const newUrl = `${getUrl()}/${diagramType}/svg/${encodedData}?width=${imageWidth}&height=${imageHeight}`;
        setCurrentDiagramUrl(newUrl);
      } catch (error) {
        alert(`Lỗi khi mã hóa: ${error.message}`);
      }
    } else {
      setCurrentDiagramUrl('');
    }
  }, [diagramSource, diagramType]);

  useEffect(() => {
    const handleKeydown = (e) => {
      if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault();
        handleCompress();
      }
    };
    document.addEventListener('keydown', handleKeydown);
    return () => document.removeEventListener('keydown', handleKeydown);
  }, [diagramSource, diagramType]);

  return (
    <div className="bg-[#7B68EE] w-[580px] min-h-[400px] p-6 font-sans box-border relative">
      <div className="w-full">
        <h1 className="text-white text-center mb-5 text-3xl font-bold">🔧 Hmmmmnm Diagram Generator</h1>
        <div className="bg-[#F8F9FA] rounded-2xl p-5 mb-5 flex flex-col min-h-[250px]">
          <div className="flex justify-between items-baseline mb-4">
            <DiagramTypeSelector
              diagramType={diagramType}
              setDiagramType={setDiagramType}
              selectWrapperRef={selectWrapperRef}
            />
            <TopActionButtons
              handleOpenLink={handleCompress}
              handleDownload={handleDownload}
              currentDiagramUrl={currentDiagramUrl}
            />
          </div>
          <DiagramInput
            diagramSource={diagramSource}
            setDiagramSource={setDiagramSource}
          />
        </div>
        <ActionButtons
          handleClearAll={handleClearAll}
          setIsModalOpen={setIsModalOpen}
          setIsSettingsModalOpen={setIsSettingsModalOpen}
        />
        <LlmModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          llmInput={llmInput}
          setLlmInput={setLlmInput}
          handleSubmitLlm={handleSubmitLlm}
          isLlmLoading={isLlmLoading}
        />
        <SettingsModal
          isSettingsModalOpen={isSettingsModalOpen}
          setIsSettingsModalOpen={setIsSettingsModalOpen}
        />
      </div>
    </div>
  );
}

export default App;