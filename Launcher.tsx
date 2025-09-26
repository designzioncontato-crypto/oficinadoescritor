import React, { useState, useCallback, useRef, useEffect } from 'react';
import App from './App';
import type { Character, Plot, World, Project } from './types';
import { sanitizeData } from './utils/dataSanitizer';
import { UploadIcon } from './components/icons';

type ProjectData = {
    characters: Character[];
    plots: Plot[];
    worlds: World[];
    projects: Project[];
};

type AppState = 'LOADING_INITIAL' | 'LAUNCHER' | 'APP_ACTIVE';

const Launcher: React.FC = () => {
    const [projectData, setProjectData] = useState<ProjectData | null>(null);
    const [appState, setAppState] = useState<AppState>('LOADING_INITIAL');
    const [appKey, setAppKey] = useState<number>(1);
    const [error, setError] = useState<string | null>(null);
    const [isLoadingFile, setIsLoadingFile] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        try {
            const storedData = localStorage.getItem('oficina-do-escritor-data');
            if (storedData) {
                const parsed = JSON.parse(storedData);
                setProjectData(sanitizeData(parsed).data);
            }
        } catch (e) {
            console.error("Could not load initial data from localStorage", e);
            localStorage.removeItem('oficina-do-escritor-data');
        }
        setAppState('LAUNCHER');
    }, []);

    const handleNewProject = () => {
        const startNew = () => {
            localStorage.removeItem('oficina-do-escritor-data');
            const emptyData = sanitizeData(null).data;
            setProjectData(emptyData);
            setAppKey(Date.now()); // Force re-mount of App with new empty state
            setAppState('APP_ACTIVE');
        };

        if (projectData) {
            if (window.confirm("Você já tem um projeto salvo. Começar um novo projeto irá apagar os dados atuais. Deseja continuar?")) {
                startNew();
            }
        } else {
            startNew();
        }
    };

    const handleContinueProject = () => {
        if (projectData) {
            setAppState('APP_ACTIVE');
        } else {
            handleNewProject();
        }
    };

    const handleLoadProjectClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const processFile = useCallback((file: File) => {
        if (!file.type.includes('json')) {
            setError("Formato de arquivo inválido. Por favor, selecione um arquivo .JSON.");
            return;
        }
        setIsLoadingFile(true);
        setError(null);
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const content = e.target?.result as string;
                const parsedData = JSON.parse(content);
                const result = sanitizeData(parsedData);
                setProjectData(result.data);
                setAppKey(Date.now()); // Force re-mount of App with the new loaded state
                setAppState('APP_ACTIVE');
            } catch (err) {
                setError("Falha ao ler o arquivo. Verifique se o arquivo JSON está formatado corretamente.");
                console.error("Import error:", err);
            } finally {
                setIsLoadingFile(false);
            }
        };
        reader.onerror = () => {
            setError("Ocorreu um erro ao ler o arquivo.");
            setIsLoadingFile(false);
        };
        reader.readAsText(file);
    }, []);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (projectData) {
                if (window.confirm("Carregar um backup substituirá seu projeto salvo atualmente. Deseja continuar?")) {
                    processFile(file);
                }
            } else {
                processFile(file);
            }
        }
        event.target.value = ''; // Reset input
    };

    const renderLauncher = () => {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-800 text-gray-100 font-sans">
                <div className="w-full max-w-md p-8 space-y-8 bg-gray-900 rounded-2xl shadow-2xl text-center">
                    <div>
                        <h1 className="text-4xl font-bold text-white tracking-tighter">Oficina do Escritor</h1>
                        <p className="mt-2 text-gray-400">Dê vida aos seus mundos e histórias.</p>
                    </div>

                    {(isLoadingFile || appState === 'LOADING_INITIAL') ? (
                        <div className="flex flex-col items-center justify-center space-y-4">
                            <div className="loader"></div>
                            <p className="text-amber-400">Carregando...</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {projectData ? (
                                <button
                                    onClick={handleContinueProject}
                                    className="w-full flex items-center justify-center gap-2 px-5 py-3 text-base font-medium text-white bg-amber-600 border border-transparent rounded-md shadow-sm hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 focus:ring-offset-gray-900 transition-colors"
                                >
                                    Continuar Último Projeto
                                </button>
                            ) : (
                                 <button
                                    onClick={handleNewProject}
                                    className="w-full flex items-center justify-center gap-2 px-5 py-3 text-base font-medium text-white bg-amber-600 border border-transparent rounded-md shadow-sm hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 focus:ring-offset-gray-900 transition-colors"
                                >
                                    Novo Projeto
                                </button>
                            )}
                            
                            <div className="text-center text-sm text-gray-500">ou</div>
                            
                            <div className="flex gap-4">
                                {projectData && (
                                    <button
                                        onClick={handleNewProject}
                                        className="w-full flex items-center justify-center gap-2 px-5 py-3 text-sm font-medium text-gray-200 bg-gray-700 border border-gray-600 rounded-md shadow-sm hover:bg-gray-600 transition-colors"
                                    >
                                        Novo Projeto
                                    </button>
                                )}
                                <button
                                    onClick={handleLoadProjectClick}
                                    className="w-full flex items-center justify-center gap-2 px-5 py-3 text-sm font-medium text-gray-200 bg-gray-700 border border-gray-600 rounded-md shadow-sm hover:bg-gray-600 transition-colors"
                                >
                                    <UploadIcon />
                                    Carregar Backup
                                </button>
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="application/json"
                                className="hidden"
                            />
                        </div>
                    )}
                    {error && (
                        <div className="p-4 mt-4 text-sm text-red-300 bg-red-800/50 rounded-md">
                            <p>{error}</p>
                            <button onClick={() => { setError(null); if(projectData) return; localStorage.removeItem('oficina-do-escritor-data'); window.location.reload(); }} className="font-bold underline mt-2">
                               {projectData ? "OK" : "Limpar dados corrompidos e começar de novo"}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <>
            {/* The main App is rendered but hidden, preserving its state */}
            {projectData && (
                <div style={{ display: appState === 'APP_ACTIVE' ? 'flex' : 'none', height: '100vh', flexDirection: 'column' }}>
                    <App
                        key={appKey}
                        initialData={projectData}
                    />
                </div>
            )}
            
            {/* The Launcher UI is shown based on state */}
            {appState !== 'APP_ACTIVE' && renderLauncher()}
        </>
    );
};

export default Launcher;