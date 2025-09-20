const ActionButtons = ({ handleCompress, handleClearAll, handleOpenLink, handleDownload, currentDiagramUrl, setIsModalOpen, renderTopButtons }) => {
  if (renderTopButtons) {
    return (
      <div className="flex gap-2 ml-auto">
        <button
          className={`bg-white border border-[#DEE2E6] rounded-lg px-3 py-1.5 text-sm text-[#495057] hover:border-[#7B68EE] ${!currentDiagramUrl ? 'bg-[#E9ECEF] text-[#ADB5BD] cursor-not-allowed' : ''}`}
          onClick={handleOpenLink}
          disabled={!currentDiagramUrl}
        >
          ↗️ Mở Link
        </button>
        <button
          className={`bg-white border border-[#DEE2E6] rounded-lg px-3 py-1.5 text-sm text-[#495057] hover:border-[#7B68EE] ${!currentDiagramUrl ? 'bg-[#E9ECEF] text-[#ADB5BD] cursor-not-allowed' : ''}`}
          onClick={handleDownload}
          disabled={!currentDiagramUrl}
        >
          📥 Tải SVG
        </button>
      </div>
    );
  }

  return (
    <div className="text-center">
      <button
        className="bg-[#0D6EFD] text-white border-none px-6 py-2.5 rounded-lg font-semibold text-base hover:-translate-y-0.5 transition-transform"
        onClick={handleCompress}
      >
        🚀 Encode
      </button>
      <button
        className="bg-[#6C757D] text-white border-none px-6 py-2.5 rounded-lg font-semibold text-base hover:-translate-y-0.5 transition-transform ml-2"
        onClick={handleClearAll}
      >
        🗑️ Clear All
      </button>
      <button
        className="bg-[#6A5ACD] text-white border-none px-6 py-2.5 rounded-lg font-semibold text-base hover:-translate-y-0.5 transition-transform ml-2"
        onClick={() => setIsModalOpen(true)}
      >
        ❓ Hỏi LLM
      </button>
    </div>
  );
};

export default ActionButtons;