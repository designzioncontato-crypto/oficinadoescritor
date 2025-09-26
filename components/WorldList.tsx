
import React, { useState } from 'react';
import type { World } from '../types';
import { PlusIcon, TrashIcon, EditIcon } from './icons';
import { PageContainer, PageHeader, Button, Card, EmptyState, Input } from './ui';

interface WorldListProps {
    worlds: World[];
    setWorlds: React.Dispatch<React.SetStateAction<World[]>>;
    onSelectWorld: (world: World) => void;
    onEditWorld: (world: Partial<World>) => void;
}

const WorldList: React.FC<WorldListProps> = ({ worlds, setWorlds, onSelectWorld, onEditWorld }) => {
    const [searchFilter, setSearchFilter] = useState('');
    const deleteWorld = (id: number) => setWorlds(worlds => worlds.filter(world => world.id !== id));
    const filteredWorlds = worlds.filter(w => (w.name || '').toLowerCase().includes(searchFilter.toLowerCase()));

    return (
        <PageContainer>
            <PageHeader
                title="Seus Mundos"
                actions={
                    <>
                        <Input type="text" placeholder="Filtrar mundos..." value={searchFilter} onChange={(e) => setSearchFilter(e.target.value)} className="min-w-48" />
                        <Button onClick={() => onEditWorld({})}>
                            <PlusIcon/> Novo Mundo
                        </Button>
                    </>
                }
            />
            {worlds.length === 0 ? (
                <EmptyState
                    title="Nenhum mundo criado ainda."
                    // FIX: Changed to single quotes to avoid JSX parsing issues with escaped double quotes.
                    subtitle='Clique em "Novo Mundo" para começar a construir seu primeiro universo.'
                />
            ) : filteredWorlds.length === 0 ? (
                 <EmptyState title={`Nenhum mundo encontrado para o filtro "${searchFilter}".`} />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredWorlds.sort((a,b)=>(a.name||'').localeCompare(b.name||'')).map(world => (
                        <Card key={world.id} color={world.color}>
                            <div className="p-5 flex-grow">
                                <h3 className="text-xl font-bold text-gray-100 truncate">{world.name || "Mundo Sem Título"}</h3>
                                <div className="text-gray-400 mt-2 h-16 overflow-hidden text-ellipsis prose prose-invert max-w-none prose-p:my-1" dangerouslySetInnerHTML={{__html: world.description || "Nenhuma descrição."}}></div>
                                <p className="text-sm text-gray-500 mt-2">{world.articles?.length || 0} artigos</p>
                            </div>
                            <div className="bg-gray-700/50 p-3 flex justify-between items-center border-t border-gray-600/50">
                                <Button onClick={() => onSelectWorld(world)} className="w-full mr-2">
                                    Explorar
                                </Button>
                                <div className="flex">
                                    <Button variant="secondary" onClick={() => onEditWorld(world)}><EditIcon/></Button>
                                    <Button variant="secondary" onClick={() => deleteWorld(world.id)} className="hover:bg-red-800/50 hover:text-red-300"><TrashIcon/></Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </PageContainer>
    );
};

export default WorldList;