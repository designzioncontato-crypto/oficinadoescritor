
import React from 'react';
import type { Project, Chapter } from '../types';
import { PlusIcon, TrashIcon } from './icons';
import { PageContainer, PageHeader, Button, EmptyState } from './ui';

interface ProjectChapterListProps {
    activeProject: Project;
    setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
    onSelectChapter: (chapter: Chapter) => void;
    onBack: () => void;
}

const ProjectChapterList: React.FC<ProjectChapterListProps> = ({ activeProject, setProjects, onSelectChapter, onBack }) => {

    const addChapter = () => {
        const newChapter = { id: Date.now(), title: 'Novo Capítulo', content: '' };
        setProjects(projs => projs.map(p => 
            p.id === activeProject.id ? { ...p, chapters: [...(p.chapters || []), newChapter] } : p
        ));
        onSelectChapter(newChapter);
    };
    
    const deleteChapter = (chapterId: number) => {
        setProjects(projs => projs.map(p =>
            p.id === activeProject.id ? { ...p, chapters: (p.chapters || []).filter(c => c.id !== chapterId) } : p
        ));
    };

    return (
        <PageContainer>
             <PageHeader
                backLink={<button onClick={onBack} className="text-sm text-amber-400 hover:underline">&larr; Voltar para Projetos</button>}
                title={activeProject.title}
                actions={<Button onClick={addChapter}><PlusIcon/> Adicionar Capítulo</Button>}
            />
             {(activeProject.chapters || []).length === 0 ? (
                <EmptyState
                    title="Nenhum capítulo neste projeto ainda."
                    // FIX: Changed to single quotes to avoid JSX parsing issues with escaped double quotes.
                    subtitle='Clique em "Adicionar Capítulo" para começar a escrever.'
                />
            ) : (
                 <div className="space-y-4">
                    {(activeProject.chapters || []).map(chap => (
                        <div key={chap.id} className="bg-gray-700 rounded-lg p-4 flex justify-between items-center hover:bg-gray-600/50 transition-colors cursor-pointer" onClick={() => onSelectChapter(chap)}>
                           <div>
                                <h3 className="text-xl font-bold text-gray-100">{chap.title}</h3>
                           </div>
                           <div className="flex-shrink-0 ml-4">
                               <Button variant="secondary" onClick={(e) => {e.stopPropagation(); deleteChapter(chap.id)}} className="hover:bg-red-800/50 hover:text-red-300"><TrashIcon/></Button>
                           </div>
                        </div>
                    ))}
                </div>
            )}
        </PageContainer>
    );
};

export default ProjectChapterList;