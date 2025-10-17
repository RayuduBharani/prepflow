'use client'
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Minus,
  Plus,
  Terminal,
  Code,
  RotateCcw,
} from 'lucide-react';
import LanguageSelector from './LanguageSelector';
import { useFontSizeStore } from '@/store/compilerStore';

export default function MobileHeader({
    hasInputCalls,
    activeTab,
    setActiveTab,
    output,
    error,
    showInputBox,
    resetCode
}: { 
    hasInputCalls: boolean,
    isDarkMode: boolean,
    setIsDarkMode: (value: boolean) => void,
    activeTab: 'code' | 'console',
    setActiveTab: (tab: 'code' | 'console') => void,
    output?: string,
    error?: string,
    showInputBox?: boolean,
    setShowInputBox?: (value: boolean) => void,
    setOutput?: (value: string) => void,
    setError?: (value: string) => void,
    setShowConsole?: (value: boolean) => void,
    resetCode?: () => void,
}) {

  const {fontSize, setFontSize} = useFontSizeStore()
  return (
    <div className="bg-background border-b p-2">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <LanguageSelector />
              {hasInputCalls && (
                <div className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                  Needs Input
                </div>
              )}
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="outline"
                size="sm"
                onClick={resetCode}
                className="h-7 w-7 p-0"
                aria-label="Reset code"
              >
                <RotateCcw className="h-3 w-3" />
              </Button>
              <div className="flex items-center space-x-1 border rounded">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFontSize(Math.max(14, fontSize - 1))}
                  className="h-7 w-7 p-0"
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="text-xs px-1 min-w-[20px] text-center">{fontSize}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFontSize(Math.min(24, fontSize + 1))}
                  className="h-7 w-7 p-0"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile Tab Navigation */}
          <div className="flex space-x-1">
            <Button
              variant={activeTab === 'code' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('code')}
              className="flex-1"
            >
              <Code className="h-4 w-4 mr-1" />
              Code
            </Button>
            <Button
              variant={activeTab === 'console' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('console')}
              className="flex-1"
            >
              <Terminal className="h-4 w-4 mr-1" />
              Console
              {(output || error || showInputBox) && (
                <div className="w-2 h-2 bg-green-500 rounded-full ml-1" />
              )}
            </Button>
          </div>
        </div>
  )
}
