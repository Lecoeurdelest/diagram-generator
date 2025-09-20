const TopActionButtons = ({ handleOpenLink, handleDownload, currentDiagramUrl }) => {
  return (
    <div className="flex gap-2 ml-auto">
      <button
        className={`bg-white border border-[#DEE2E6] rounded-lg px-3 py-1.5 text-sm text-[#495057] hover:border-[#7B68EE] ${!currentDiagramUrl ? 'bg-[#E9ECEF] text-[#ADB5BD] cursor-not-allowed' : ''}`}
        onClick={handleOpenLink}
        disabled={!currentDiagramUrl}
      >
        ↗️ Preview
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
};

export default TopActionButtons;