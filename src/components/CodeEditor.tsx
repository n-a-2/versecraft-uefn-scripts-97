
import React, { useState, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// Token types for syntax highlighting
type TokenType = 'keyword' | 'type' | 'function' | 'string' | 'variable' | 'comment' | 'number' | 'operator' | 'plain';

interface Token {
  type: TokenType;
  content: string;
}

interface CodeEditorProps {
  code: string;
  readOnly?: boolean;
  onChange?: (code: string) => void;
  className?: string;
  showLineNumbers?: boolean;
  highlightLines?: number[];
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  readOnly = true,
  onChange,
  className,
  showLineNumbers = true,
  highlightLines = [],
}) => {
  const [editorContent, setEditorContent] = useState(code);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setEditorContent(code);
  }, [code]);

  // Simple tokenizer for Verse syntax
  const tokenizeVerse = (code: string): Token[][] => {
    const lines = code.split('\n');
    const result: Token[][] = [];

    // Verse language keywords
    const keywords = [
      'using', 'import', 'class', 'struct', 'interface', 'enum', 'const', 'var', 'let', 
      'if', 'else', 'switch', 'case', 'default', 'for', 'while', 'do', 'break', 'continue', 
      'return', 'true', 'false', 'null', 'void', 'public', 'private', 'protected', 'static', 
      'override', 'abstract', 'virtual', 'extern', 'internal', 'readonly', 'new', 'this', 'base'
    ];

    const types = [
      'int', 'float', 'double', 'string', 'bool', 'array', 'map', 'vector2', 'vector3', 
      'rotation', 'color', 'player', 'agent', 'team', 'device', 'creative', 'gameplay',
      'tuple'
    ];

    lines.forEach(line => {
      const tokens: Token[] = [];
      let i = 0;

      // Process line until end
      while (i < line.length) {
        // Check for comments
        if (line.substring(i, i + 2) === '//') {
          tokens.push({ type: 'comment', content: line.substring(i) });
          break;
        }

        // Check for strings
        if (line[i] === '"' || line[i] === "'") {
          const quote = line[i];
          let j = i + 1;
          while (j < line.length && line[j] !== quote) j++;
          tokens.push({ type: 'string', content: line.substring(i, j + 1) });
          i = j + 1;
          continue;
        }

        // Check for numbers
        if (/^\d/.test(line[i])) {
          let j = i;
          while (j < line.length && /[\d.]/.test(line[j])) j++;
          tokens.push({ type: 'number', content: line.substring(i, j) });
          i = j;
          continue;
        }

        // Check for identifiers and keywords
        if (/^[a-zA-Z_]/.test(line[i])) {
          let j = i;
          while (j < line.length && /\w/.test(line[j])) j++;
          const word = line.substring(i, j);

          if (keywords.includes(word.toLowerCase())) {
            tokens.push({ type: 'keyword', content: word });
          } else if (types.includes(word.toLowerCase())) {
            tokens.push({ type: 'type', content: word });
          } else if (j < line.length && line[j] === '(') {
            tokens.push({ type: 'function', content: word });
          } else {
            tokens.push({ type: 'variable', content: word });
          }
          
          i = j;
          continue;
        }

        // Operators
        if (/^[+\-*\/=<>!&|^%:;,.(){}[\]]/.test(line[i])) {
          tokens.push({ type: 'operator', content: line[i] });
          i++;
          continue;
        }

        // Whitespace and other characters
        tokens.push({ type: 'plain', content: line[i] });
        i++;
      }

      result.push(tokens);
    });

    return result;
  };

  const tokens = tokenizeVerse(editorContent);

  const handleEditorChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setEditorContent(newContent);
    if (onChange) {
      onChange(newContent);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(editorContent);
    setCopied(true);
    toast.success("Code copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("relative rounded-md overflow-hidden", className)}>
      <div className="flex items-center justify-between p-2 bg-zinc-900 border-b border-zinc-800">
        <span className="text-xs text-zinc-400 font-mono">verse</span>
        <button
          onClick={handleCopy}
          className="text-zinc-400 hover:text-white transition-colors"
          aria-label="Copy code"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
        </button>
      </div>

      <ScrollArea className="relative max-h-96 code-scroll-area">
        {readOnly ? (
          <pre className="code-block font-mono text-sm overflow-x-auto bg-black">
            <div className="flex">
              {showLineNumbers && (
                <div className="text-zinc-500 pr-4 select-none text-right">
                  {tokens.map((_, i) => (
                    <div key={i} className="text-xs">{i + 1}</div>
                  ))}
                </div>
              )}
              <div className="flex-1">
                {tokens.map((lineTokens, lineIndex) => (
                  <div 
                    key={lineIndex} 
                    className={cn(
                      "text-xs", 
                      highlightLines.includes(lineIndex + 1) && "bg-zinc-800 -mx-2 px-2"
                    )}
                  >
                    {lineTokens.map((token, tokenIndex) => (
                      <span 
                        key={tokenIndex} 
                        className={cn({
                          'text-purple-400': token.type === 'keyword',
                          'text-blue-400': token.type === 'type',
                          'text-yellow-300': token.type === 'function',
                          'text-green-400': token.type === 'string',
                          'text-orange-300': token.type === 'variable',
                          'text-zinc-500': token.type === 'comment',
                          'text-amber-200': token.type === 'number',
                          'text-rose-300': token.type === 'operator',
                        })}
                      >
                        {token.content}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </pre>
        ) : (
          <div className="relative">
            <textarea
              value={editorContent}
              onChange={handleEditorChange}
              className="w-full h-full min-h-[200px] p-4 font-mono text-sm bg-black text-white resize-y outline-none"
            />
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default CodeEditor;
