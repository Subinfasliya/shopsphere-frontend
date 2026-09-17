import { Outlet } from 'react-router';
import Navbar from './Navbar';
import Footer from './Footer';

const AppLayout = () => (
  <div className="min-h-screen bg-slate-50">
    <Navbar />
    <main className="mx-auto max-w-7xl px-4 py-8 lg:px-6"><Outlet /></main>
    <Footer />
  </div>
);

export default AppLayout;
