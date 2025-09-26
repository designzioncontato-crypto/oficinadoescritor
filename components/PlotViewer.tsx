

import React from 'react';
import type { Plot, World, Article, Character } from '../types';
import { EditIcon } from './icons';
import { PageContainer, PageHeader, Button } from './ui';
import { CustomFieldsViewer } from './shared';

interface PlotViewerProps {
    plot: Plot;
    onBack: () => void;
    onEdit: (plot: Plot) => void;
    worlds: World[];
    allArticles: Article[];
    onNavigate: (article: Article) => void;
    allCharacters: Character[];
    onNavigateToCharacter: (character: Character) => void;
}

const ActViewer: React.FC<{label: string, value?: string}> = ({label, value}) => value ? (
    <div>
        <h4 className="font-bold text-gray-200">{label}</h4>
        <p className="text-gray-400 whitespace-pre-wrap">{value}</p>
    </div>
) : null;

const PlotViewer: React.FC<PlotViewerProps> = ({ plot, onBack, onEdit, worlds, allArticles, onNavigate, allCharacters, onNavigateToCharacter }) => {
    const world = plot.worldId ? worlds.find(w => w.id === plot.worldId) : null;
    const hasRelatedArticles = plot.relatedArticleIds && plot.relatedArticleIds.length > 0;
    const hasRelatedCharacters = plot.relatedCharacterIds && plot.relatedCharacterIds.length > 0;

    return (
        <PageContainer>
            <PageHeader
                backLink={<button onClick={onBack} className="text-sm text-amber-400 hover:underline">&larr; Voltar para Enredos</button>}
                title={<>{plot.title || "Enredo sem título"} {world && <span className="ml-2 text-sm font-normal align-middle bg-gray-700 text-gray-300 px-3 py-1 rounded-full">{world.name}</span>}</>}
                actions={<Button onClick={() => onEdit(plot)} variant="secondary"><EditIcon/> Editar</Button>}
            />
            
            <div className="bg-gray-700 p-6 rounded-lg mt-6">
                <h3 className="text-xl font-semibold mb-2 text-amber-400">Premissa</h3>
                <p className="text-lg italic text-gray-300">"{plot.logline || "Nenhuma premissa definida."}"</p>
            </div>

            {!plot.threeActStructureHidden && (
                <div className="bg-gray-700 p-6 rounded-lg mt-6">
                    <h3 className="text-xl font-semibold mb-4 text-amber-400">Estrutura de Três Atos</h3>
                    <div className="space-y-4">
                        <ActViewer label="Ato 1: A Apresentação" value={plot.act1} />
                        <ActViewer label="Ato 2: A Confrontação" value={plot.act2} />
                        <ActViewer label="Ato 3: A Resolução" value={plot.act3} />
                    </div>
                </div>
            )}

            <CustomFieldsViewer customData={plot.customData} allArticles={allArticles} onNavigate={onNavigate} />

            {(hasRelatedArticles || hasRelatedCharacters) && (
                <div className="mt-8 space-y-6">
                    {hasRelatedArticles && (
                        <div>
                            <h3 className="text-xl font-semibold mb-4 text-amber-400">Artigos Relacionados</h3>
                            <div className="flex flex-wrap gap-3">
                                {allArticles.filter(a => plot.relatedArticleIds.includes(a.id)).map(related => (
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
                                {allCharacters.filter(c => plot.relatedCharacterIds.includes(c.id)).map(related => (
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

export default PlotViewer;