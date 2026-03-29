import { useState } from 'react';
import type { GeneratedPrompt } from '@/types';
import { formatPromptsAsText, copyToClipboard, downloadAsTextFile } from '@/lib/formatPrompt';

interface ShareButtonsProps {
  prompts: GeneratedPrompt[];
}

export default function ShareButtons({ prompts }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(formatPromptsAsText(prompts));
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    const filename = `selah-prompts-${new Date().toISOString().slice(0, 10)}.txt`;
    downloadAsTextFile(formatPromptsAsText(prompts), filename);
  };

  return (
    <div className="flex gap-3 justify-center">
      <button
        onClick={handleCopy}
        className="
          flex items-center gap-1.5 px-4 py-2 rounded-lg
          font-sans text-sm text-olive-600 bg-parchment-100
          hover:bg-parchment-200 transition-colors
        "
      >
        <span>📋</span>
        <span>{copied ? 'Copied!' : 'Copy All'}</span>
      </button>
      <button
        onClick={handleDownload}
        className="
          flex items-center gap-1.5 px-4 py-2 rounded-lg
          font-sans text-sm text-olive-600 bg-parchment-100
          hover:bg-parchment-200 transition-colors
        "
      >
        <span>⬇</span>
        <span>Download</span>
      </button>
    </div>
  );
}
