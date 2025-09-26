
import React from 'react';
import type { Character, World, Article } from '../types';
import { EditIcon } from './icons';
import { PageContainer, Button, PageHeader } from './ui';
import { CustomFieldsViewer } from './shared';

interface CharacterViewerProps {
    character: Character;
    onBack: () => void;
    onEdit: (character: Character) => void;
    worlds: World[];
    allArticles: Article[];
    onNavigate: (article: Article) => void;
}

const ViewerField: React.FC<{label: string, value?: string | number}> = ({label, value}) => value ? (
    <div>
        <h4 className="font-bold text-gray-200">{label}</h4>
        <p className="text-gray-400 whitespace-pre-wrap">{value}</p>
    </div>
) : null;

const CharacterViewer: React.FC<CharacterViewerProps> = ({ character, onBack, onEdit, worlds, allArticles, onNavigate }) => {
    const world = character.worldId ? worlds.find(w => w.id === character.worldId) : null;

    return (
        <PageContainer>
            <PageHeader
                backLink={<button onClick={onBack} className="text-sm text-amber-400 hover:underline">&larr; Voltar para Personagens</button>}
                title={<>{character.name || "Personagem sem nome"} {world && <span className="ml-2 text-sm font-normal align-middle bg-gray-700 text-gray-300 px-3 py-1 rounded-full">{world.name}</span>}</>}
                actions={<Button onClick={() => onEdit(character)} variant="secondary"><EditIcon/> Editar</Button>}
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <div className="bg-gray-700 p-6 rounded-lg space-y-4">
                    <h3 className="text-xl font-semibold mb-2 text-amber-400">Dados Básicos</h3>
                    <ViewerField label="Idade" value={character.age} />
                    <ViewerField label="Aparência" value={character.appearance} />
                </div>

                <div className="bg-gray-700 p-6 rounded-lg space-y-4">
                    <h3 className="text-xl font-semibold mb-2 text-amber-400">Perfil Psicológico</h3>
                    <ViewerField label="Arquétipo" value={character.archetype} />
                    <ViewerField label="Personalidade" value={character.personality} />
                    <ViewerField label="Motivação" value={character.motivation} />
                    <ViewerField label="Medos" value={character.fear} />
                    <ViewerField label="Segredos" value={character.secret} />
                </div>
                
                <div className="bg-gray-700 p-6 rounded-lg space-y-4">
                    <h3 className="text-xl font-semibold mb-2 text-amber-400">Relações e Status</h3>
                    <ViewerField label="Afiliação e Lealdades" value={character.affiliation} />
                    <ViewerField label="Status Social e Político" value={character.socialStatus} />
                    <ViewerField label="Inimigos e Aliados" value={character.enemiesAllies} />
                </div>

                <div className="bg-gray-700 p-6 rounded-lg space-y-4">
                    <h3 className="text-xl font-semibold mb-2 text-amber-400">Repertório</h3>
                    <ViewerField label="Poderes e Habilidades" value={character.powers} />
                    <ViewerField label="Fraquezas" value={character.weaknesses} />
                    <ViewerField label="Equipamento" value={character.equipment} />
                </div>

                {character.backstory && (
                    <div className="bg-gray-700 p-6 rounded-lg lg:col-span-2">
                        <h3 className="text-xl font-semibold mb-2 text-amber-400">História Pregressa</h3>
                        <p className="text-gray-400 whitespace-pre-wrap">{character.backstory}</p>
                    </div>
                )}
            </div>

            <CustomFieldsViewer customData={character.customData} allArticles={allArticles} onNavigate={onNavigate} />
            
            {character.relatedArticleIds && character.relatedArticleIds.length > 0 && (
                 <div className="mt-8">
                    <h3 className="text-xl font-semibold mb-4 text-amber-400">Artigos Relacionados</h3>
                    <div className="flex flex-wrap gap-3">
                        {allArticles.filter(a => character.relatedArticleIds.includes(a.id)).map(related => (
                            <button key={related.id} onClick={() => onNavigate(related)} className="bg-amber-900/50 text-amber-300 px-3 py-1 rounded-full text-sm hover:bg-amber-800/50 transition-colors">
                                {related.title}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </PageContainer>
    );
};

export default CharacterViewer;