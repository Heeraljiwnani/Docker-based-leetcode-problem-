import React, { useEffect, useRef, useState } from 'react';

interface CodeEditorProps {
  value: string;
  language: string; // e.g. 'ts', 'js', 'py', 'cpp', 'java'
  onChange: (value: string | undefined) => void;
  readOnly?: boolean;
}

// Map short language keys from dropdown to standard Monaco language identifiers
export const getMonacoLanguage = (langKey: string): string => {
  const map: Record<string, string> = {
    ts: 'typescript',
    js: 'javascript',
    py: 'python',
    py3: 'python',
    cpp: 'cpp',
    c: 'cpp',
    java: 'java',
    cs: 'csharp',
    go: 'go',
    kt: 'kotlin',
    swift: 'swift',
    rust: 'rust',
    rb: 'ruby',
    php: 'php',
    dart: 'dart',
    scala: 'scala',
    ex: 'elixir',
    erl: 'erlang',
    rkt: 'scheme',
  };
  return map[langKey.toLowerCase()] || 'plaintext';
};

declare global {
  interface Window {
    require?: any;
    monaco?: any;
  }
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  language,
  onChange,
  readOnly = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorInstanceRef = useRef<any>(null);
  const [isMonacoLoaded, setIsMonacoLoaded] = useState<boolean>(false);

  // Initialize Monaco Editor via CDN loader
  useEffect(() => {
    let isSubscribed = true;

    const initMonaco = () => {
      if (!window.require) return;

      window.require.config({
        paths: {
          vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs',
        },
      });

      window.require(['vs/editor/editor.main'], () => {
        if (!isSubscribed || !containerRef.current) return;

        const monaco = window.monaco;

        // Register custom VS Code matching theme
        monaco.editor.defineTheme('codearena-vs-dark', {
          base: 'vs-dark',
          inherit: true,
          rules: [
            // Keywords (int, string, float, class, def, function, const, let, public, static, etc.)
            { token: 'keyword', foreground: '569cd6', fontStyle: 'bold' },
            { token: 'keyword.control', foreground: 'c586c0', fontStyle: 'bold' },
            { token: 'keyword.operator', foreground: '569cd6' },
            { token: 'storage', foreground: '569cd6' },
            { token: 'storage.type', foreground: '569cd6' },

            // Data types & Class identifiers (int, string, float, bool, custom types)
            { token: 'type', foreground: '4ec9b0' },
            { token: 'type.identifier', foreground: '4ec9b0' },
            { token: 'entity.name.type', foreground: '4ec9b0' },
            { token: 'entity.name.class', foreground: '4ec9b0' },

            // Variable & Identifier names
            { token: 'identifier', foreground: '9cdcfe' },
            { token: 'variable', foreground: '9cdcfe' },

            // Function & Method names
            { token: 'function', foreground: 'dcdcaa' },
            { token: 'entity.name.function', foreground: 'dcdcaa' },

            // Strings & Escapes
            { token: 'string', foreground: 'ce9178' },
            { token: 'string.escape', foreground: 'd7ba7d' },

            // Comments (italicized green)
            { token: 'comment', foreground: '6a9955', fontStyle: 'italic' },

            // Numbers & Constants
            { token: 'number', foreground: 'b5cea8' },
            { token: 'constant', foreground: '4fc1ff' },
          ],
          colors: {
            'editor.background': '#0a0a0a',
            'editor.foreground': '#d4d4d4',
            'editor.lineHighlightBackground': '#1c1c1c',
            'editorLineNumber.foreground': '#555555',
            'editorLineNumber.activeForeground': '#84cc16',
            'editorCursor.foreground': '#84cc16',
            'editor.selectionBackground': '#84cc1633',
            'editorWidget.background': '#1c1c1c',
            'editorWidget.border': '#2e2e2e',
          },
        });

        // Clean existing instance if re-initializing
        if (editorInstanceRef.current) {
          editorInstanceRef.current.dispose();
        }

        const editor = monaco.editor.create(containerRef.current, {
          value: value,
          language: getMonacoLanguage(language),
          theme: 'codearena-vs-dark',
          readOnly,
          fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
          fontSize: 13,
          lineHeight: 20,
          fontLigatures: true,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          smoothScrolling: true,
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
          padding: { top: 12, bottom: 12 },
          automaticLayout: true,
          formatOnType: true,
          tabSize: 4,
          wordWrap: 'on',
        });

        editor.onDidChangeModelContent(() => {
          onChange(editor.getValue());
        });

        editorInstanceRef.current = editor;
        setIsMonacoLoaded(true);
      });
    };

    // Load Monaco CDN script if not present
    if (!window.monaco) {
      const existingScript = document.getElementById('monaco-cdn-script');
      if (!existingScript) {
        const script = document.createElement('script');
        script.id = 'monaco-cdn-script';
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs/loader.min.js';
        script.async = true;
        script.onload = () => {
          initMonaco();
        };
        script.onerror = () => {
          setIsMonacoLoaded(false);
        };
        document.body.appendChild(script);
      } else {
        existingScript.addEventListener('load', initMonaco);
      }
    } else {
      initMonaco();
    }

    return () => {
      isSubscribed = false;
      if (editorInstanceRef.current) {
        editorInstanceRef.current.dispose();
      }
    };
  }, []);

  // Update Monaco language mode dynamically
  useEffect(() => {
    if (editorInstanceRef.current && window.monaco) {
      const model = editorInstanceRef.current.getModel();
      if (model) {
        window.monaco.editor.setModelLanguage(model, getMonacoLanguage(language));
      }
    }
  }, [language]);

  // Sync value changes if set externally
  useEffect(() => {
    if (editorInstanceRef.current) {
      if (editorInstanceRef.current.getValue() !== value) {
        editorInstanceRef.current.setValue(value);
      }
    }
  }, [value]);

  return (
    <div className="w-full h-full relative" style={{ backgroundColor: '#0a0a0a' }}>
      {/* Monaco Container */}
      <div ref={containerRef} className="w-full h-full" />

      {/* Fallback Textarea while CDN is loading or if offline */}
      {!isMonacoLoaded && (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
          readOnly={readOnly}
          className="absolute inset-0 w-full h-full bg-[#0a0a0a] text-slate-100 p-3 font-mono text-xs resize-none focus:outline-none leading-relaxed selection:bg-[#84cc16]/30 selection:text-[#a3e635]"
          placeholder="Code editor loading..."
        />
      )}
    </div>
  );
};

export default CodeEditor;
