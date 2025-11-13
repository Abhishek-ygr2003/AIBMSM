
import React from 'react';
import Dashboard from './components/Dashboard';
import Header from './components/Header';

function App() {
  return (
    <div className="bg-black min-h-screen text-gray-200 font-sans">
      <Header />
      <main className="p-4 sm:p-6 lg:p-8">
        <Dashboard />
      </main>
    </div>
  );
}

export default App;
