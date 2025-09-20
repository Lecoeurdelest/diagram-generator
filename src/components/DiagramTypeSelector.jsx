import { useState, useEffect } from 'react';

const DiagramTypeSelector = ({ diagramType, setDiagramType, selectWrapperRef }) => {
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  const handleSelectType = (value) => {
    setDiagramType(value);
    setIsSelectOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectWrapperRef.current && !selectWrapperRef.current.contains(event.target)) {
        setIsSelectOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [selectWrapperRef]);

  return (
    <div className="flex justify-between items-baseline mb-4">
      <div className="flex items-baseline gap-2">
        <label className="text-[#6c757d] font-semibold text-sm">📊 Ngôn ngữ:</label>
        <div className="relative" ref={selectWrapperRef}>
          <button
            className="bg-white border border-[#DEE2E6] rounded-lg px-3 py-1.5 text-sm text-[#495057] flex items-center justify-between min-w-[140px] hover:border-[#7B68EE]"
            onClick={() => setIsSelectOpen(!isSelectOpen)}
          >
            <span>{diagramType === 'mermaid' ? 'Mermaid' : 'PlantUML'}</span>
            <svg
              className={`w-4 h-4 ml-2 text-[#6c757d] transition-transform ${isSelectOpen ? 'rotate-180' : ''}`}
              viewBox="0 0 1024 1024"
              fill="currentColor"
            >
              <path d="M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3.1-12.7-6.4-12.7z"/>
            </svg>
          </button>
          {isSelectOpen && (
            <div className="absolute top-full left-0 z-10 mt-1 bg-white border border-[#DEE2E6] rounded-lg shadow-lg w-full">
              <button
                className={`block w-full px-4 py-2 text-left text-sm ${diagramType === 'mermaid' ? 'bg-[#F8F9FA]' : ''}`}
                onClick={() => handleSelectType('mermaid')}
              >
                Mermaid
              </button>
              <button
                className={`block w-full px-4 py-2 text-left text-sm ${diagramType === 'plantuml' ? 'bg-[#F8F9FA]' : ''}`}
                onClick={() => handleSelectType('plantuml')}
              >
                PlantUML
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DiagramTypeSelector;