import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { Chapter } from '../types';
import { Button } from './ui';
import { BoldIcon, ItalicIcon, AlignLeftIcon, AlignCenterIcon, AlignJustifyIcon } from './icons';

interface ChapterEditorProps {
    chapter: Chapter;
    onSave: (chapter: Chapter) => void;
    onBack: () => void;
}

const ChapterEditor: React.FC<ChapterEditorProps> = ({ chapter, onSave, onBack }) => {
    const [title, setTitle] = useState(chapter.title);
    const editorRef = useRef<HTMLDivElement>(null);
    const [wordCount, setWordCount] = useState(0);
    const [activeFormats, setActiveFormats] = useState({
        bold: false,
        italic: false,
        align: 'justifyLeft',
    });

    const checkActiveFormats = useCallback(() => {
        if (!editorRef.current) return;
        const isBold = document.queryCommandState('bold');
        const isItalic = document.queryCommandState('italic');
        const alignment = document.queryCommandValue('justify');
        
        let alignValue = 'justifyLeft'; // default
        if (alignment === 'center') alignValue = 'justifyCenter';
        else if (alignment === 'justify') alignValue = 'justifyFull';

        setActiveFormats({
            bold: isBold,
            italic: isItalic,
            align: alignValue,
        });
    }, []);
    
    useEffect(() => {
        setTitle(chapter.title);
        if (editorRef.current) {
            editorRef.current.innerHTML = chapter.content || '';
            const text = editorRef.current.textContent || '';
            setWordCount(text.trim() ? text.trim().split(/\s+/).filter(Boolean).length : 0);
            checkActiveFormats();
        }
    }, [chapter, checkActiveFormats]);

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    };

    const handleContentChange = (e: React.FormEvent<HTMLDivElement>) => {
        const text = e.currentTarget.textContent || '';
        setWordCount(text.trim() ? text.trim().split(/\s+/).filter(Boolean).length : 0);
    };

    const handleSaveAndClose = () => {
        const currentContent = editorRef.current?.innerHTML || '';
        onSave({ ...chapter, title: title || 'Sem Título', content: currentContent });
        onBack();
    };

    const applyFormat = (command: string) => {
        document.execCommand(command, false);
        editorRef.current?.focus();
        checkActiveFormats();
    };

    const FormatButton: React.FC<{ onClick: () => void, children: React.ReactNode, isActive: boolean }> = ({ onClick, children, isActive }) => (
        <button
            type="button"
            onMouseDown={(e) => e.preventDefault()} // Prevents the editor from losing focus
            onClick={onClick}
            className={`p-2 rounded transition-colors ${isActive ? 'bg-amber-600 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'}`}
        >
            {children}
        </button>
    );

    return (
        <div className="h-full w-full flex flex-col bg-gray-700">
            <header className="bg-gray-900 py-2 px-4 flex items-center justify-between gap-4 flex-shrink-0 shadow-md z-20">
                <div className="flex-1">
                    <span className="text-gray-400 text-sm whitespace-nowrap">{wordCount} {wordCount === 1 ? 'palavra' : 'palavras'}</span>
                </div>
                <div className="flex justify-center items-center gap-1 bg-gray-800 p-1 rounded-lg">
                    <FormatButton isActive={activeFormats.bold} onClick={() => applyFormat('bold')}><BoldIcon /></FormatButton>
                    <FormatButton isActive={activeFormats.italic} onClick={() => applyFormat('italic')}><ItalicIcon /></FormatButton>
                    <div className="w-px h-6 bg-gray-700 mx-2"></div>
                    <FormatButton isActive={activeFormats.align === 'justifyLeft'} onClick={() => applyFormat('justifyLeft')}><AlignLeftIcon /></FormatButton>
                    <FormatButton isActive={activeFormats.align === 'justifyCenter'} onClick={() => applyFormat('justifyCenter')}><AlignCenterIcon /></FormatButton>
                    <FormatButton isActive={activeFormats.align === 'justifyFull'} onClick={() => applyFormat('justifyFull')}><AlignJustifyIcon /></FormatButton>
                </div>
                <div className="flex-1 flex justify-end">
                    <Button onClick={handleSaveAndClose}>
                        Salvar e Fechar
                    </Button>
                </div>
            </header>
            <div className="flex-grow overflow-y-auto py-8 px-4">
                <div className="w-full max-w-4xl min-h-[calc(100vh-150px)] mx-auto shadow-2xl bg-white text-gray-900 rounded-sm flex flex-col">
                    <input
                        type="text"
                        value={title || ''}
                        onChange={handleTitleChange}
                        placeholder="Título do Capítulo"
                        className="w-full block text-center text-3xl md:text-4xl font-bold border-none outline-none focus:ring-0 bg-transparent flex-shrink-0 px-12 sm:px-16 md:px-24 pt-12 sm:pt-16 md:pt-24 mb-6"
                    />

                    <div className="relative flex-grow">
                        <div
                            ref={editorRef}
                            onInput={handleContentChange}
                            onKeyUp={checkActiveFormats}
                            onMouseUp={checkActiveFormats}
                            contentEditable={true}
                            suppressContentEditableWarning={true}
                            className="w-full h-full border-none outline-none text-base font-serif leading-relaxed focus:ring-0 px-12 sm:px-16 md:px-24 py-8"
                        />
                        {wordCount === 0 && (
                            <div
                                aria-hidden="true"
                                className="pointer-events-none absolute top-8 left-12 sm:left-16 md:left-24 text-gray-500 text-base font-serif leading-relaxed"
                            >
                                Comece a escrever...
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChapterEditor;