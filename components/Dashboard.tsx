import React from 'react';
import type { View } from '../types';

interface DashboardProps {
  charactersCount: number;
  plotsCount: number;
  worldsCount: number;
  projectsCount: number;
  setView: (view: View) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ charactersCount, plotsCount, worldsCount, projectsCount, setView }) => {
  return (
    <div className="w-full max-w-7xl mx-auto animate-fade-in text-white">
      <h1 className="text-center text-4xl sm:text-5xl font-bold mb-2">Bem-vindo à sua Oficina</h1>
      <p className="text-center text-lg text-gray-400 mb-10">Seu parceiro criativo digital para dar vida a mundos e histórias.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-700 p-6 rounded-xl flex flex-col text-center shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Mundos</h2>
          <p className="text-5xl font-bold text-amber-400">{worldsCount}</p>
          <p className="text-gray-400 mb-6">mundos criados</p>
          <button onClick={() => setView('WORLD_BUILDER_LIST')} className="mt-auto w-full justify-center bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 px-4 rounded-lg transition-colors">
            Construir Mundos
          </button>
        </div>
        <div className="bg-gray-700 p-6 rounded-xl flex flex-col text-center shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Enredos</h2>
          <p className="text-5xl font-bold text-amber-400">{plotsCount}</p>
          <p className="text-gray-400 mb-6">histórias em andamento</p>
          <button onClick={() => setView('PLOTS_LIST')} className="mt-auto w-full justify-center bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 px-4 rounded-lg transition-colors">
            Estruturar Enredos
          </button>
        </div>
        <div className="bg-gray-700 p-6 rounded-xl flex flex-col text-center shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Personagens</h2>
          <p className="text-5xl font-bold text-amber-400">{charactersCount}</p>
          <p className="text-gray-400 mb-6">criações únicas</p>
          <button onClick={() => setView('CHARACTERS_LIST')} className="mt-auto w-full justify-center bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 px-4 rounded-lg transition-colors">
            Gerenciar Personagens
          </button>
        </div>
        <div className="bg-gray-700 p-6 rounded-xl flex flex-col text-center shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Livros</h2>
          <p className="text-5xl font-bold text-amber-400">{projectsCount}</p>
          <p className="text-gray-400 mb-6">livros sendo escritos</p>
          <button onClick={() => setView('DIGITAL_DESK')} className="mt-auto w-full justify-center bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 px-4 rounded-lg transition-colors">
            Gerenciar Livros
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;