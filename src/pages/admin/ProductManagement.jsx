import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import api from '../../api/axiosInstance';

const empty = { name: '', description: '', price: '', category: '', image: '', stock: '', brand: '' };

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const user = useSelector((state) => state.auth.user);

  const load = async () => {
    try { const { data } = await api.get('/products', { params: { limit: 50 } }); setProducts(data.data.items); } catch (e) { setError(e.response?.data?.message || 'Unable to load products'); }
  };
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault(); setError(''); setMessage('');
    try {
      const payload = { ...form, price: Number(form.price), stock: Number(form.stock) };
      if (editingId) await api.patch(`/products/${editingId}`, payload); else await api.post('/products', payload);
      setForm(empty); setEditingId(null); setMessage(editingId ? 'Product updated' : 'Product created'); load();
    } catch (e2) { setError(e2.response?.data?.message || 'Operation failed'); }
  };

  const edit = (product) => setForm({ name: product.name, description: product.description, price: product.price, category: product.category, image: product.image, stock: product.stock, brand: product.brand || '' });
  const remove = async (id) => { if (!window.confirm('Delete this product?')) return; try { await api.delete(`/products/${id}`); load(); } catch (e) { setError(e.response?.data?.message || 'Delete failed'); } };

  return <section className="space-y-6"><div><h1 className="text-3xl font-black">Product Management</h1><p className="mt-1 text-slate-500">Signed in as {user?.email}.</p></div><form onSubmit={submit} className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-5 md:grid-cols-2"><input required placeholder="Product name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded-xl border p-3" /><input required placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="rounded-xl border p-3" /><input required type="number" min="0" step="0.01" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="rounded-xl border p-3" /><input required type="number" min="0" placeholder="Stock" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="rounded-xl border p-3" /><input required placeholder="Image URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="rounded-xl border p-3 md:col-span-2" /><input placeholder="Brand" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} className="rounded-xl border p-3" /><textarea required minLength={5} placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="rounded-xl border p-3 md:col-span-2" rows="4" /><div className="md:col-span-2 flex gap-3"><button className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white">{editingId ? 'Update product' : 'Create product'}</button>{editingId && <button type="button" onClick={() => { setEditingId(null); setForm(empty); }} className="rounded-xl border px-5 py-3 font-semibold">Cancel</button>}</div></form>{message && <p className="rounded-xl bg-green-50 p-3 text-green-700">{message}</p>}{error && <p className="rounded-xl bg-red-50 p-3 text-red-700">{error}</p>}<div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white"><table className="min-w-full text-left text-sm"><thead className="border-b bg-slate-50"><tr><th className="p-4">Product</th><th className="p-4">Price</th><th className="p-4">Stock</th><th className="p-4">Actions</th></tr></thead><tbody>{products.map((product) => <tr key={product._id} className="border-b last:border-0"><td className="p-4"><div className="flex items-center gap-3"><img src={product.image} alt="" className="h-12 w-12 rounded-lg object-cover" /><div><p className="font-semibold">{product.name}</p><p className="text-xs text-slate-400">{product.category}</p></div></div></td><td className="p-4">₹{product.price.toLocaleString('en-IN')}</td><td className="p-4">{product.stock}</td><td className="space-x-2 p-4"><button onClick={() => { edit(product); setEditingId(product._id); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="rounded-lg border px-3 py-2">Edit</button><button onClick={() => remove(product._id)} className="rounded-lg bg-red-50 px-3 py-2 text-red-700">Delete</button></td></tr>)}</tbody></table></div></section>;
};

export default ProductManagement;
