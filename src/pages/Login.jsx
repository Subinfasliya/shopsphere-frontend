import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../redux/thunks/authThunks';
import { clearAuthError } from '../redux/slices/authSlice';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ email: '', password: '' });

  useEffect(() => { if (isAuthenticated) navigate(location.state?.from || '/', { replace: true }); }, [isAuthenticated, navigate, location.state]);
  useEffect(() => () => dispatch(clearAuthError()), [dispatch]);

  const submit = async (event) => {
    event.preventDefault();
    dispatch(loginUser(form));
  };

  return (
    <div className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <h1 className="text-3xl font-black">Welcome back</h1>
      <p className="mt-2 text-slate-500">Login to continue shopping.</p>
      {error && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <form onSubmit={submit} className="mt-6 space-y-4">
        <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-xl border border-slate-200 px-4 py-3" />
        <input required minLength={8} type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full rounded-xl border border-slate-200 px-4 py-3" />
        <button disabled={loading} className="w-full rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white hover:bg-indigo-700 disabled:opacity-50">{loading ? 'Signing in...' : 'Login'}</button>
      </form>
      <div className="mt-6 flex items-center justify-between gap-4 text-sm text-slate-500"><Link to="/forgot-password" className="font-semibold text-indigo-600">Forgot password?</Link><span>New here? <Link to="/register" className="font-semibold text-indigo-600">Create an account</Link></span></div>
    </div>
  );
};

export default Login;
