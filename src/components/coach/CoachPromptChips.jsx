const DEFAULT_PROMPTS = [
  "How can I improve my match for this job?",
  "Rewrite my CV for this role",
  "What projects should I build?",
  "What interview questions should I expect?",
  "Am I ready to apply?",
  "What should I learn first?",
];

function CoachPromptChips({ prompts = DEFAULT_PROMPTS, onSelect, disabled = false }) {
  return (
    <div className="flex flex-wrap gap-2">
      {prompts.map((prompt) => (
        <button
          key={prompt}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(prompt)}
          className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {prompt}
        </button>
      ))}
    </div>
  );
}

export default CoachPromptChips;
