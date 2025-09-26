
import React, { useState } from 'react';
import type { Character, World } from '../types';
import { PlusIcon, TrashIcon, EditIcon } from './icons';
import { PageContainer, PageHeader, Button, Card, EmptyState, Select } from './ui';

interface CharacterLabProps {
    characters: Character[];
    setCharacters: React.Dispatch<React.SetStateAction<Character[]>>;
    onSelectCharacter: (character: Partial<Character>) => void;
    onViewCharacter: (character: Character) => void;
    worlds: World[];
}

const CharacterLab: React.FC<CharacterLabProps> = ({ characters, setCharacters, onSelectCharacter, onViewCharacter, worlds }) => {
    const [worldFilter, setWorldFilter] = useState('');
    const deleteCharacter = (id: number) => setCharacters(chars => chars.filter(char => char.id !== id));

    const charactersWithoutWorld = characters.filter(c => !c.worldId).sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    const charactersByWorld = worlds
        .map(w => ({ ...w, characters: characters.filter(c => c.worldId === w.id).sort((a, b) => (a.name || '').localeCompare(b.name || '')) }))
        .filter(w => w.characters.length > 0).sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        
    const showGeneral = !worldFilter || worldFilter === 'none';
    const generalResults = showGeneral ? charactersWithoutWorld : [];
    const worldResults = charactersByWorld.filter(w => !worldFilter || String(w.id) === worldFilter);
    
    const hasAnyResults = generalResults.length > 0 || worldResults.length > 0;

    return (
        <PageContainer>
            <PageHeader
                title="Laboratório de Personagens"
                actions={
                    <>
                        <Select value={worldFilter} onChange={(e) => setWorldFilter(e.target.value)} className="min-w-48">
                            <option value="">Todos os Mundos</option>
                            <option value="none">Personagens Gerais</option>
                            {worlds.sort((a, b) => a.name.localeCompare(b.name)).map(world => (
                                <option key={world.id} value={world.id}>{world.name}</option>
                            ))}
                        </Select>
                        <Button onClick={() => onSelectCharacter({})}>
                            <PlusIcon/> Novo Personagem
                        </Button>
                    </>
                }
            />
            {!hasAnyResults ? (
                <EmptyState 
                    title={characters.length === 0 ? "Nenhum personagem criado ainda." : "Nenhum personagem encontrado para o filtro selecionado."}
                    subtitle={characters.length === 0 ? "Clique em \"Novo Personagem\" para começar a dar vida às suas criações." : undefined}
                />
            ) : (
                 <div className="space-y-10">
                    {generalResults.length > 0 && (
                        <div>
                            <h3 className="text-2xl font-semibold text-gray-400 mb-4 pb-2 border-b border-gray-700">Personagens Gerais</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {generalResults.map(char => <CharacterCard key={char.id} character={char} onView={onViewCharacter} onEdit={onSelectCharacter} onDelete={deleteCharacter} />)}
                            </div>
                        </div>
                    )}
                    
                    {worldResults.map(world => (
                        <div key={world.id}>
                            <h3 className="text-2xl font-semibold text-gray-400 mb-4 pb-2 border-b border-gray-700">{world.name}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {world.characters.map(char => <CharacterCard key={char.id} character={char} onView={onViewCharacter} onEdit={onSelectCharacter} onDelete={deleteCharacter} />)}
                            </div>
                        </div>
                    ))}
                 </div>
            )}
        </PageContainer>
    );
};

interface CharacterCardProps {
    character: Character;
    onView: (char: Character) => void;
    onEdit: (char: Character) => void;
    onDelete: (id: number) => void;
}

const CharacterCard: React.FC<CharacterCardProps> = ({ character, onView, onEdit, onDelete }) => (
    <Card color={character.color}>
        <div className="p-5 flex-grow" onClick={() => onView(character)}>
            <h3 className="text-xl font-bold text-gray-100 truncate">{character.name || "Sem Nome"}</h3>
            <p className="text-gray-400 mt-2 h-12 overflow-hidden text-ellipsis">{character.motivation || "Nenhuma motivação definida."}</p>
        </div>
        <div className="bg-gray-700/50 p-3 flex justify-end gap-2 border-t border-gray-600/50">
            <Button variant="secondary" onClick={(e) => { e.stopPropagation(); onEdit(character); }}><EditIcon/></Button>
            <Button variant="secondary" onClick={(e) => { e.stopPropagation(); onDelete(character.id); }} className="hover:bg-red-800/50 hover:text-red-300"><TrashIcon/></Button>
        </div>
    </Card>
);


export default CharacterLab;
