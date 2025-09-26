import React, { useState, useEffect } from 'react';
import type { Chapter } from '../types';
import { Button } from './ui';

interface ChapterEditorProps {
    chapter: Chapter;
    onSave: (chapter: Chapter) => void;
    onBack: () => void;
}

const ChapterEditor: React.FC<ChapterEditorProps> = ({ chapter, onSave, onBack }) => {
    const [editedChapter, setEditedChapter] = useState(chapter);

    useEffect(() => {
        setEditedChapter(chapter);
    }, [chapter]);

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditedChapter(prev => ({ ...prev, title: e.target.value }));
    };
    
    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setEditedChapter(prev => ({ ...prev, content: e.target.value }));
    };

    const handleSaveAndClose = () => {
        onSave(editedChapter);
        onBack();
    };

    const wordCount = editedChapter.content ? editedChapter.content.trim().split(/\s+/).filter(Boolean).length : 0;

    return (
        <div className="h-full w-full flex flex-col bg-gray-700">
            <header className="bg-gray-900 py-3 px-4 flex items-center justify-between gap-4 flex-shrink-0 shadow-md z-10">
                <span className="text-gray-400 text-sm whitespace-nowrap">{wordCount} palavras</span>
                <Button onClick={handleSaveAndClose}>
                    Salvar e Fechar
                </Button>
            </header>
            <div className="flex-grow overflow-y-auto py-8 px-4">
                <div className="w-full max-w-4xl min-h-[calc(100vh-150px)] mx-auto p-12 sm:p-16 md:p-24 shadow-2xl bg-white text-gray-900 rounded-sm flex flex-col">
                    <input
                        type="text"
                        value={editedChapter.title || ''}
                        onChange={handleTitleChange}
                        placeholder="Título do Capítulo"
                        className="w-full block text-center text-3xl md:text-4xl font-bold mb-12 border-none outline-none focus:ring-0 bg-transparent flex-shrink-0"
                    />
                    <textarea
                        className="flex-grow w-full border-none outline-none text-base font-serif leading-relaxed text-justify bg-transparent resize-none focus:ring-0"
                        value={editedChapter.content || ''}
                        onChange={handleContentChange}
                        placeholder="Comece a escrever..."
                    />
                </div>
            </div>
        </div>
    );
};

export default ChapterEditor;