'use client'
import React, { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Editor } from '@monaco-editor/react'
import { Minus, Plus, Play, Minimize, Maximize } from 'lucide-react'
import { useTheme } from 'next-themes'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"

interface DesktopCodeEditorProps {
    code: string;
    setCode: (code: string) => void;
    isDarkMode: boolean;
    setIsDarkMode: (value: boolean) => void;
    fontSize: number;
    setFontSize: (value: number) => void;
    handleRunCode: () => void;
    isRunning: boolean;
    isFullscreen: boolean;
    onToggleFullscreen: () => void;
}

export default function DesktopCodeEditor({
    code,
    setCode,
    fontSize,
    setFontSize,
    handleRunCode,
    isRunning,
    isFullscreen,
    onToggleFullscreen
}: DesktopCodeEditorProps) {
    const { resolvedTheme } = useTheme()

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.altKey && e.key === 'Enter') {
                e.preventDefault();
                if (!isRunning) {
                    handleRunCode();
                }
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [handleRunCode, isRunning]);

    return (
        <div className={`h-full ${isFullscreen ? 'py-0' : 'py-4'}`}>
            <Card className={`h-full bg-background ${isFullscreen ? 'shadow-none rounded-none' : 'shadow-sm rounded-lg'}`}>
                {/* Desktop File Tab */}
                <div className="flex items-center justify-between px-4 py-2 bg-background rounded-t-lg">
                    <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                            <div className="w-3 h-3 bg-red-500 rounded-full" />
                            <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                            <div className="w-3 h-3 bg-green-500 rounded-full" />
                        </div>
                        <div className="ml-4 text-sm font-medium text-muted-foreground">main.py</div>
                    </div>
                    <div className="flex items-center space-x-2 overflow-hidden">
                        <div className="flex items-center space-x-1">
                            <Button
                                onClick={onToggleFullscreen}
                                variant="default"
                                size="sm">
                                {isFullscreen ? <Minimize className="h-3 w-3" /> : <Maximize className="h-3 w-3" />}
                            </Button>
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => {
                                    setFontSize(Math.max(10, fontSize - 1))
                                    localStorage.setItem('fontSize', String(Math.max(10, fontSize - 1)))
                                }}
                            >
                                <Minus className="h-3 w-3" />
                            </Button>
                            <span className="text-sm px-2">{fontSize}</span>
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => {
                                    setFontSize(Math.min(24, fontSize + 1))
                                    localStorage.setItem('fontSize', String(Math.min(24, fontSize + 1)))
                                }}
                            >
                                <Plus className="h-3 w-3" />
                            </Button>
                        </div>
                        <Tooltip >
                            <TooltipTrigger asChild>
                                <Button
                                    onClick={handleRunCode}
                                    disabled={isRunning}
                                    size="sm"
                                >
                                    <Play className="h-4 w-4 mr-1" />
                                    Run
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent className='bg-foreground'>
                                <p className="text-sm">Alt/Option + Enter</p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                </div>
                {/* Code Editor Area - Desktop */}
                <CardContent className="flex-1 p-0 h-[calc(100%-60px)]">
                    <div className="h-full">
                        <Editor
                            height="90vh"
                            defaultLanguage="python"
                            value={code}
                            theme={resolvedTheme === 'dark' ? 'vs-dark' : 'light'}
                            options={{
                                fontSize: fontSize,
                                minimap: { enabled: false },
                                scrollBeyondLastLine: false,
                                wordWrap: 'on',

                                tabSize: 4,
                                insertSpaces: true,
                                parameterHints : {
                                    enabled: true,
                                },
                                autoIndent: 'full',
                                renderWhitespace: 'boundary',
                                renderControlCharacters: true,
                                folding: true,
                                foldingStrategy: 'auto',
                                cursorStyle: 'line',
                                cursorBlinking: 'smooth',
                                overviewRulerLanes: 3,
                                overviewRulerBorder: false,
                                quickSuggestionsDelay: 100,
                                quickSuggestions: {
                                    other: true,
                                    comments: true,
                                    strings: true,
                                },
                                autoClosingBrackets: 'languageDefined',
                                autoClosingQuotes: 'languageDefined',
                                autoClosingOvertype: 'auto',
                                autoSurround: 'languageDefined',
                                lineNumbers: 'on',
                                automaticLayout: true,
                                padding: { top: 16, bottom: 16 },
                                fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                                renderLineHighlight: 'gutter',
                                selectionHighlight: true,
                                contextmenu: true,
                                copyWithSyntaxHighlighting: true,
                                formatOnPaste: true,
                                formatOnType: true,
                                suggestOnTriggerCharacters: true,
                                suggestSelection: 'first',
                                acceptSuggestionOnEnter: 'on',
                                suggestFontSize: fontSize,
                            }}
                            onChange={(value) => setCode(value || '')}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
