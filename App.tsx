

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { View, Character, Plot, World, Article, Project, Chapter, ViewingArticle } from './types';
import {
  UserIcon, BookIcon, HomeIcon, GlobeIcon, PenIcon, DownloadIcon, SaveIcon
} from './components/icons';
import Dashboard from './components/Dashboard';
import CharacterLab from './components/CharacterLab';
import CharacterViewer from './components/CharacterViewer';
import CharacterForm from './components/CharacterForm';
import PlotArchitect from './components/PlotArchitect';
import PlotViewer from './components/PlotViewer';
import PlotForm from './components/PlotForm';
import WorldList from './components/WorldList';
import WorldForm from './components/WorldForm';
import WorldArticleList from './components/WorldArticleList';
import WorldDescriptionViewer from './components/WorldDescriptionViewer';
import ArticleViewer from './components/ArticleViewer';
import WorldArticleForm from './components/WorldArticleForm';
import ProjectList from './components/ProjectList';
import ProjectForm from './components/ProjectForm';
import ProjectChapterList from './components/ProjectChapterList';
import ChapterEditor from './components/ChapterEditor';

declare var jspdf: any;

const STORAGE_KEY = 'oficina-do-escritor-data';

const TopBar: React.FC<{
    view: View;
    navigateTo: (view: View) => void;
    onExport: () => void;
    isExporting: boolean;
    onBackup: () => void;
}> = ({ view, navigateTo, onExport, isExporting, onBackup }) => {
    const navItems = [
        { id: 'DASHBOARD', icon: HomeIcon, label: 'Painel', check: (v: View) => v === 'DASHBOARD' },
        { id: 'WORLD_BUILDER_LIST', icon: GlobeIcon, label: 'Mundos', check: (v: View) => v.startsWith('WORLD') },
        { id: 'PLOTS_LIST', icon: BookIcon, label: 'Enredos', check: (v: View) => v.startsWith('PLOT') },
        { id: 'CHARACTERS_LIST', icon: UserIcon, label: 'Personagens', check: (v: View) => v.startsWith('CHARACTER') },
        { id: 'DIGITAL_DESK', icon: PenIcon, label: 'Escrivaninha', check: (v: View) => v.startsWith('DIGITAL_DESK') || v.startsWith('PROJECT') || v.startsWith('CHAPTER') }
    ];

    return (
        <nav className="w-full bg-gray-900 px-8 py-2 flex justify-between items-center flex-shrink-0 shadow-md z-50">
            <div className="flex-1">
                <div className="text-2xl font-bold text-gray-100 tracking-tighter">OFICINA DO ESCRITOR</div>
            </div>
            <div className="flex gap-2 justify-center">
                {navItems.map(item => (
                    <button
                        key={item.id}
                        onClick={() => navigateTo(item.id as View)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-gray-400 hover:bg-gray-700 hover:text-gray-100 ${item.check(view) ? 'bg-amber-600 text-white' : ''}`}
                    >
                        <item.icon />
                        <span className="hidden sm:inline">{item.label}</span>
                    </button>
                ))}
            </div>
            <div className="flex-1 flex justify-end gap-2">
                 <button
                    onClick={onBackup}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-gray-400 hover:bg-gray-700 hover:text-gray-100"
                >
                    <SaveIcon />
                    <span className="hidden sm:inline">Backup</span>
                </button>
                <button
                    onClick={onExport}
                    disabled={isExporting}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-gray-400 hover:bg-gray-700 hover:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <DownloadIcon />
                    <span className="hidden sm:inline">PDF</span>
                </button>
            </div>
        </nav>
    );
};

interface AppProps {
  initialData: {
    characters: Character[];
    plots: Plot[];
    worlds: World[];
    projects: Project[];
  };
}

export default function App({ initialData }: AppProps) {
    const [view, setView] = useState<View>('DASHBOARD'); 
    
    // Data states
    const [characters, setCharacters] = useState<Character[]>(initialData.characters);
    const [plots, setPlots] = useState<Plot[]>(initialData.plots);
    const [worlds, setWorlds] = useState<World[]>(initialData.worlds);
    const [projects, setProjects] = useState<Project[]>(initialData.projects);
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
    
    // Save data to localStorage whenever it changes
    useEffect(() => {
        try {
            const dataToStore = JSON.stringify({ characters, plots, worlds, projects });
            localStorage.setItem(STORAGE_KEY, dataToStore);
        } catch (error) {
            console.error("Failed to save data to localStorage", error);
        }
    }, [characters, plots, worlds, projects]);

    // Selection/Viewing states
    const [selectedCharacter, setSelectedCharacter] = useState<Partial<Character> | null>(null);
    const [selectedPlot, setSelectedPlot] = useState<Partial<Plot> | null>(null);
    const [selectedWorld, setSelectedWorld] = useState<Partial<World> | null>(null);
    const [activeWorld, setActiveWorld] = useState<World | null>(null);
    const [selectedArticle, setSelectedArticle] = useState<Partial<Article> | null>(null);
    const [viewingArticle, setViewingArticle] = useState<ViewingArticle | null>(null);
    const [viewingCharacter, setViewingCharacter] = useState<Character | null>(null);
    const [viewingPlot, setViewingPlot] = useState<Plot | null>(null);
    const [selectedProject, setSelectedProject] = useState<Partial<Project> | null>(null);
    const [activeProject, setActiveProject] = useState<Project | null>(null);
    const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);

    // Navigation effects based on state changes
    useEffect(() => {
        if (selectedCharacter) setView('CHARACTERS_FORM');
        else if (view === 'CHARACTERS_FORM') setView('CHARACTERS_LIST');
    }, [selectedCharacter, view]);

    useEffect(() => {
        if (selectedPlot) setView('PLOTS_FORM');
        else if (view === 'PLOTS_FORM') setView('PLOTS_LIST');
    }, [selectedPlot, view]);
    
    useEffect(() => {
        if (selectedWorld) setView('WORLD_FORM');
        else if (view === 'WORLD_FORM') setView('WORLD_BUILDER_LIST');
    }, [selectedWorld, view]);

    useEffect(() => {
        if (activeWorld && !viewingArticle && !selectedArticle) setView('WORLD_ARTICLES_LIST');
    }, [activeWorld, viewingArticle, selectedArticle]);

    useEffect(() => {
        if (selectedArticle) setView('WORLD_ARTICLE_FORM');
        else if (view === 'WORLD_ARTICLE_FORM' && activeWorld) setView('WORLD_ARTICLES_LIST');
    }, [selectedArticle, view, activeWorld]);
    
    useEffect(() => { if (viewingArticle) setView('WORLD_ARTICLE_VIEW'); }, [viewingArticle]);
    useEffect(() => { if (viewingCharacter) setView('CHARACTER_VIEW'); }, [viewingCharacter]);
    useEffect(() => { if (viewingPlot) setView('PLOT_VIEW'); }, [viewingPlot]);
    useEffect(() => { if (view === 'WORLD_DESCRIPTION_VIEW' && !activeWorld) setView('WORLD_BUILDER_LIST'); }, [view, activeWorld]);

    useEffect(() => {
        if (selectedProject) setView('PROJECT_FORM');
        else if (view === 'PROJECT_FORM') setView('DIGITAL_DESK');
    }, [selectedProject, view]);

    useEffect(() => {
        if (activeProject && !selectedChapter) setView('PROJECT_CHAPTERS');
        else if (view === 'PROJECT_CHAPTERS' && !activeProject) setView('DIGITAL_DESK');
    }, [activeProject, selectedChapter, view]);

    useEffect(() => {
        if (selectedChapter) setView('CHAPTER_EDITOR');
        else if (view === 'CHAPTER_EDITOR' && activeProject) setView('PROJECT_CHAPTERS');
    }, [selectedChapter, view, activeProject]);

    // Keep active world/project in sync with main data array
    useEffect(() => {
        if (activeWorld) {
            const updatedActiveWorld = worlds.find(w => w.id === activeWorld.id);
            if (updatedActiveWorld) setActiveWorld(updatedActiveWorld);
            else { setActiveWorld(null); setView('WORLD_BUILDER_LIST'); }
        }
         if (activeProject) {
            const updated = projects.find(p => p.id === activeProject.id);
            if (updated) setActiveProject(updated);
            else { setActiveProject(null); setView('DIGITAL_DESK'); }
        }
    }, [worlds, projects, activeWorld, activeProject]);
    
    const allArticles = useMemo(() => worlds.flatMap(w => w.articles || []), [worlds]);

    const handleNavigateToArticle = useCallback((article: Article) => {
        const worldOfArticle = worlds.find(w => w.articles.some(a => a.id === article.id));
        setActiveWorld(worldOfArticle || null);
        setViewingArticle({ ...article, worldName: worldOfArticle?.name });
    }, [worlds]);
    
    const handleNavigateToCharacter = useCallback((character: Character) => {
        setViewingCharacter(character);
    }, []);

    const handleChapterUpdate = (updatedChapter: Chapter) => {
        setProjects(projs => projs.map(p => {
            if (p.id === activeProject?.id) {
                return {
                    ...p,
                    chapters: (p.chapters || []).map(c => c.id === updatedChapter.id ? updatedChapter : c)
                };
            }
            return p;
        }));
    };

    const navigateTo = (targetView: View) => {
        setSelectedCharacter(null);
        setSelectedPlot(null);
        setSelectedWorld(null);
        setActiveWorld(null);
        setSelectedArticle(null);
        setViewingArticle(null);
        setViewingCharacter(null);
        setViewingPlot(null);
        setSelectedProject(null);
        setActiveProject(null);
        setSelectedChapter(null);
        setView(targetView);
    };

    const generatePdf = async () => {
        setIsGeneratingPdf(true);
        try {
            const { jsPDF } = jspdf;
            const pdf = new jsPDF('p', 'pt', 'a4');

            const pageHeight = pdf.internal.pageSize.getHeight();
            const pageWidth = pdf.internal.pageSize.getWidth();
            const margin = 40;
            const contentWidth = pageWidth - margin * 2;
            let y = margin;

            const checkPageBreak = (neededHeight: number) => {
                if (y + neededHeight > pageHeight - margin) {
                    pdf.addPage();
                    y = margin;
                }
            };

            const addTitle = (text: string, size: number) => {
                checkPageBreak(size + 20);
                pdf.setFont('helvetica', 'bold').setFontSize(size);
                pdf.text(text, margin, y);
                y += size + 10;
            };

            const addSubTitle = (text: string, size: number) => {
                checkPageBreak(size + 10);
                pdf.setFont('helvetica', 'bold').setFontSize(size);
                pdf.text(text, margin, y);
                y += size + 5;
            };

            const addText = (text: string, isItalic = false) => {
                pdf.setFont('helvetica', isItalic ? 'italic' : 'normal').setFontSize(10);
                const lines = pdf.splitTextToSize(text || 'N/A', contentWidth);
                const textHeight = lines.length * 10 * 1.2;
                checkPageBreak(textHeight);
                pdf.text(lines, margin, y);
                y += textHeight + 5;
            };

            const addField = (label: string, value: any) => {
                if (!value) return;
                const text = String(value).trim();
                if (!text) return;

                pdf.setFont('helvetica', 'bold').setFontSize(10);
                const labelWidth = pdf.getStringUnitWidth(label + ': ') * 10 / pdf.internal.scaleFactor;
                
                pdf.setFont('helvetica', 'normal').setFontSize(10);
                const lines = pdf.splitTextToSize(text, contentWidth - labelWidth);
                const textHeight = lines.length * 10 * 1.2;
                checkPageBreak(textHeight);

                pdf.setFont('helvetica', 'bold');
                pdf.text(`${label}:`, margin, y);
                pdf.setFont('helvetica', 'normal');
                pdf.text(lines, margin + labelWidth, y);

                y += textHeight;
            };
            
            const addSectionBreak = () => {
                if (y > pageHeight - margin - 50) {
                    pdf.addPage();
                    y = margin;
                } else {
                    y += 20;
                    pdf.setDrawColor(200);
                    pdf.line(margin, y, pageWidth - margin, y);
                    y += 20;
                }
            };

            // --- PDF CONTENT ---

            pdf.setFontSize(28).setFont('helvetica', 'bold');
            pdf.text('Oficina do Escritor', pageWidth / 2, pageHeight / 2 - 20, { align: 'center' });
            pdf.setFontSize(16).setFont('helvetica', 'normal');
            pdf.text('Exportação de Dados', pageWidth / 2, pageHeight / 2 + 10, { align: 'center' });
            pdf.setFontSize(12);
            pdf.text(`Exportado em: ${new Date().toLocaleString()}`, pageWidth / 2, pageHeight / 2 + 40, { align: 'center' });

            if (worlds.length > 0) {
                pdf.addPage();
                y = margin;
                addTitle('Mundos', 22);
                worlds.forEach((world, index) => {
                    if (index > 0) addSectionBreak();
                    addSubTitle(world.name, 16);
                    addText(world.description);
                    if (world.articles && world.articles.length > 0) {
                        y += 10;
                        addSubTitle('Artigos', 12);
                        world.articles.forEach(article => {
                            y += 5;
                            pdf.setFont('helvetica', 'bold').setFontSize(11);
                            pdf.text(`${article.title} (${article.category})`, margin, y);
                            y += 14;
                            addText(article.content);
                        });
                    }
                });
            }

            if (characters.length > 0) {
                pdf.addPage();
                y = margin;
                addTitle('Personagens', 22);
                characters.forEach((char, index) => {
                    if (index > 0) addSectionBreak();
                    const worldName = char.worldId ? worlds.find(w => w.id === char.worldId)?.name : 'Geral';
                    addSubTitle(`${char.name} (${worldName})`, 16);
                    addField('Idade', char.age);
                    addField('Aparência', char.appearance);
                    addField('Arquétipo', char.archetype);
                    addField('Personalidade', char.personality);
                    addField('Motivação', char.motivation);
                    addField('Medos', char.fear);
                    addField('Segredos', char.secret);
                    addField('Afiliação', char.affiliation);
                    addField('Status Social', char.socialStatus);
                    addField('Inimigos e Aliados', char.enemiesAllies);
                    addField('Poderes', char.powers);
                    addField('Fraquezas', char.weaknesses);
                    addField('Equipamento', char.equipment);
                    if (char.backstory) {
                        y += 10;
                        addSubTitle('Backstory', 12);
                        addText(char.backstory);
                    }
                });
            }
            
            if (plots.length > 0) {
                 pdf.addPage();
                 y = margin;
                 addTitle('Enredos', 22);
                 plots.forEach((plot, index) => {
                     if (index > 0) addSectionBreak();
                     const worldName = plot.worldId ? worlds.find(w => w.id === plot.worldId)?.name : 'Geral';
                     addSubTitle(`${plot.title} (${worldName})`, 16);
                     if (plot.logline) {
                         addText(plot.logline, true);
                         y += 10;
                     }
                     if (!plot.threeActStructureHidden) {
                         if (plot.act1) { addSubTitle('Ato 1: A Apresentação', 12); addText(plot.act1); y+=5; }
                         if (plot.act2) { addSubTitle('Ato 2: A Confrontação', 12); addText(plot.act2); y+=5; }
                         if (plot.act3) { addSubTitle('Ato 3: A Resolução', 12); addText(plot.act3); y+=5; }
                     }
                 });
            }
            
            if (projects.length > 0) {
                pdf.addPage();
                y = margin;
                addTitle('Projetos de Escrita', 22);
                projects.forEach((project, index) => {
                    if (index > 0) addSectionBreak();
                    addSubTitle(project.title, 16);
                    (project.chapters || []).forEach(chapter => {
                        y += 10;
                        addSubTitle(chapter.title, 12);
                        addText(chapter.content);
                    });
                });
            }

            pdf.save('Oficina_do_Escritor_Export.pdf');
        } catch(error) {
            console.error("Error generating PDF:", error);
        } finally {
            setIsGeneratingPdf(false);
        }
    };
    
    const handleBackup = () => {
        try {
            const currentData = { characters, plots, worlds, projects };
            const jsonString = JSON.stringify(currentData, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `oficina-do-escritor_backup_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Failed to export JSON for backup:", error);
            alert("Ocorreu um erro ao criar o arquivo de backup.");
        }
    };

    const renderView = () => {
        switch (view) {
            case 'DASHBOARD':
                return <Dashboard charactersCount={characters.length} plotsCount={plots.length} worldsCount={worlds.length} projectsCount={projects.length} setView={setView} />;
            case 'CHARACTERS_LIST':
                return <CharacterLab characters={characters} setCharacters={setCharacters} onSelectCharacter={setSelectedCharacter} onViewCharacter={setViewingCharacter} worlds={worlds} />;
            case 'CHARACTER_VIEW':
                if (!viewingCharacter) return null;
                return <CharacterViewer character={viewingCharacter} onBack={() => { setViewingCharacter(null); setView('CHARACTERS_LIST'); }} onEdit={(char) => { setViewingCharacter(null); setSelectedCharacter(char); }} worlds={worlds} allArticles={allArticles} onNavigate={handleNavigateToArticle} />;
            case 'CHARACTERS_FORM':
                if (!selectedCharacter) return null;
                return <CharacterForm selectedCharacter={selectedCharacter} setCharacters={setCharacters} setSelectedCharacter={setSelectedCharacter} worlds={worlds} />;
            case 'PLOTS_LIST':
                return <PlotArchitect plots={plots} setPlots={setPlots} onSelectPlot={setSelectedPlot} onViewPlot={setViewingPlot} worlds={worlds} />;
             case 'PLOT_VIEW':
                if (!viewingPlot) return null;
                return <PlotViewer plot={viewingPlot} onBack={() => { setViewingPlot(null); setView('PLOTS_LIST'); }} onEdit={(plot) => { setViewingPlot(null); setSelectedPlot(plot); }} worlds={worlds} allArticles={allArticles} onNavigate={handleNavigateToArticle} allCharacters={characters} onNavigateToCharacter={handleNavigateToCharacter} />;
            case 'PLOTS_FORM':
                if (!selectedPlot) return null;
                 return <PlotForm selectedPlot={selectedPlot} setPlots={setPlots} setSelectedPlot={setSelectedPlot} worlds={worlds} characters={characters} />;
            case 'WORLD_BUILDER_LIST': 
                return <WorldList worlds={worlds} setWorlds={setWorlds} onSelectWorld={setActiveWorld} onEditWorld={setSelectedWorld} />;
            case 'WORLD_FORM':
                if (!selectedWorld) return null;
                return <WorldForm selectedWorld={selectedWorld} setWorlds={setWorlds} setSelectedWorld={setSelectedWorld} />;
            case 'WORLD_ARTICLES_LIST':
                if (!activeWorld) return null;
                return <WorldArticleList selectedWorld={activeWorld} setWorlds={setWorlds} onSelectArticle={setSelectedArticle} onViewArticle={handleNavigateToArticle} onBack={() => { setActiveWorld(null); setView('WORLD_BUILDER_LIST'); }} onViewDescription={() => setView('WORLD_DESCRIPTION_VIEW')} />;
            case 'WORLD_DESCRIPTION_VIEW':
                if (!activeWorld) return null;
                return <WorldDescriptionViewer world={activeWorld} allArticles={activeWorld?.articles || []} onNavigate={handleNavigateToArticle} onBack={() => setView('WORLD_ARTICLES_LIST')} />;
            case 'WORLD_ARTICLE_VIEW':
                if (!viewingArticle) return null;
                return <ArticleViewer article={viewingArticle} allArticles={activeWorld?.articles || []} allCharacters={characters} onNavigate={handleNavigateToArticle} onNavigateToCharacter={handleNavigateToCharacter} onBack={() => { setViewingArticle(null); setView('WORLD_ARTICLES_LIST'); }} onEdit={(article) => { setViewingArticle(null); setSelectedArticle(article); }} />;
            case 'WORLD_ARTICLE_FORM': 
                if (!selectedArticle || !activeWorld) return null;
                return <WorldArticleForm selectedArticle={selectedArticle} selectedWorld={activeWorld} setWorlds={setWorlds} setSelectedArticle={setSelectedArticle} characters={characters} />;
            case 'DIGITAL_DESK':
                return <ProjectList projects={projects} setProjects={setProjects} onEditProject={setSelectedProject} onSelectProject={setActiveProject} />;
            case 'PROJECT_FORM':
                if (!selectedProject) return null;
                return <ProjectForm selectedProject={selectedProject} setProjects={setProjects} setSelectedProject={setSelectedProject} />;
            case 'PROJECT_CHAPTERS':
                if (!activeProject) return null;
                return <ProjectChapterList activeProject={activeProject} setProjects={setProjects} onSelectChapter={setSelectedChapter} onBack={() => setActiveProject(null)} />;
            case 'CHAPTER_EDITOR':
                if (!selectedChapter) return null;
                 return <ChapterEditor chapter={selectedChapter} onSave={handleChapterUpdate} onBack={() => setSelectedChapter(null)} />;
            default:
                return <Dashboard charactersCount={characters.length} plotsCount={plots.length} worldsCount={worlds.length} projectsCount={projects.length} setView={setView} />;
        }
    };

    return (
        <div className={`flex flex-col h-full ${view === 'CHAPTER_EDITOR' ? 'bg-gray-700' : 'bg-gray-800'}`}>
            {view !== 'CHAPTER_EDITOR' && <TopBar view={view} navigateTo={navigateTo} onExport={generatePdf} isExporting={isGeneratingPdf} onBackup={handleBackup} />}
            
            {isGeneratingPdf && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex flex-col justify-center items-center z-[100]">
                    <div className="loader"></div>
                    <p className="text-white mt-4 text-lg">Gerando seu PDF, por favor aguarde...</p>
                </div>
            )}
            <main className={`flex-grow overflow-y-auto ${view === 'CHAPTER_EDITOR' ? 'p-0' : 'p-0 sm:p-8'}`}>
                {renderView()}
            </main>
        </div>
    );
}