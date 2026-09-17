import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { resetPassword } from '../redux/thunks/authThunks';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, message } = useSelector((state) => state.auth);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  useEffect(() => {
    if (message?.toLowerCase().includes('password updated')) {
      const timer = setTimeout(() => navigate('/login', { replace: true }), 1500);
      return () => clearTimeout(timer);
    }
  }, [message, navigate]);

  const submit = async (e) => {
    e.preventDefault();
    if (password !== confirm) return;
    await dispatch(resetPassword({ token, newPassword: password }));
  };

  return <div className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"><h1 className="text-3xl font-black">Choose a new password</h1><p className="mt-2 text-slate-500">The reset link is single-use and expires shortly.</p>{error && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}{message && <p className="mt-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">{message}</p>}<form onSubmit={submit} className="mt-6 space-y-4"><input required minLength={8} type="password" placeholder="New password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3" /><input required minLength={8} type="password" placeholder="Confirm new password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3" />{password && confirm && password !== confirm && <p className="text-sm text-red-600">Passwords do not match.</p>}<button disabled={loading || password !== confirm} className="w-full rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white disabled:opacity-50">{loading ? 'Updating...' : 'Update password'}</button></form><p className="mt-6 text-sm text-slate-500"><Link to="/login" className="font-semibold text-indigo-600">Back to login</Link></p></div>;
};
export default ResetPassword;
