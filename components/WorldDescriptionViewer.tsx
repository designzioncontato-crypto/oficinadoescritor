

import React from 'react';
import type { World, Article } from '../types';
import { PageContainer, PageHeader } from './ui';
import { CustomFieldsViewer } from './shared';

interface WorldDescriptionViewerProps {
    world: World;
    allArticles: Article[];
    onNavigate: (article: Article) => void;
    onBack: () => void;
}

const WorldDescriptionViewer: React.FC<WorldDescriptionViewerProps> = ({ world, allArticles, onNavigate, onBack }) => {
    
    const handleContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const target = e.target as HTMLElement;
        if (target.dataset.navigateTo) {
            const targetId = parseInt(target.dataset.navigateTo, 10);
            const article = allArticles.find(a => a.id === targetId);
            if(article) onNavigate(article);
        }
    };
    
    const parseAndRenderContent = (content: string) => {
        if (!content) return { __html: "<p>Este mundo ainda não tem uma descrição.</p>" };
        const regex = /\[\[(.*?)\]\]/g;
        return { __html: content.replace(regex, (match, title) => {
            const target = allArticles.find(a => a.title.toLowerCase() === title.toLowerCase());
            return target ? `<button data-navigate-to="${target.id}" class="text-amber-400 underline bg-transparent border-none cursor-pointer hover:text-amber-300">${title}</button>` : `<span class="text-red-400">[[${title}]]</span>`;
        })};
    };

    return (
        <PageContainer>
            <PageHeader
                backLink={<button onClick={onBack} className="text-sm text-amber-400 hover:underline">&larr; Voltar para {world.name}</button>}
                title={<>{world.name} <span className="ml-2 text-base font-normal align-middle bg-gray-700 text-gray-300 px-3 py-1 rounded-full">Sobre o Mundo</span></>}
            />
            <div 
                className="mt-6 bg-gray-700 p-6 rounded-lg prose prose-invert max-w-none whitespace-pre-wrap" 
                onClick={handleContentClick} 
                dangerouslySetInnerHTML={parseAndRenderContent(world.description)}>
            </div>
             <CustomFieldsViewer customData={world.customData} allArticles={allArticles} onNavigate={onNavigate} />
        </PageContainer>
    );
};

export default WorldDescriptionViewer;