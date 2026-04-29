import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div className="min-h-screen bg-[#F9F9F9] flex flex-col">
      <Navbar />
      <main className="w-full max-w-[860px] mx-auto px-3 sm:px-6 pt-7 pb-16 bg-transparent flex-1">
        <Outlet />
      </main>
    </div>
  );
}