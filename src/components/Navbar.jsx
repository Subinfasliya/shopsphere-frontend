import { Link, NavLink, useNavigate } from 'react-router';
import { AlertTriangle, Heart, LogOut, Menu, ShieldCheck, ShoppingCart, UserCircle, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../redux/thunks/authThunks';
import { clearLocalCart } from '../redux/slices/cartSlice';
import { clearAuthState } from '../redux/slices/authSlice';

const LogoutDialog = ({ loading, onCancel, onConfirm }) => {
  useEffect(() => {
    const onKeyDown = (event) => { if (event.key === 'Escape' && !loading) onCancel(); };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [loading, onCancel]);

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 px-4 py-6" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget && !loading) onCancel(); }}>
      <div role="alertdialog" aria-modal="true" aria-labelledby="logout-title" aria-describedby="logout-description" className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
        <button type="button" disabled={loading} onClick={onCancel} aria-label="Close logout confirmation" className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"><X size={18} /></button>
        <AlertTriangle className="text-amber-500" size={24} />
        <h2 id="logout-title" className="mt-4 text-xl font-black">Log out of ShopSphere?</h2>
        <p id="logout-description" className="mt-2 text-sm leading-6 text-slate-500">Your current session will be ended on this device.</p>
        <div className="mt-6 flex justify-end gap-3"><button type="button" disabled={loading} onClick={onCancel} className="rounded-xl border px-4 py-2.5 font-semibold">Cancel</button><button type="button" disabled={loading} onClick={onConfirm} className="rounded-xl bg-red-600 px-4 py-2.5 font-semibold text-white disabled:opacity-50">{loading ? 'Logging out...' : 'Log out'}</button></div>
      </div>
    </div>,
    document.body
  );
};

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const cartCount = useSelector((state) => state.cart.items.reduce((sum, item) => sum + item.quantity, 0));
  const wishlistCount = useSelector((state) => state.wishlist.items.length);

  const logout = async () => {
    setLogoutLoading(true);
    try { await dispatch(logoutUser()).unwrap(); }
    finally {
      dispatch(clearAuthState()); dispatch(clearLocalCart());
      navigate('/login', { replace: true });
      setOpen(false); setConfirmLogout(false); setLogoutLoading(false);
    }
  };

  const nav = ({ isActive }) => `text-sm font-medium ${isActive ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-600'}`;
  const closeMenu = () => setOpen(false);
  const askLogout = () => { setOpen(false); setConfirmLogout(true); };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 lg:px-6">
          <Link to="/" className="text-xl font-black tracking-tight text-indigo-600">ShopSphere</Link>
          <nav className="hidden items-center gap-5 md:flex">
            <NavLink to="/" end className={nav}>Home</NavLink>
            <NavLink to="/contact" className={nav}>Contact</NavLink>
            {isAuthenticated && <><NavLink to="/orders" className={nav}>Orders</NavLink><NavLink to="/wishlist" className={nav}>Wishlist</NavLink></>}
            {user?.role === 'admin' && <NavLink to="/admin" className={nav}>Admin</NavLink>}
          </nav>
          <div className="flex items-center gap-1">
            <Link to={isAuthenticated ? '/wishlist' : '/login'} className="relative hidden rounded-lg p-2 text-slate-700 hover:bg-slate-100 sm:block" aria-label="Wishlist"><Heart size={19} />{wishlistCount > 0 && <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-rose-500 px-1 text-center text-xs font-bold text-white">{wishlistCount}</span>}</Link>
            <Link to={isAuthenticated ? '/cart' : '/login'} className="relative rounded-lg p-2 text-slate-700 hover:bg-slate-100" aria-label="Cart"><ShoppingCart size={20} />{cartCount > 0 && <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-indigo-600 px-1 text-center text-xs font-bold text-white">{cartCount}</span>}</Link>
            {isAuthenticated ? <>
              <Link to="/profile" className="hidden rounded-lg p-2 text-slate-700 hover:bg-slate-100 sm:block" aria-label="Profile"><UserCircle size={20} /></Link>
              {user?.role === 'admin' && <Link to="/admin" className="hidden rounded-lg p-2 text-slate-700 hover:bg-slate-100 sm:block" aria-label="Admin"><ShieldCheck size={20} /></Link>}
              <button onClick={() => setConfirmLogout(true)} className="hidden rounded-lg p-2 text-slate-700 hover:bg-slate-100 sm:block" aria-label="Logout"><LogOut size={20} /></button>
            </> : <Link to="/login" className="hidden rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 sm:block">Login</Link>}
            <button onClick={() => setOpen(!open)} className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 md:hidden" aria-label="Menu">{open ? <X size={21} /> : <Menu size={21} />}</button>
          </div>
        </div>
        {open && <div className="border-t border-slate-200 bg-white px-4 py-4 md:hidden"><div className="grid gap-3"><NavLink to="/" end className={nav} onClick={closeMenu}>Home</NavLink><NavLink to="/contact" className={nav} onClick={closeMenu}>Contact</NavLink>{isAuthenticated && <><NavLink to="/orders" className={nav} onClick={closeMenu}>Orders</NavLink><NavLink to="/wishlist" className={nav} onClick={closeMenu}>Wishlist</NavLink><NavLink to="/profile" className={nav} onClick={closeMenu}>Profile</NavLink><button onClick={askLogout} className="text-left text-sm font-medium text-red-600">Logout</button></>}{!isAuthenticated && <Link to="/login" onClick={closeMenu} className="font-semibold text-indigo-600">Login</Link>}</div></div>}
      </header>
      {confirmLogout && <LogoutDialog loading={logoutLoading} onCancel={() => setConfirmLogout(false)} onConfirm={logout} />}
    </>
  );
};

export default Navbar;
