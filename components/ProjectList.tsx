
import React, { useState } from 'react';
import type { Project } from '../types';
import { PlusIcon, EditIcon, TrashIcon } from './icons';
import { PageContainer, PageHeader, Button, Card, EmptyState, Input } from './ui';

interface ProjectListProps {
    projects: Project[];
    setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
    onEditProject: (project: Partial<Project>) => void;
    onSelectProject: (project: Project) => void;
}

const ProjectList: React.FC<ProjectListProps> = ({ projects, setProjects, onEditProject, onSelectProject }) => {
    const [searchFilter, setSearchFilter] = useState('');
    const filteredProjects = projects.filter(p => (p.title || '').toLowerCase().includes(searchFilter.toLowerCase()));
    
    const deleteProject = (id: number) => {
        setProjects(projects.filter(p => p.id !== id));
    };

    return (
        <PageContainer>
            <PageHeader
                title="A Escrivaninha Digital"
                actions={
                    <>
                        <Input 
                            type="text" 
                            placeholder="Filtrar projetos..." 
                            value={searchFilter} 
                            onChange={(e) => setSearchFilter(e.target.value)} 
                            className="min-w-48"
                        />
                        <Button onClick={() => onEditProject({})}>
                            <PlusIcon/> Novo Projeto
                        </Button>
                    </>
                }
            />
            {projects.length === 0 ? (
                <EmptyState
                    title="Nenhum projeto de escrita iniciado."
                    // FIX: Changed to single quotes to avoid JSX parsing issues with escaped double quotes.
                    subtitle='Clique em "Novo Projeto" para começar a sua obra.'
                />
            ) : (
                 <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredProjects.map(proj => (
                        <Card key={proj.id}>
                             <div className="p-5 flex-grow cursor-pointer" onClick={() => onSelectProject(proj)}>
                                <h3 className="text-xl font-bold text-gray-100 truncate">{proj.title || "Projeto Sem Título"}</h3>
                                <p className="text-sm text-gray-500 mt-2">{proj.chapters?.length || 0} capítulos</p>
                            </div>
                            <div className="bg-gray-700/50 p-3 flex justify-end gap-2 border-t border-gray-600/50">
                                <Button variant="secondary" onClick={(e) => { e.stopPropagation(); onEditProject(proj); }}><EditIcon/></Button>
                                <Button variant="secondary" onClick={(e) => { e.stopPropagation(); deleteProject(proj.id); }} className="hover:bg-red-800/50 hover:text-red-300"><TrashIcon/></Button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </PageContainer>
    );
};

export default ProjectList;