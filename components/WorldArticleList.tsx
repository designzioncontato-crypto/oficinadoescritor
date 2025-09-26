
import React, { useState } from 'react';
import type { World, Article } from '../types';
import { PlusIcon, TrashIcon, EditIcon } from './icons';
import { PageContainer, PageHeader, Button, Card, EmptyState, Select } from './ui';

interface WorldArticleListProps {
    selectedWorld: World;
    setWorlds: React.Dispatch<React.SetStateAction<World[]>>;
    onSelectArticle: (article: Partial<Article>) => void;
    onViewArticle: (article: Article) => void;
    onBack: () => void;
    onViewDescription: () => void;
}

const WorldArticleList: React.FC<WorldArticleListProps> = ({ selectedWorld, setWorlds, onSelectArticle, onViewArticle, onBack, onViewDescription }) => {
    const [categoryFilter, setCategoryFilter] = useState('');
    const articles = selectedWorld.articles || [];

    const deleteArticle = (articleId: number) => {
        setWorlds(p => p.map(w => w.id === selectedWorld.id ? { ...w, articles: w.articles.filter(a => a.id !== articleId) } : w));
    };
    
    const categories = [...new Set(articles.map(a => a.category).filter(Boolean))].sort();
    const filteredArticles = articles.filter(a => !categoryFilter || a.category === categoryFilter);

    return (
        <PageContainer>
            <PageHeader
                backLink={<button onClick={onBack} className="text-sm text-amber-400 hover:underline">&larr; Voltar para Mundos</button>}
                title={<div className="flex items-center gap-4">{selectedWorld.name} <button onClick={onViewDescription} className="text-sm font-normal text-amber-400 hover:underline">(Sobre o mundo)</button></div>}
                actions={
                    <>
                        <Select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="min-w-48">
                            <option value="">Todas as Categorias</option>
                            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </Select>
                        <Button onClick={() => onSelectArticle({})}>
                            <PlusIcon/> Novo Artigo
                        </Button>
                    </>
                }
            />
            {articles.length === 0 ? (
                <EmptyState
                    title={`Nenhum artigo de mundo criado ainda para ${selectedWorld.name}.`}
                    // FIX: Changed to single quotes to avoid JSX parsing issues with escaped double quotes.
                    subtitle='Clique em "Novo Artigo" para começar a catalogar seu universo.'
                />
            ) : filteredArticles.length === 0 ? (
                 <EmptyState title="Nenhum artigo encontrado para a categoria selecionada."/>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredArticles.sort((a,b)=>(a.title||'').localeCompare(b.title||'')).map(article => (
                        <Card key={article.id} color={article.color}>
                            <div className="p-5 flex-grow cursor-pointer" onClick={() => onViewArticle(article)}>
                                <span className="text-xs bg-gray-600 text-gray-300 px-2 py-0.5 rounded-full">{article.category || 'Sem Categoria'}</span>
                                <h3 className="mt-2 text-xl font-bold text-gray-100 truncate">{article.title || "Artigo Sem Título"}</h3>
                                <div className="text-gray-400 mt-2 h-16 overflow-hidden text-ellipsis prose prose-invert max-w-none prose-p:my-1" dangerouslySetInnerHTML={{__html: article.content || "Nenhuma descrição."}}></div>
                            </div>
                            <div className="bg-gray-700/50 p-3 flex justify-end gap-2 border-t border-gray-600/50">
                                <Button variant="secondary" onClick={() => onSelectArticle(article)}><EditIcon/></Button>
                                <Button variant="secondary" onClick={() => deleteArticle(article.id)} className="hover:bg-red-800/50 hover:text-red-300"><TrashIcon/></Button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </PageContainer>
    );
};

export default WorldArticleList;