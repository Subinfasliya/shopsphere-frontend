import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../redux/thunks/authThunks';
import PasswordField from '../components/PasswordField';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  useEffect(() => { if (isAuthenticated) navigate('/', { replace: true }); }, [isAuthenticated, navigate]);

  const submit = (event) => { event.preventDefault(); dispatch(registerUser(form)); };

  return (
    <div className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <h1 className="text-3xl font-black">Create your account</h1>
      <p className="mt-2 text-slate-500">Start shopping in a few seconds.</p>
      {error && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <form onSubmit={submit} className="mt-6 space-y-4">
        <input required minLength={2} placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-xl border border-slate-200 px-4 py-3" />
        <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-xl border border-slate-200 px-4 py-3" />
        <PasswordField placeholder="Password (8+ characters)" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button disabled={loading} className="w-full rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white hover:bg-indigo-700 disabled:opacity-50">{loading ? 'Creating...' : 'Register'}</button>
      </form>
      <p className="mt-6 text-sm text-slate-500">Already registered? <Link to="/login" className="font-semibold text-indigo-600">Login</Link></p>
    </div>
  );
};

export default Register;
