
import React, { useState, useEffect } from 'react';
import type { World } from '../types';
import { PageContainer, FormContainer, FormSection, Input, Textarea, Button } from './ui';
import { ColorPicker, CustomFieldsEditor } from './shared';

interface WorldFormProps {
    selectedWorld: Partial<World>;
    setWorlds: React.Dispatch<React.SetStateAction<World[]>>;
    setSelectedWorld: (world: World | null) => void;
}

const WorldForm: React.FC<WorldFormProps> = ({ selectedWorld, setWorlds, setSelectedWorld }) => {
    const [world, setWorld] = useState<Partial<World>>({});
    
    useEffect(() => {
        let w = {...selectedWorld};
        if (!w.customData) {
            w.customData = { title: 'Campos Personalizados', sections: [] };
        }
        setWorld(w);
    }, [selectedWorld]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setWorld(p => ({ ...p, [e.target.name]: e.target.value }));
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const finalWorld = {
            ...world, 
            name: world.name || "Sem Nome",
            description: world.description || "",
            customData: world.customData!
        };
        if (finalWorld.id) {
            setWorlds(p => p.map(w => w.id === finalWorld.id ? finalWorld as World : w));
        } else {
            setWorlds(p => [...p, { ...finalWorld, id: Date.now(), articles: [], color: finalWorld.color || '#4A5568' } as World]);
        }
        setSelectedWorld(null);
    };

    return (
        <PageContainer>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-8 text-center">{world.id ? "Editar Mundo" : "Criar Novo Mundo"}</h2>
            <FormContainer onSubmit={handleSubmit}>
                <FormSection title="Detalhes do Mundo">
                    <Input type="text" name="name" value={world.name || ''} onChange={handleChange} placeholder="Nome do Mundo" required />
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Descrição</label>
                        <Textarea
                            name="description"
                            value={world.description || ''}
                            onChange={handleChange}
                            placeholder="Descreva a premissa ou o tema principal deste mundo."
                            className="h-32"
                        />
                    </div>
                    <ColorPicker selectedColor={world.color || '#4A5568'} onChange={(c) => setWorld(p => ({...p, color: c}))} />
                </FormSection>
                
                <CustomFieldsEditor 
                    customData={world.customData!}
                    onUpdate={(newCustomData) => setWorld(p => ({...p, customData: newCustomData}))}
                />

                <div className="flex justify-end gap-4">
                    <Button type="button" onClick={() => setSelectedWorld(null)} variant="secondary">Cancelar</Button>
                    <Button type="submit">Salvar Mundo</Button>
                </div>
            </FormContainer>
        </PageContainer>
    );
};

export default WorldForm;
