interface Props {
  html: string;
  className?: string;
}

export default function RichTextDisplay({ html, className = "" }: Props) {
  // Plain text (no HTML tags) — preserve newlines
  const isHtml = html.trim().startsWith("<");
  if (!isHtml) {
    return (
      <div className={`rich-text ${className}`} style={{ whiteSpace: "pre-wrap" }}>
        {html}
      </div>
    );
  }
  return (
    <div
      className={`rich-text ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
