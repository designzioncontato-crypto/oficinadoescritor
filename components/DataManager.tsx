import React, { useState, useCallback } from 'react';
import type { Character, Plot, World, Project } from '../types';
import { sanitizeData, SanitizationResult } from '../utils/dataSanitizer';
import { XIcon, DownloadIcon, UploadIcon } from './icons';
import { Button } from './ui';

const IMPORT_STORAGE_KEY = 'pending-project-import';

interface DataManagerProps {
    isOpen: boolean;
    onClose: () => void;
    currentData: {
        characters: Character[];
        plots: Plot[];
        worlds: World[];
        projects: Project[];
    };
}

type ImportStatus = 'idle' | 'processing' | 'success' | 'error' | 'loading';

const DataManager: React.FC<DataManagerProps> = ({ isOpen, onClose, currentData }) => {
    const [status, setStatus] = useState<ImportStatus>('idle');
    const [sanitizationResult, setSanitizationResult] = useState<SanitizationResult | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [isDragging, setIsDragging] = useState(false);

    const resetState = useCallback(() => {
        setStatus('idle');
        setSanitizationResult(null);
        setErrorMessage('');
    }, []);

    const handleClose = () => {
        resetState();
        onClose();
    };
    
    const handleExportJson = () => {
        try {
            const jsonString = JSON.stringify(currentData, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'oficina-do-escritor_export.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Failed to export JSON:", error);
            alert("Ocorreu um erro ao exportar os dados para JSON.");
        }
    };

    const processFile = (file: File) => {
        if (!file.type.includes('json')) {
            setErrorMessage("Formato de arquivo inválido. Por favor, selecione um arquivo .JSON.");
            setStatus('error');
            return;
        }

        setStatus('processing');
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const content = e.target?.result as string;
                const parsedData = JSON.parse(content);
                const result = sanitizeData(parsedData);
                setSanitizationResult(result);
                setStatus('success');
            } catch (error) {
                setErrorMessage("Falha ao ler o arquivo. Verifique se o arquivo JSON está formatado corretamente.");
                setStatus('error');
                console.error("Import error:", error);
            }
        };
        reader.onerror = () => {
             setErrorMessage("Ocorreu um erro ao ler o arquivo.");
             setStatus('error');
        };
        reader.readAsText(file);
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            processFile(file);
        }
        event.target.value = ''; // Reset input to allow re-uploading the same file
    };
    
    const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(false);
        const file = event.dataTransfer.files?.[0];
        if (file) {
            processFile(file);
        }
    };
    
    const handleDragEvents = (event: React.DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
        event.stopPropagation();
        if (event.type === 'dragenter' || event.type === 'dragover') {
            setIsDragging(true);
        } else if (event.type === 'dragleave') {
            setIsDragging(false);
        }
    };

    const handleConfirmImport = () => {
        if (sanitizationResult) {
            if (window.confirm("Atenção: Carregar este projeto substituirá todos os dados atuais. A página será recarregada. Deseja continuar?")) {
                try {
                    setStatus('loading');
                    // Save the sanitized data to session storage.
                    sessionStorage.setItem(IMPORT_STORAGE_KEY, JSON.stringify(sanitizationResult.data));
                    // Force a page reload. The App component will handle loading from session storage.
                    window.location.reload();
                } catch (error) {
                    console.error("Failed to stage data for import:", error);
                    setErrorMessage("Ocorreu um erro crítico ao preparar os dados para importação.");
                    setStatus('error');
                }
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-gray-900 bg-opacity-95 backdrop-blur-sm flex flex-col animate-fade-in" aria-modal="true" role="dialog">
            <div className="flex-shrink-0 px-8 py-4 flex justify-between items-center border-b border-gray-700">
                <h1 className="text-2xl font-bold text-amber-400">Central de Importação e Exportação</h1>
                <button onClick={handleClose} className="text-gray-400 hover:text-white transition-colors" aria-label="Fechar"><XIcon /></button>
            </div>
            <div className="flex-grow p-8 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Export Section */}
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 flex flex-col justify-center items-center text-center">
                    <h2 className="text-3xl font-semibold mb-4 text-white">Exportar Projeto</h2>
                    <p className="text-gray-400 mb-8 max-w-sm">
                        Salve uma cópia de segurança de todo o seu trabalho. Um único arquivo .JSON será baixado para o seu computador.
                    </p>
                    <Button onClick={handleExportJson} className="w-full max-w-xs">
                        <DownloadIcon />
                        Baixar Arquivo de Backup
                    </Button>
                </div>

                {/* Import Section */}
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 flex flex-col justify-center items-center text-center">
                     <h2 className="text-3xl font-semibold mb-4 text-white">Importar Projeto</h2>
                     {status === 'idle' && (
                        <>
                            <p className="text-gray-400 mb-6 max-w-sm">Arraste e solte um arquivo .JSON ou clique para selecionar.</p>
                            <label
                                onDrop={handleDrop}
                                onDragOver={handleDragEvents}
                                onDragEnter={handleDragEvents}
                                onDragLeave={handleDragEvents}
                                className={`w-full max-w-xs p-10 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${isDragging ? 'border-amber-500 bg-gray-700/50' : 'border-gray-600 hover:border-gray-500'}`}
                            >
                                <div className="flex flex-col items-center pointer-events-none">
                                    <UploadIcon />
                                    <span className="mt-2 text-sm text-gray-400">Selecionar Arquivo</span>
                                </div>
                                <input type="file" accept="application/json" onChange={handleFileChange} className="hidden" />
                            </label>
                        </>
                     )}
                     {status === 'processing' && <p className="text-amber-400">Analisando arquivo...</p>}
                     {status === 'loading' && <p className="text-amber-400">Carregando novo projeto...</p>}
                     {status === 'error' && (
                        <div className="w-full">
                            <p className="text-red-400 mb-4">{errorMessage}</p>
                            <Button onClick={resetState} variant="secondary">Tentar Novamente</Button>
                        </div>
                     )}
                     {status === 'success' && sanitizationResult && (
                        <div className="w-full flex flex-col items-center gap-4">
                            <h3 className="text-xl font-bold text-green-400">Arquivo Válido!</h3>
                             <div className="text-left bg-gray-700 p-4 rounded-md w-full max-w-xs">
                                <p><strong>Resumo do Projeto:</strong></p>
                                <ul className="list-disc list-inside text-gray-300">
                                    <li>Mundos: {sanitizationResult.data.worlds.length}</li>
                                    <li>Personagens: {sanitizationResult.data.characters.length}</li>
                                    <li>Enredos: {sanitizationResult.data.plots.length}</li>
                                    <li>Projetos: {sanitizationResult.data.projects.length}</li>
                                </ul>
                                {sanitizationResult.issuesFound > 0 && (
                                    <p className="text-xs text-amber-400 mt-2">{sanitizationResult.issuesFound} problemas de integridade foram corrigidos.</p>
                                )}
                            </div>
                            <Button onClick={handleConfirmImport} className="w-full max-w-xs">Carregar este Projeto</Button>
                            <Button onClick={resetState} variant="secondary" className="w-full max-w-xs">Cancelar</Button>
                        </div>
                     )}
                </div>
            </div>
        </div>
    );
};

export default DataManager;