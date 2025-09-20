const DiagramInput = ({ diagramSource, setDiagramSource }) => {
  return (
    <>
      <label className="text-[#6c757d] font-semibold text-sm mb-2">📝 Diagram Source:</label>
      <textarea
        className="flex-grow w-full bg-white border border-[#DEE2E6] rounded-lg p-3 font-mono text-sm resize-none focus:outline-none focus:border-[#7B68EE] focus:ring-2 focus:ring-[#7B68EE]/20"
        value={diagramSource}
        onChange={(e) => setDiagramSource(e.target.value)}
      />
    </>
  );
}

export default DiagramInput;