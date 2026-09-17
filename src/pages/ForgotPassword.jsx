import { useState } from 'react';
import { Link } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { forgotPassword } from '../redux/thunks/authThunks';

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const { loading, error, message } = useSelector((state) => state.auth);
  const [email, setEmail] = useState('');
  const [developmentUrl, setDevelopmentUrl] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    const result = await dispatch(forgotPassword(email));
    if (forgotPassword.fulfilled.match(result)) setDevelopmentUrl(result.payload.data?.developmentUrl || '');
  };

  return <div className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"><h1 className="text-3xl font-black">Forgot password</h1><p className="mt-2 text-slate-500">Enter your account email and we will send a one-time reset link.</p>{error && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}{message && <div className="mt-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">{message}</div>}<form onSubmit={submit} className="mt-6 space-y-4"><input required type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3" /><button disabled={loading} className="w-full rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white disabled:opacity-50">{loading ? 'Sending...' : 'Send reset link'}</button></form>{developmentUrl && <p className="mt-4 break-all rounded-lg bg-slate-100 p-3 text-xs text-slate-700">Development reset URL: {developmentUrl}</p>}<p className="mt-6 text-sm text-slate-500"><Link to="/login" className="font-semibold text-indigo-600">Back to login</Link></p></div>;
};
export default ForgotPassword;
