import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import Dashboard from './components/Dashboard';

export default function App() {
  const [equipmentData, setEquipmentData] = useState(null);

  return (
    <main className="min-h-screen bg-brand-bg text-brand-textMain flex flex-col justify-start">
      {/* Global modern gradient radial background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(14,165,233,0.05),rgba(255,255,255,0))] pointer-events-none"></div>

      <div className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
        {!equipmentData ? (
          <FileUpload onDataLoaded={setEquipmentData} />
        ) : (
          <Dashboard data={equipmentData} onReset={() => setEquipmentData(null)} />
        )}
      </div>
      
      <footer className="w-full text-center py-6 text-xs text-brand-textMuted border-t border-brand-border bg-brand-surface relative z-10">
        &copy; {new Date().getFullYear()} Equipment Lifecycle Pipeline. Made with Equiply Light.
      </footer>
    </main>
  );
}
