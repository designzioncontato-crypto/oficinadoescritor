
import React, { useState, useEffect } from 'react';
import type { Project } from '../types';
import { PageContainer, FormContainer, FormSection, Input, Button } from './ui';

interface ProjectFormProps {
    selectedProject: Partial<Project>;
    setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
    setSelectedProject: (project: Project | null) => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ selectedProject, setProjects, setSelectedProject }) => {
    const [project, setProject] = useState(selectedProject);

    useEffect(() => {
        setProject(selectedProject);
    }, [selectedProject]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProject(p => ({ ...p, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const finalProject = {...project, title: project.title || 'Sem Título'};
        if (project.id) {
            setProjects(ps => ps.map(p => p.id === project.id ? finalProject as Project : p));
        } else {
            setProjects(ps => [...ps, { ...finalProject, id: Date.now(), chapters: [] } as Project]);
        }
        setSelectedProject(null);
    };

    return (
         <PageContainer>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-8 text-center">{project.id ? "Editar Projeto" : "Novo Projeto"}</h2>
            <FormContainer onSubmit={handleSubmit}>
                <FormSection title="Detalhes do Projeto">
                     <Input 
                        type="text" 
                        name="title" 
                        value={project.title || ''} 
                        onChange={handleChange} 
                        placeholder="Título do Projeto" 
                        required 
                    />
                </FormSection>
                 <div className="flex justify-end gap-4">
                    <Button type="button" onClick={() => setSelectedProject(null)} variant="secondary">Cancelar</Button>
                    <Button type="submit">Salvar Projeto</Button>
                </div>
            </FormContainer>
        </PageContainer>
    );
};

export default ProjectForm;
