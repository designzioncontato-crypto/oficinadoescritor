
import React, { useState } from 'react';
import type { Plot, World } from '../types';
import { PlusIcon, TrashIcon, EditIcon } from './icons';
import { PageContainer, PageHeader, Button, EmptyState, Select } from './ui';

interface PlotArchitectProps {
    plots: Plot[];
    setPlots: React.Dispatch<React.SetStateAction<Plot[]>>;
    onSelectPlot: (plot: Partial<Plot>) => void;
    onViewPlot: (plot: Plot) => void;
    worlds: World[];
}

const PlotArchitect: React.FC<PlotArchitectProps> = ({ plots, setPlots, onSelectPlot, onViewPlot, worlds }) => {
    const [worldFilter, setWorldFilter] = useState('');
    const deletePlot = (id: number) => setPlots(plots => plots.filter(plot => plot.id !== id));
    const filteredPlots = plots.filter(p => !worldFilter || (worldFilter === 'none' ? !p.worldId : String(p.worldId) === worldFilter)).sort((a,b) => (a.title || '').localeCompare(b.title || ''));

    return (
        <PageContainer>
            <PageHeader
                title="Arquiteto de Enredos"
                actions={
                    <>
                         <Select value={worldFilter} onChange={(e) => setWorldFilter(e.target.value)} className="min-w-48">
                            <option value="">Todos os Mundos</option>
                            <option value="none">Enredos Gerais</option>
                            {worlds.sort((a, b) => a.name.localeCompare(b.name)).map(world => <option key={world.id} value={world.id}>{world.name}</option>)}
                        </Select>
                        <Button onClick={() => onSelectPlot({})}>
                            <PlusIcon/> Novo Enredo
                        </Button>
                    </>
                }
            />
            {plots.length === 0 ? (
                 <EmptyState
                    title="Nenhum enredo criado ainda."
                    // FIX: Changed to single quotes to avoid JSX parsing issues with escaped double quotes.
                    subtitle='Clique em "Novo Enredo" para estruturar sua próxima grande história.'
                 />
            ) : filteredPlots.length === 0 ? (
                 <EmptyState title="Nenhum enredo encontrado para o filtro selecionado." />
            ) : (
                <div className="space-y-4">
                    {filteredPlots.map(plot => {
                        const world = plot.worldId ? worlds.find(w => w.id === plot.worldId) : null;
                        return (
                            <div key={plot.id} className="bg-gray-700 rounded-lg p-4 flex justify-between items-start hover:bg-gray-600/50 transition-colors cursor-pointer" onClick={() => onViewPlot(plot)}>
                               <div>
                                    <h3 className="text-xl font-bold text-gray-100">{plot.title || "Enredo Sem Título"}</h3>
                                    {world && <span className="mt-1 inline-block text-xs bg-gray-600 text-gray-300 px-2 py-0.5 rounded-full">{world.name}</span>}
                                    <p className="text-gray-400 mt-2 italic">"{plot.logline || "Nenhuma premissa definida."}"</p>
                                </div>
                                <div className="flex gap-2 flex-shrink-0 ml-4">
                                    <Button variant="secondary" onClick={(e) => {e.stopPropagation(); onSelectPlot(plot)}}><EditIcon/></Button>
                                    <Button variant="secondary" onClick={(e) => {e.stopPropagation(); deletePlot(plot.id)}} className="hover:bg-red-800/50 hover:text-red-300"><TrashIcon/></Button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </PageContainer>
    );
};

export default PlotArchitect;