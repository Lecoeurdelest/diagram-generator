const LlmModal = ({ isModalOpen, setIsModalOpen, llmInput, setLlmInput, handleSubmitLlm, isLlmLoading }) => {
  if (!isModalOpen) return null;

  return (
    <div
      className="absolute inset-0 bg-[#F8F9FA]/80 flex justify-center items-center z-[1000] rounded-2xl backdrop-blur-sm"
      onClick={() => setIsModalOpen(false)}
    >
      <div
        className="bg-white p-6 rounded-2xl w-[90%] max-w-[500px] shadow-xl border border-[#ddd] transform transition-transform"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-2.5 right-3.5 text-3xl text-[#aaa] bg-none border-none cursor-pointer"
          onClick={() => setIsModalOpen(false)}
        >
          &times;
        </button>
        <label className="text-[#333] font-semibold block mb-2.5">Nhập yêu cầu của bạn cho AI:</label>
        <textarea
          className="w-full p-2.5 rounded-lg border border-[#ccc] text-base font-sans resize-y box-border"
          rows="6"
          placeholder="Ví dụ: tạo một sơ đồ mermaid về quy trình đăng nhập người dùng"
          value={llmInput}
          onChange={(e) => setLlmInput(e.target.value)}
        />
        <button
          className={`block mx-auto mt-3.5 px-6 py-2.5 rounded-lg text-white font-semibold text-base ${isLlmLoading ? 'bg-[#6c757d] cursor-not-allowed' : 'bg-[#0D6EFD]'}`}
          onClick={handleSubmitLlm}
          disabled={isLlmLoading}
        >
          {isLlmLoading ? 'Đang xử lý...' : 'Gửi yêu cầu'}
        </button>
      </div>
    </div>
  );
}

export default LlmModal;