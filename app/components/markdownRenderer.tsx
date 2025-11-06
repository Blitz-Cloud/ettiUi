import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  dracula,
  solarizedlight,
  nightOwl,
} from "react-syntax-highlighter/dist/cjs/styles/prism";
import { useTheme } from "~/context/themeManager";
import { solarizedLight } from "react-syntax-highlighter/dist/esm/styles/hljs";
interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const { theme } = useTheme();
  const [colorScheme, setColorScheme] = useState();
  useEffect(() => {
    if (theme == "light") {
      setColorScheme(solarizedLight);
    } else if (theme == "dark") {
      setColorScheme(nightOwl);
    }
  }, [theme]);
  return (
    <ReactMarkdown
      remarkPlugins={[remarkMath]}
      rehypePlugins={[rehypeKatex]}
      components={{
        code(props: any) {
          const { children, className, node, ...rest } = props;
          const match = /language-(\w+)/.exec(className || "");
          return match ? (
            <SyntaxHighlighter
              {...rest}
              PreTag="div"
              children={String(children).replace(/\n$/, "")}
              language={match[1]}
              style={colorScheme}
            />
          ) : (
            <code {...rest} className={className}>
              {children}
            </code>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;
