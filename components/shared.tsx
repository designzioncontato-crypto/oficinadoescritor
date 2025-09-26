

import React from 'react';
import type { CustomData, World, Article, Character } from '../types';
import { PlusIcon, TrashIcon } from './icons';
import { Button, IconButton, Input, Select, Textarea } from './ui';

interface ColorPickerProps {
    selectedColor: string;
    onChange: (color: string) => void;
}
export const ColorPicker: React.FC<ColorPickerProps> = ({ selectedColor, onChange }) => {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Cor do Card</label>
            <div className="flex items-center gap-3">
                <input
                    type="color"
                    value={selectedColor || '#4A5568'}
                    onChange={(e) => onChange(e.target.value)}
                    className="p-0 h-10 w-14 bg-transparent border border-gray-600 rounded-md cursor-pointer"
                />
                 <span className="px-3 py-1 bg-gray-800 rounded-md text-sm font-mono">{selectedColor || '#4A5568'}</span>
            </div>
        </div>
    );
};

interface CustomFieldsEditorProps {
    customData: CustomData;
    onUpdate: (data: CustomData) => void;
}
export const CustomFieldsEditor: React.FC<CustomFieldsEditorProps> = ({ customData, onUpdate }) => {
    const data = customData || { title: 'Campos Personalizados', sections: [] };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onUpdate({ ...data, title: e.target.value });
    };

    const handleSectionTitleChange = (sectionId: number, newTitle: string) => {
        const newSections = data.sections.map(s => s.id === sectionId ? { ...s, title: newTitle } : s);
        onUpdate({ ...data, sections: newSections });
    };

    const handleFieldChange = (sectionId: number, fieldId: number, key: 'title' | 'value', value: string) => {
        const newSections = data.sections.map(s => s.id === sectionId ? { ...s, fields: s.fields.map(f => f.id === fieldId ? { ...f, [key]: value } : f) } : { ...s });
        onUpdate({ ...data, sections: newSections });
    };

    const addSection = () => {
        const newSections = [...data.sections, { id: Date.now(), title: "Nova Secção", fields: [] }];
        onUpdate({ ...data, sections: newSections });
    };
    
    const deleteSection = (sectionId: number) => {
        const newSections = data.sections.filter(s => s.id !== sectionId);
        onUpdate({ ...data, sections: newSections });
    };
    
    const addField = (sectionId: number) => {
        const newSections = data.sections.map(s => s.id === sectionId ? { ...s, fields: [...s.fields, { id: Date.now(), title: "Novo Campo", value: "" }] } : s);
        onUpdate({ ...data, sections: newSections });
    };
    
    const deleteField = (sectionId: number, fieldId: number) => {
        const newSections = data.sections.map(s => s.id === sectionId ? { ...s, fields: s.fields.filter(f => f.id !== fieldId) } : s);
        onUpdate({ ...data, sections: newSections });
    };

    return (
        <div className="bg-gray-700 p-6 rounded-lg space-y-6">
            <input
                type="text"
                value={data.title}
                onChange={handleTitleChange}
                className="w-full bg-transparent text-xl font-semibold text-amber-400 border-b border-gray-600 focus:border-amber-500 focus:ring-0 p-0 outline-none"
            />
            <div className="space-y-6">
                {data.sections.map(section => (
                    <div key={section.id} className="bg-gray-800/50 p-4 rounded-md">
                        <div className="flex justify-between items-center mb-4">
                            <input
                                type="text"
                                value={section.title}
                                onChange={(e) => handleSectionTitleChange(section.id, e.target.value)}
                                className="w-full bg-transparent text-lg font-bold border-none focus:ring-0 p-0 outline-none"
                            />
                            <IconButton type="button" onClick={() => deleteSection(section.id)} className="text-gray-500 hover:text-red-500"><TrashIcon/></IconButton>
                        </div>
                        <div className="space-y-4">
                            {section.fields.map(field => (
                                <div key={field.id} className="relative border-t border-gray-700 pt-4">
                                    <Input
                                        type="text"
                                        value={field.title}
                                        onChange={(e) => handleFieldChange(section.id, field.id, 'title', e.target.value)}
                                        placeholder="Título do Campo"
                                        className="font-semibold mb-2"
                                    />
                                    <Textarea
                                        value={field.value}
                                        onChange={(e) => handleFieldChange(section.id, field.id, 'value', e.target.value)}
                                        placeholder="Conteúdo do Campo"
                                    />
                                    <IconButton type="button" onClick={() => deleteField(section.id, field.id)} className="absolute top-4 right-1 text-gray-500 hover:text-red-500">
                                        <TrashIcon/>
                                    </IconButton>
                                </div>
                            ))}
                        </div>
                        <button type="button" onClick={() => addField(section.id)} className="flex items-center gap-1 text-sm text-amber-400 hover:text-amber-300 mt-4">
                            <PlusIcon/> Adicionar Campo
                        </button>
                    </div>
                ))}
            </div>
            <Button type="button" onClick={addSection} variant="secondary">
                <PlusIcon/> Adicionar Secção
            </Button>
        </div>
    );
};

interface CustomFieldsViewerProps {
    customData?: CustomData;
    allArticles: Article[];
    onNavigate: (article: Article) => void;
}
export const CustomFieldsViewer: React.FC<CustomFieldsViewerProps> = ({ customData, allArticles, onNavigate }) => {
    if (!customData || !customData.sections || customData.sections.length === 0) return null;
    
    const handleContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const target = e.target as HTMLElement;
        if (target.dataset.navigateTo) {
            const targetId = parseInt(target.dataset.navigateTo, 10);
            const targetArticle = allArticles.find(a => a.id === targetId);
            if (targetArticle) onNavigate(targetArticle);
        }
    };
    
     const parseAndRenderContent = (content: string) => {
        if (!content) return { __html: "" };
        const regex = /\[\[(.*?)\]\]/g;
        return { __html: content.replace(regex, (match, articleTitle) => {
            const targetArticle = allArticles.find(a => a.title.toLowerCase() === articleTitle.toLowerCase());
            if (targetArticle) {
                return `<button data-navigate-to="${targetArticle.id}" class="text-amber-400 underline bg-transparent border-none cursor-pointer hover:text-amber-300">${articleTitle}</button>`;
            }
            return `<span class="text-red-400">[[${articleTitle}]]</span>`;
        })};
    };

    return (
        <div className="mt-8 space-y-6">
            {customData.sections.map(section => (
                <div key={section.id} className="bg-gray-700 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-600 text-amber-400">{section.title}</h3>
                    <div className="space-y-4">
                        {section.fields.map(field => (
                            <div key={field.id}>
                                <h4 className="font-bold text-gray-200">{field.title}</h4>
                                <div 
                                  className="text-gray-100 prose prose-invert max-w-none prose-p:my-1 prose-headings:my-2 whitespace-pre-wrap"
                                  onClick={handleContentClick}
                                  dangerouslySetInnerHTML={parseAndRenderContent(field.value)}
                                ></div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};


interface RelatedArticlesSelectorProps {
    allArticles: Article[];
    currentArticleId?: number;
    relatedIds: number[];
    onUpdate: (ids: number[]) => void;
}
export const RelatedArticlesSelector: React.FC<RelatedArticlesSelectorProps> = ({ allArticles, currentArticleId, relatedIds, onUpdate }) => {
    const availableArticles = allArticles.filter(a => a.id !== currentArticleId && !relatedIds.includes(a.id));
    const relatedArticles = allArticles.filter(a => relatedIds.includes(a.id));

    const handleAdd = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const articleId = parseInt(e.target.value, 10);
        if (articleId) {
            onUpdate([...relatedIds, articleId]);
            e.target.value = "";
        }
    };

    const handleRemove = (articleId: number) => onUpdate(relatedIds.filter(id => id !== articleId));

    return (
        <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Artigos Relacionados</label>
            <div className="flex flex-col gap-2 mb-2">
                {relatedArticles.map(article => (
                    <div key={article.id} className="flex items-center justify-between bg-gray-800 px-3 py-2 rounded-md">
                        <span>{article.title}</span>
                        <IconButton type="button" onClick={() => handleRemove(article.id)} className="text-gray-500 hover:text-red-500" size="xs">
                            <TrashIcon/>
                        </IconButton>
                    </div>
                ))}
            </div>
            {availableArticles.length > 0 && (
                <Select onChange={handleAdd} defaultValue="">
                    <option value="" disabled>Adicionar um artigo relacionado...</option>
                    {availableArticles.map(article => (
                        <option key={article.id} value={article.id}>{article.title}</option>
                    ))}
                </Select>
            )}
        </div>
    );
};

interface RelatedCharactersSelectorProps {
    allCharacters: Character[];
    relatedIds: number[];
    onUpdate: (ids: number[]) => void;
}
export const RelatedCharactersSelector: React.FC<RelatedCharactersSelectorProps> = ({ allCharacters, relatedIds, onUpdate }) => {
    const availableCharacters = allCharacters.filter(c => !relatedIds.includes(c.id));
    const relatedCharacters = allCharacters.filter(c => relatedIds.includes(c.id));

    const handleAdd = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const charId = parseInt(e.target.value, 10);
        if (charId) {
            onUpdate([...relatedIds, charId]);
            e.target.value = "";
        }
    };

    const handleRemove = (charId: number) => onUpdate(relatedIds.filter(id => id !== charId));

    return (
        <div className="mt-4">
            <label className="block text-sm font-medium text-gray-400 mb-2">Personagens Relacionados</label>
            <div className="flex flex-col gap-2 mb-2">
                {relatedCharacters.map(char => (
                    <div key={char.id} className="flex items-center justify-between bg-gray-800 px-3 py-2 rounded-md">
                        <span>{char.name}</span>
                        <IconButton type="button" onClick={() => handleRemove(char.id)} className="text-gray-500 hover:text-red-500" size="xs">
                            <TrashIcon/>
                        </IconButton>
                    </div>
                ))}
            </div>
            {availableCharacters.length > 0 && (
                <Select onChange={handleAdd} defaultValue="">
                    <option value="" disabled>Adicionar um personagem relacionado...</option>
                    {availableCharacters.map(char => (
                        <option key={char.id} value={char.id}>{char.name}</option>
                    ))}
                </Select>
            )}
        </div>
    );
};

interface GlobalArticleSelectorProps {
    worlds: World[];
    relatedIds: number[];
    onUpdate: (ids: number[]) => void;
}
export const GlobalArticleSelector: React.FC<GlobalArticleSelectorProps> = ({ worlds, relatedIds, onUpdate }) => {
    const allArticles = worlds.flatMap(w => w.articles || []);
    const relatedArticles = allArticles.filter(a => relatedIds.includes(a.id));
    const availableWorlds = worlds.filter(w => w.articles?.some(a => !relatedIds.includes(a.id)));

    const handleAdd = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const articleId = parseInt(e.target.value, 10);
        if (articleId) {
            onUpdate([...relatedIds, articleId]);
            e.target.value = "";
        }
    };

    const handleRemove = (articleId: number) => onUpdate(relatedIds.filter(id => id !== articleId));

    return (
         <div>
            <h3 className="text-lg font-semibold mb-2">Conexões Globais</h3>
            <label className="block text-sm font-medium text-gray-400 mb-2">Artigos Relacionados de Outros Mundos</label>
            <div className="flex flex-col gap-2 mb-2">
                {relatedArticles.map(article => {
                    const world = worlds.find(w => w.id === article.worldId);
                    return (
                        <div key={article.id} className="flex items-center justify-between bg-gray-800 px-3 py-2 rounded-md">
                            <span>{article.title} <span className="text-xs text-gray-500">({world?.name || 'Mundo Desconhecido'})</span></span>
                            <IconButton type="button" onClick={() => handleRemove(article.id)} className="text-gray-500 hover:text-red-500" size="xs">
                                <TrashIcon/>
                            </IconButton>
                        </div>
                    );
                })}
            </div>
            {availableWorlds.length > 0 && (
                 <Select onChange={handleAdd} defaultValue="">
                    <option value="" disabled>Adicionar um artigo relacionado...</option>
                    {availableWorlds.map(world => (
                        <optgroup key={world.id} label={world.name}>
                            {(world.articles || []).filter(a => !relatedIds.includes(a.id)).map(article => (
                                <option key={article.id} value={article.id}>{article.title}</option>
                            ))}
                        </optgroup>
                    ))}
                </Select>
            )}
        </div>
    );
};