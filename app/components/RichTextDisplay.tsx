const EMOJI_FONT_STACK =
  "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Apple Color Emoji', 'Noto Color Emoji', system-ui, sans-serif";

interface Props {
  html: string;
  className?: string;
}

export default function RichTextDisplay({ html, className = "" }: Props) {
  const isHtml = html.trim().startsWith("<");
  if (!isHtml) {
    return (
      <div
        className={`rich-text ${className}`}
        style={{ whiteSpace: "pre-wrap", fontFamily: EMOJI_FONT_STACK }}
      >
        {html}
      </div>
    );
  }
  return (
    <div
      className={`rich-text ${className}`}
      style={{ fontFamily: EMOJI_FONT_STACK }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
