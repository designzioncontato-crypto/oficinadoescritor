

import React, { useState, useEffect } from 'react';
import type { Article, World, Character } from '../types';
import { ARTICLE_CATEGORIES } from '../constants';
import { PageContainer, PageHeader, FormContainer, FormSection, Input, Select, Textarea, Button } from './ui';
import { ColorPicker, CustomFieldsEditor, RelatedArticlesSelector, RelatedCharactersSelector } from './shared';

interface WorldArticleFormProps {
    selectedArticle: Partial<Article>;
    selectedWorld: World;
    setWorlds: React.Dispatch<React.SetStateAction<World[]>>;
    setSelectedArticle: (article: Article | null) => void;
    characters: Character[];
}

const WorldArticleForm: React.FC<WorldArticleFormProps> = ({ selectedArticle, selectedWorld, setWorlds, setSelectedArticle, characters }) => {
    const [article, setArticle] = useState<Partial<Article>>({});

    useEffect(() => {
        let a = {...selectedArticle};
        if (!a.customData) {
            a.customData = { title: 'Campos Personalizados', sections: [] };
        }
        setArticle(a);
    }, [selectedArticle]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setArticle(p => ({ ...p, [e.target.name]: e.target.value }));

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const finalArticle = { ...article, title: article.title || "Sem Título", category: article.category || "Sem Categoria", content: article.content || "", relatedArticleIds: article.relatedArticleIds || [], relatedCharacterIds: article.relatedCharacterIds || [], customData: article.customData! };
        setWorlds(prev => prev.map(world => {
            if (world.id === selectedWorld.id) {
                const newArticle = { ...finalArticle, worldId: selectedWorld.id };
                const articles = article.id 
                    ? world.articles.map(a => a.id === article.id ? newArticle as Article : a) 
                    : [...(world.articles||[]), {...newArticle, id: Date.now(), color: article.color || '#4A5568'} as Article];
                return { ...world, articles };
            }
            return world;
        }));
        setSelectedArticle(null);
    };

    const charactersInWorld = characters.filter(c => c.worldId === selectedWorld.id);

    return (
        <PageContainer>
            <PageHeader
                backLink={<button onClick={() => setSelectedArticle(null)} className="text-sm text-amber-400 hover:underline">&larr; Voltar para {selectedWorld.name}</button>}
                title={article.id ? "Editar Artigo" : `Novo Artigo em ${selectedWorld.name}`}
            />
            <FormContainer onSubmit={handleSubmit}>
                <FormSection title="Detalhes do Artigo">
                    <Input type="text" name="title" value={article.title || ''} onChange={handleChange} placeholder="Título do Artigo (Ex: Cidade de Lúmina)" required />
                    <div>
                        <Select name="category" value={article.category || ''} onChange={handleChange} required>
                            <option value="" disabled>Selecione uma Categoria...</option>
                            {ARTICLE_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </Select>
                    </div>
                    <ColorPicker selectedColor={article.color || '#4A5568'} onChange={(c) => setArticle(p => ({...p, color: c}))} />
                </FormSection>
                <FormSection title="Enciclopédia (Conteúdo)">
                     <Textarea
                        name="content"
                        value={article.content || ''}
                        onChange={handleChange}
                        placeholder="Descreva este elemento do seu mundo. Você pode criar links para outros artigos, como [[Nome do Artigo]]."
                        className="h-48"
                    />
                </FormSection>
                
                <CustomFieldsEditor 
                    customData={article.customData!} 
                    onUpdate={(newCustomData) => setArticle(p => ({...p, customData: newCustomData}))} 
                />

                <FormSection title="Conexões">
                    <RelatedArticlesSelector 
                        allArticles={selectedWorld.articles || []}
                        currentArticleId={article.id}
                        relatedIds={article.relatedArticleIds || []}
                        onUpdate={(ids) => setArticle(p => ({...p, relatedArticleIds: ids}))}
                    />
                    <RelatedCharactersSelector
                        allCharacters={charactersInWorld}
                        relatedIds={article.relatedCharacterIds || []}
                        onUpdate={(ids) => setArticle(p => ({...p, relatedCharacterIds: ids}))}
                    />
                </FormSection>

                <div className="flex justify-end gap-4">
                    <Button type="button" onClick={() => setSelectedArticle(null)} variant="secondary">Cancelar</Button>
                    <Button type="submit">Salvar Artigo</Button>
                </div>
            </FormContainer>
        </PageContainer>
    );
};

export default WorldArticleForm;