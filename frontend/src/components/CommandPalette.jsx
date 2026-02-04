import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

const CommandPalette = ({ isOpen, onClose, commands }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  
  const filteredCommands = commands.filter(command => 
    command.name.toLowerCase().includes(query.toLowerCase())
  );
  
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    }
  }, [isOpen]);
 
  const handleKeyDown = (e) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prevIndex => 
          prevIndex < filteredCommands.length - 1 ? prevIndex + 1 : prevIndex
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prevIndex => 
          prevIndex > 0 ? prevIndex - 1 : prevIndex
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action();
          onClose();
        }
        break;
      case 'Escape':
        e.preventDefault();
        onClose();
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (listRef.current && listRef.current.children[selectedIndex]) {
      listRef.current.children[selectedIndex].scrollIntoView({
        block: 'nearest',
      });
    }
  }, [selectedIndex]);
  
  if (!isOpen) return null;
  
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={(e) => {
                e.stopPropagation(); 
                onClose();
              }}
            />
            
            <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="inline-block w-full max-w-lg transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow-xl transition-all sm:my-8 sm:align-middle"
            >
              <div className="w-full">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    ref={inputRef}
                    type="text"
                    className="block w-full border-0 bg-transparent py-4 pl-10 pr-4 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-0 text-lg"
                    placeholder="Search commands..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                </div>
                
                <div className="border-t border-gray-200 dark:border-gray-700">
                  <ul 
                    ref={listRef}
                    className="max-h-80 overflow-y-auto py-2 text-sm"
                  >
                    {filteredCommands.length === 0 ? (
                      <li className="px-4 py-3 text-gray-500 dark:text-gray-400 text-center">
                        No commands found
                      </li>
                    ) : (
                      filteredCommands.map((command, index) => (
                        <li
                          key={command.id}
                          className={`px-4 py-3 cursor-pointer flex items-center ${
                            index === selectedIndex
                              ? 'bg-indigo-50 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200'
                              : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                          onClick={() => {
                            command.action();
                            onClose();
                          }}
                          onMouseEnter={() => setSelectedIndex(index)}
                        >
                          <span className="flex-1">{command.name}</span>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
                
                <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-2 text-xs text-gray-500 dark:text-gray-400 flex items-center justify-between">
                  <div>
                    <span className="mr-3">
                      <span className="font-semibold">↑↓</span> to navigate
                    </span>
                    <span className="mr-3">
                      <span className="font-semibold">Enter</span> to select
                    </span>
                    <span>
                      <span className="font-semibold">Esc</span> to close
                    </span>
                  </div>
                  <div>
                    <kbd className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded">⌘K</kbd>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default CommandPalette;