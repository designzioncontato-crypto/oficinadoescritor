

import React from 'react';
import type { ViewingArticle, Article, Character } from '../types';
import { EditIcon } from './icons';
import { PageContainer, PageHeader, Button } from './ui';
import { CustomFieldsViewer } from './shared';

interface ArticleViewerProps {
    article: ViewingArticle;
    allArticles: Article[];
    allCharacters: Character[];
    onNavigate: (article: Article) => void;
    onNavigateToCharacter: (character: Character) => void;
    onBack: () => void;
    onEdit: (article: Article) => void;
}

const ArticleViewer: React.FC<ArticleViewerProps> = ({ article, allArticles, allCharacters, onNavigate, onNavigateToCharacter, onBack, onEdit }) => {
    
    const handleContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const target = e.target as HTMLElement;
        if (target.dataset.navigateTo) {
            const targetId = parseInt(target.dataset.navigateTo, 10);
            const targetArticle = allArticles.find(a => a.id === targetId);
            if (targetArticle) onNavigate(targetArticle);
        }
    };

    const parseAndRenderContent = (content: string) => {
        if (!content) return { __html: "<p>Este artigo ainda não possui conteúdo.</p>" };
        const regex = /\[\[(.*?)\]\]/g;
        return { __html: content.replace(regex, (match, title) => {
            const target = allArticles.find(a => a.title.toLowerCase() === title.toLowerCase());
            return target ? `<button data-navigate-to="${target.id}" class="text-amber-400 underline bg-transparent border-none cursor-pointer hover:text-amber-300">${title}</button>` : `<span class="text-red-400">[[${title}]]</span>`;
        })};
    };

    const hasRelatedArticles = article.relatedArticleIds && article.relatedArticleIds.length > 0;
    const hasRelatedCharacters = article.relatedCharacterIds && article.relatedCharacterIds.length > 0;

    return (
        <PageContainer>
            <PageHeader
                backLink={<button onClick={onBack} className="text-sm text-amber-400 hover:underline">&larr; Voltar para {article.worldName}</button>}
                title={<>{article.title} <span className="ml-2 text-sm font-normal align-middle bg-gray-700 text-gray-300 px-3 py-1 rounded-full">{article.category || 'Sem Categoria'}</span></>}
                actions={<Button onClick={() => onEdit(article)} variant="secondary"><EditIcon/> Editar</Button>}
            />
            
            <div className="mt-6 bg-gray-700 p-6 rounded-lg prose prose-invert max-w-none whitespace-pre-wrap" onClick={handleContentClick} dangerouslySetInnerHTML={parseAndRenderContent(article.content)}></div>
            
            <CustomFieldsViewer customData={article.customData} allArticles={allArticles} onNavigate={onNavigate} />

            {(hasRelatedArticles || hasRelatedCharacters) && (
                <div className="mt-8 space-y-6">
                    {hasRelatedArticles && (
                        <div>
                            <h3 className="text-xl font-semibold mb-4 text-amber-400">Artigos Relacionados</h3>
                            <div className="flex flex-wrap gap-3">
                                {allArticles.filter(a => article.relatedArticleIds.includes(a.id)).map(related => (
                                    <button key={related.id} onClick={() => onNavigate(related)} className="bg-amber-900/50 text-amber-300 px-3 py-1 rounded-full text-sm hover:bg-amber-800/50 transition-colors">
                                        {related.title}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                     {hasRelatedCharacters && (
                        <div>
                            <h3 className="text-xl font-semibold mb-4 text-amber-400">Personagens Relacionados</h3>
                            <div className="flex flex-wrap gap-3">
                                {allCharacters.filter(c => article.relatedCharacterIds.includes(c.id)).map(related => (
                                    <button key={related.id} onClick={() => onNavigateToCharacter(related)} className="bg-purple-900/50 text-purple-300 px-3 py-1 rounded-full text-sm hover:bg-purple-800/50 transition-colors">
                                        {related.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </PageContainer>
    );
};

export default ArticleViewer;