import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile, changePassword } from '../redux/thunks/authThunks';

const Profile = () => {
  const dispatch = useDispatch();
  const { user, loading, error, message } = useSelector((state) => state.auth);
  const [form, setForm] = useState(null);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' });

  useEffect(() => { if (user) setForm({ name: user.name, phone: user.phone || '', address: { ...(user.address || {}) } }); }, [user]);
  if (!form) return null;

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));
  const updateAddress = (key, value) => setForm((prev) => ({ ...prev, address: { ...prev.address, [key]: value } }));
  const submitProfile = (e) => { e.preventDefault(); dispatch(updateProfile(form)); };
  const submitPassword = async (e) => { e.preventDefault(); await dispatch(changePassword(passwordForm)); };

  return <div className="mx-auto max-w-2xl space-y-6"><div><h1 className="text-3xl font-black">Profile & Security</h1><p className="mt-1 text-slate-500">Your account, session and cart are managed by the backend.</p></div>{error && <p className="rounded-lg bg-red-50 p-3 text-red-700">{error}</p>}{message && <p className="rounded-lg bg-emerald-50 p-3 text-emerald-700">{message}</p>}<form onSubmit={submitProfile} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6"><h2 className="text-xl font-bold">Personal details</h2><input required value={form.name} onChange={(e) => update('name', e.target.value)} className="w-full rounded-xl border p-3" placeholder="Name" /><input value={user.email} disabled className="w-full rounded-xl border bg-slate-50 p-3 text-slate-500" /><input value={form.phone} onChange={(e) => update('phone', e.target.value)} className="w-full rounded-xl border p-3" placeholder="Phone" /><div className="grid gap-4 md:grid-cols-2"><input value={form.address.street || ''} onChange={(e) => updateAddress('street', e.target.value)} className="rounded-xl border p-3" placeholder="Street" /><input value={form.address.city || ''} onChange={(e) => updateAddress('city', e.target.value)} className="rounded-xl border p-3" placeholder="City" /><input value={form.address.state || ''} onChange={(e) => updateAddress('state', e.target.value)} className="rounded-xl border p-3" placeholder="State" /><input value={form.address.postalCode || ''} onChange={(e) => updateAddress('postalCode', e.target.value)} className="rounded-xl border p-3" placeholder="Postal code" /></div><button disabled={loading} className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white disabled:opacity-50">Save profile</button></form><form onSubmit={submitPassword} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6"><h2 className="text-xl font-bold">Change password</h2><p className="text-sm text-slate-500">Changing your password revokes all refresh sessions and requires you to sign in again.</p><input required type="password" placeholder="Current password" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm((p) => ({ ...p, currentPassword: e.target.value }))} className="w-full rounded-xl border p-3" /><input required minLength={8} type="password" placeholder="New password" value={passwordForm.newPassword} onChange={(e) => setPasswordForm((p) => ({ ...p, newPassword: e.target.value }))} className="w-full rounded-xl border p-3" /><button disabled={loading} className="rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white disabled:opacity-50">Update password</button></form></div>;
};
export default Profile;
