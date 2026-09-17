import { Link } from 'react-router';

const Footer = () => (
  <footer className="mt-16 border-t border-slate-200 bg-white">
    <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-slate-500 md:flex-row md:items-center md:justify-between lg:px-6">
      <p>© {new Date().getFullYear()} ShopSphere. All rights reserved.</p>
      <div className="flex gap-4"><Link to="/contact">Contact</Link><span>Terms</span><span>Privacy</span></div>
    </div>
  </footer>
);

export default Footer;
