

import React, { useState, useEffect } from 'react';
import type { Plot, World, Character } from '../types';
import { PageContainer, FormContainer, FormSection, Input, Textarea, Select, Button } from './ui';
import { CustomFieldsEditor, GlobalArticleSelector, RelatedCharactersSelector } from './shared';
import { TrashIcon } from './icons';

interface PlotFormProps {
    selectedPlot: Partial<Plot>;
    setPlots: React.Dispatch<React.SetStateAction<Plot[]>>;
    setSelectedPlot: (plot: Plot | null) => void;
    worlds: World[];
    characters: Character[];
}

const PlotForm: React.FC<PlotFormProps> = ({ selectedPlot, setPlots, setSelectedPlot, worlds, characters }) => {
    const [plot, setPlot] = useState<Partial<Plot>>({});

    useEffect(() => {
        let p = {...selectedPlot};
        if (!p.customData) {
            p.customData = { title: 'Campos Personalizados', sections: [] };
        }
        setPlot(p);
    }, [selectedPlot]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setPlot(prev => ({ ...prev, [name]: name === 'worldId' ? (value ? parseInt(value, 10) : null) : value }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const finalPlot = {...plot, title: plot.title || "Sem Título", relatedArticleIds: plot.relatedArticleIds || [], relatedCharacterIds: plot.relatedCharacterIds || [], customData: plot.customData! };
        if (finalPlot.id) {
            setPlots(prev => prev.map(p => p.id === finalPlot.id ? finalPlot as Plot : p));
        } else {
            setPlots(prev => [...prev, { ...finalPlot, id: Date.now() } as Plot]);
        }
        setSelectedPlot(null);
    };

    const toggleThreeActStructure = (hidden: boolean) => {
        setPlot(p => ({ ...p, threeActStructureHidden: hidden }));
    };

    const charactersForConnection = plot.worldId 
        ? characters.filter(c => c.worldId === plot.worldId) 
        : characters.filter(c => !c.worldId);

    return (
        <PageContainer>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-8 text-center">{plot.id ? "Editar Enredo" : "Criar Novo Enredo"}</h2>
            <FormContainer onSubmit={handleSubmit}>
                <FormSection title="Premissa">
                    <Input type="text" name="title" value={plot.title || ''} onChange={handleChange} placeholder="Título da História" required/>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Mundo</label>
                        <Select name="worldId" value={plot.worldId || ''} onChange={handleChange}>
                            <option value="">Sem Mundo</option>
                            {worlds.sort((a,b) => (a.name||'').localeCompare(b.name||'')).map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                        </Select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Premissa (Logline)</label>
                        <Textarea name="logline" value={plot.logline || ''} onChange={handleChange} placeholder="[PROTAGONISTA] quer [OBJETIVO] apesar de [OBSTÁCULO]." className="h-20"></Textarea>
                    </div>
                </FormSection>
                
                <FormSection
                    header={
                        <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-600">
                            <h3 className="text-xl font-semibold text-amber-400">Estrutura de Três Atos</h3>
                            {!plot.threeActStructureHidden && (
                                <Button type="button" variant="secondary" onClick={() => toggleThreeActStructure(true)} className="hover:bg-red-800/50 hover:text-red-300">
                                    <TrashIcon/>
                                </Button>
                            )}
                        </div>
                    }
                >
                    {!plot.threeActStructureHidden ? (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Ato 1: A Apresentação</label>
                                <Textarea name="act1" value={plot.act1 || ''} onChange={handleChange} placeholder="Apresente o protagonista, seu mundo e o incidente incitante..." className="h-32"></Textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Ato 2: A Confrontação</label>
                                <Textarea name="act2" value={plot.act2 || ''} onChange={handleChange} placeholder="O protagonista enfrenta obstáculos crescentes..." className="h-32"></Textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Ato 3: A Resolução</label>
                                <Textarea name="act3" value={plot.act3 || ''} onChange={handleChange} placeholder="Clímax da história, onde o conflito principal é resolvido..." className="h-32"></Textarea>
                            </div>
                        </div>
                    ) : (
                         <Button type="button" onClick={() => toggleThreeActStructure(false)} variant="secondary">
                            Restaurar Estrutura de Três Atos
                        </Button>
                    )}
                </FormSection>
                
                <CustomFieldsEditor 
                    customData={plot.customData!} 
                    onUpdate={(newCustomData) => setPlot(p => ({...p, customData: newCustomData}))}
                />
                <FormSection title="Conexões">
                    <GlobalArticleSelector worlds={worlds} relatedIds={plot.relatedArticleIds || []} onUpdate={(ids) => setPlot(p => ({...p, relatedArticleIds: ids}))} />
                    <RelatedCharactersSelector
                        allCharacters={charactersForConnection}
                        relatedIds={plot.relatedCharacterIds || []}
                        onUpdate={(ids) => setPlot(p => ({ ...p, relatedCharacterIds: ids }))}
                    />
                </FormSection>

                <div className="flex justify-end gap-4">
                    <Button type="button" onClick={() => setSelectedPlot(null)} variant="secondary">Cancelar</Button>
                    <Button type="submit">Salvar Enredo</Button>
                </div>
            </FormContainer>
        </PageContainer>
    );
};


export default PlotForm;