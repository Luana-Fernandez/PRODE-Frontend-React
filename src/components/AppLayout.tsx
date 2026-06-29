import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';

export function AppLayout() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="app-main">
        <div className="container py-4">
          <Outlet />
        </div>
      </main>
      <footer className="text-center text-secondary small py-4 font-mono opacity-50">
        PRODE — UTN Villa María — Programación IV
      </footer>
    </div>
  );
}