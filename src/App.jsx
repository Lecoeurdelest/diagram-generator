import { useState, useEffect, useRef } from 'react';
import pako from 'pako';
import { apiProviders } from '../public/llm-config.js';
import DiagramTypeSelector from './components/DiagramTypeSelector.jsx';
import DiagramInput from './components/DiagramInput.jsx';
import ActionButtons from './components/ActionButtons.jsx';
import TopActionButtons from './components/TopActionButtons.jsx';
import LlmModal from './components/LlmModal.jsx';
import './index.css';

const encodeDiagram = (diagramSource) => {
  const textData = new TextEncoder().encode(diagramSource);
  const compressed = pako.deflate(textData, { level: 9 });
  const binaryString = Array.from(compressed).reduce(
    (str, byte) => str + String.fromCharCode(byte), ''
  );
  return btoa(binaryString).replace(/\+/g, '-').replace(/\//g, '_');
};

const getUrl = () => 'https://kroki.io';

function App() {
  const [diagramType, setDiagramType] = useState('mermaid');
  const [diagramSource, setDiagramSource] = useState('');
  const [currentDiagramUrl, setCurrentDiagramUrl] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [llmInput, setLlmInput] = useState('');
  const [isLlmLoading, setIsLlmLoading] = useState(false);
  const selectWrapperRef = useRef(null);

  const handleCompress = () => {
    if (!diagramSource.trim()) return;
    try {
      const encodedData = encodeDiagram(diagramSource);
      const newUrl = `${getUrl()}/${diagramType}/svg/${encodedData}`;
      setCurrentDiagramUrl(newUrl);
    } catch (error) {
      alert(`Lỗi khi nén: ${error.message}`);
    }
  };

  const handleClearAll = () => {
    setDiagramSource('');
    setCurrentDiagramUrl('');
  };

  const handleOpenLink = () => {
    if (currentDiagramUrl) {
      if (typeof window.chrome !== 'undefined' && window.chrome.tabs) {
        chrome.tabs.create({ url: currentDiagramUrl });
      } else {
        window.open(currentDiagramUrl, '_blank');
      }
    }
  };

  const handleDownload = () => {
    if (!currentDiagramUrl) return;
    if (typeof window.chrome !== 'undefined' && window.chrome.downloads) {
      chrome.downloads.download({
        url: currentDiagramUrl,
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
      link.href = currentDiagramUrl;
      link.download = `${diagramType}-diagram.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
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
      handleCompress();
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
  }, []);

  return (
    <div className="bg-[#7B68EE] w-[580px] min-h-[400px] p-6 font-sans box-border">
      <div className="w-full relative">
        <h1 className="text-white text-center mb-5 text-3xl font-bold">🔧 Hmmmmnm Diagram Generator</h1>
        <div className="bg-[#F8F9FA] rounded-2xl p-5 mb-5 flex flex-col min-h-[250px]">
          <div className="flex justify-between items-baseline mb-4">
            <DiagramTypeSelector
              diagramType={diagramType}
              setDiagramType={setDiagramType}
              selectWrapperRef={selectWrapperRef}
            />
            <TopActionButtons
              handleOpenLink={handleOpenLink}
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
          handleCompress={handleCompress}
          handleClearAll={handleClearAll}
          setIsModalOpen={setIsModalOpen}
        />
        <LlmModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          llmInput={llmInput}
          setLlmInput={setLlmInput}
          handleSubmitLlm={handleSubmitLlm}
          isLlmLoading={isLlmLoading}
        />
      </div>
    </div>
  );
}

export default App;