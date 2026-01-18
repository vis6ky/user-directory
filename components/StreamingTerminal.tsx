
import React, { useState, useEffect, useRef } from 'react';
import { ApiGateway } from '../services/apiGateway';

interface StreamingTerminalProps {
  onClose: () => void;
}

const StreamingTerminal: React.FC<StreamingTerminalProps> = ({ onClose }) => {
  const [displayText, setDisplayText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const textBuffer = useRef<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [displayText]);

  const startStream = async () => {
    setDisplayText('');
    setIsStreaming(true);
    setIsFinished(false);
    textBuffer.current = [];
    setProgress(0);

    const response = ApiGateway.getStream();
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) return;

    const typeCharacter = () => {
      if (textBuffer.current.length > 0) {
        const nextChar = textBuffer.current.shift();
        setDisplayText(prev => prev + nextChar);
      }
      animationRef.current = requestAnimationFrame(typeCharacter);
    };
    animationRef.current = requestAnimationFrame(typeCharacter);

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        textBuffer.current.push(...chunk.split(''));
        setProgress(prev => Math.min(prev + 3, 99));
      }
    } catch (err) {
      console.error("Stream error:", err);
    } finally {
      const checkBuffer = setInterval(() => {
        if (textBuffer.current.length === 0) {
          setIsStreaming(false);
          setIsFinished(true);
          setProgress(100);
          if (animationRef.current) cancelAnimationFrame(animationRef.current);
          clearInterval(checkBuffer);
        }
      }, 100);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10 bg-gray-900/80 backdrop-blur-sm">
      <div className="bg-[#1e1e1e] w-full max-w-4xl h-[80vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-white/10">
        <div className="bg-[#2d2d2d] px-6 py-4 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-4">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>
            <span className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest ml-2">
              Node.Stream.Service
            </span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div ref={scrollRef} className="flex-1 p-6 font-mono text-sm overflow-y-auto custom-scrollbar text-indigo-300">
          {displayText ? (
            <div className="whitespace-pre-wrap leading-relaxed">
              <span className="text-green-400 mr-2">$ fetch /api/stream</span>
              {displayText}
              {isStreaming && <span className="inline-block w-2 h-4 bg-indigo-500 animate-pulse ml-1"></span>}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 opacity-50 text-center">
              <p>Node.js endpoint ready. Initiate stream?</p>
            </div>
          )}
        </div>

        <div className="bg-[#181818] px-6 py-4 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <button 
            onClick={startStream}
            disabled={isStreaming}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-bold transition-all disabled:opacity-30"
          >
            {isStreaming ? 'Receiving...' : 'Start Stream'}
          </button>
          <div className="flex items-center gap-3">
            <div className="w-32 h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 transition-all duration-300" style={{ width: `${progress}%` }}></div>
            </div>
            <span className="text-[10px] font-bold text-gray-500 font-mono">{progress}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreamingTerminal;
