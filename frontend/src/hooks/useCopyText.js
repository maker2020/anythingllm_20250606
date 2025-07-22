import { useState } from "react";

export default function useCopyText(delay = 2500) {
  const [copied, setCopied] = useState(false);
  const copyText = async (content) => {
    if (!content) return;
    try {
      await navigator.clipboard.writeText(content);
    } catch (e) {
      // fallback for HTTP or unsupported browsers
      const textarea = document.createElement("textarea");
      textarea.value = content;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopied(content);
    setTimeout(() => {
      setCopied(false);
    }, delay);
  };

  return { copyText, copied };
}
