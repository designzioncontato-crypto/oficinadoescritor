
import React, { useState, useEffect } from 'react';
import type { Character, World } from '../types';
import { ARCHETYPES } from '../constants';
import { PageContainer, FormContainer, FormSection, Input, Textarea, Select, Button } from './ui';
import { ColorPicker, CustomFieldsEditor, GlobalArticleSelector } from './shared';

interface CharacterFormProps {
    selectedCharacter: Partial<Character>;
    setCharacters: React.Dispatch<React.SetStateAction<Character[]>>;
    setSelectedCharacter: (character: Character | null) => void;
    worlds: World[];
}

const CharacterForm: React.FC<CharacterFormProps> = ({ selectedCharacter, setCharacters, setSelectedCharacter, worlds }) => {
    const [character, setCharacter] = useState<Partial<Character>>({});

    useEffect(() => {
        let char = {...selectedCharacter};
        if (!char.customData) {
            char.customData = { title: 'Campos Personalizados', sections: [] };
        }
        setCharacter(char);
    }, [selectedCharacter]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setCharacter(prev => ({ ...prev, [name]: name === 'worldId' ? (value ? parseInt(value, 10) : null) : value }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const finalChar = { ...character, name: character.name || 'Sem Nome', relatedArticleIds: character.relatedArticleIds || [], color: character.color || '#4A5568', customData: character.customData! };
        
        if (finalChar.id) {
            setCharacters(prev => prev.map(c => c.id === finalChar.id ? finalChar as Character : c));
        } else {
            setCharacters(prev => [...prev, { ...finalChar, id: Date.now() } as Character]);
        }
        setSelectedCharacter(null);
    };

    const psychologicalFields = {
        personality: { label: "Personalidade", placeholder: "Descreva os traços de personalidade." },
        motivation: { label: "Motivação", placeholder: "O que o impulsiona?" },
        fear: { label: "Medos", placeholder: "O que o aterroriza?" },
        secret: { label: "Segredos", placeholder: "O que ele esconde?" }
    };
    const relationsFields = {
        affiliation: { label: "Afiliação e Lealdades", placeholder: "A quais grupos, facções ou reinos o personagem é leal?" },
        socialStatus: { label: "Status Social e Político", placeholder: "Qual é a posição do personagem na sociedade?" },
        enemiesAllies: { label: "Inimigos e Aliados", placeholder: "Liste os principais inimigos e aliados do personagem." }
    };
    const skillsFields = {
        powers: { label: "Poderes e Habilidades", placeholder: "Descreva as habilidades especiais, talentos ou poderes." },
        weaknesses: { label: "Fraquezas", placeholder: "Quais são as vulnerabilidades ou fraquezas?" },
        equipment: { label: "Equipamento / Objeto Pessoal Querido", placeholder: "Liste armas, ferramentas ou objetos de valor sentimental." }
    };
    
    return (
        <PageContainer>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-8 text-center">{character.id ? "Editar Personagem" : "Criar Novo Personagem"}</h2>
            <FormContainer onSubmit={handleSubmit}>
                <FormSection title="Dados Básicos">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input type="text" name="name" value={character.name || ''} onChange={handleChange} placeholder="Nome Completo" required />
                        <Input type="number" name="age" value={character.age || ''} onChange={handleChange} placeholder="Idade" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Mundo</label>
                        <Select name="worldId" value={character.worldId || ''} onChange={handleChange}>
                            <option value="">Sem Mundo</option>
                            {worlds.sort((a, b) => (a.name || '').localeCompare(b.name || '')).map(world => (
                                <option key={world.id} value={world.id}>{world.name}</option>
                            ))}
                        </Select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Descrição da Aparência</label>
                        <Textarea name="appearance" value={character.appearance || ''} onChange={handleChange} placeholder="Descreva traços, roupas, etc."/>
                    </div>
                    <ColorPicker selectedColor={character.color || '#4A5568'} onChange={(color) => setCharacter(p => ({...p, color}))} />
                </FormSection>

                <FormSection title="Perfil Psicológico">
                    <Select name="archetype" value={character.archetype || ''} onChange={handleChange}>
                        <option value="">Selecione um Arquétipo...</option>
                        {ARCHETYPES.map(arch => <option key={arch} value={arch}>{arch}</option>)}
                    </Select>
                    {Object.entries(psychologicalFields).map(([key, {label, placeholder}]) => (
                        <div key={key}>
                           <label className="block text-sm font-medium text-gray-400 mb-2">{label}</label>
                           <Textarea name={key} value={character[key as keyof Character] as string || ''} onChange={handleChange} placeholder={placeholder}></Textarea>
                        </div>
                    ))}
                </FormSection>
                
                <FormSection title="Relações e Status">
                    {Object.entries(relationsFields).map(([key, {label, placeholder}]) => (
                        <div key={key}>
                            <label className="block text-sm font-medium text-gray-400 mb-2">{label}</label>
                            <Textarea name={key} value={character[key as keyof Character] as string || ''} onChange={handleChange} placeholder={placeholder}></Textarea>
                        </div>
                    ))}
                </FormSection>

                <FormSection title="Repertório">
                    {Object.entries(skillsFields).map(([key, {label, placeholder}]) => (
                        <div key={key}>
                            <label className="block text-sm font-medium text-gray-400 mb-2">{label}</label>
                            <Textarea name={key} value={character[key as keyof Character] as string || ''} onChange={handleChange} placeholder={placeholder}></Textarea>
                        </div>
                    ))}
                </FormSection>

                <FormSection title="História Pregressa (Backstory)">
                    <Textarea name="backstory" value={character.backstory || ''} onChange={handleChange} placeholder="Descreva a história do personagem antes do início da sua trama." className="h-32"></Textarea>
                </FormSection>

                <CustomFieldsEditor 
                    customData={character.customData!} 
                    onUpdate={(newCustomData) => setCharacter(p => ({...p, customData: newCustomData}))} 
                />

                <FormSection>
                    <GlobalArticleSelector worlds={worlds} relatedIds={character.relatedArticleIds || []} onUpdate={(ids) => setCharacter(p => ({...p, relatedArticleIds: ids}))} />
                </FormSection>

                <div className="flex justify-end gap-4">
                    <Button type="button" onClick={() => setSelectedCharacter(null)} variant="secondary">Cancelar</Button>
                    <Button type="submit">Salvar Personagem</Button>
                </div>
            </FormContainer>
        </PageContainer>
    );
};

export default CharacterForm;
