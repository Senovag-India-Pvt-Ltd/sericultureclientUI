import { useState } from "react";
import { Icon } from "../../components";

/** Small copy-to-clipboard button. withText shows "Copy" / "Copied" next to the icon. */
function CopyButton({ value, className = "ss-copy", withText = true }) {
  const [copied, setCopied] = useState(false);
  if (!value) return null;
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      /* clipboard not available: the value is visible to copy by hand */
    }
  };
  return (
    <button type="button" className={className} onClick={copy} aria-label={`Copy ${value}`} title={copied ? "Copied" : "Copy"}>
      <Icon name={copied ? "check" : "copy"} />{withText ? (copied ? " Copied" : " Copy") : null}
    </button>
  );
}

export default CopyButton;
