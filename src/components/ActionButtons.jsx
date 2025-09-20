const ActionButtons = ({ handleClearAll, setIsModalOpen, setIsSettingsModalOpen }) => {
  return (
    <div className="text-center">
      <button
        className="bg-[#6C757D] text-white border-none px-6 py-2.5 rounded-lg font-semibold text-base hover:-translate-y-0.5 transition-transform"
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
      <button
        className="bg-[#6f42c1] text-white border-none px-6 py-2.5 rounded-lg font-semibold text-base hover:-translate-y-0.5 transition-transform ml-2"
        onClick={() => setIsSettingsModalOpen(true)}
      >
        ⚙️ Settings
      </button>
    </div>
  );
};

export default ActionButtons;