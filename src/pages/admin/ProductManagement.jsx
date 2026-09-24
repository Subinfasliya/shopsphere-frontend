import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import api from '../../api/axiosInstance';
import { useToast } from '../../components/ToastProvider';

const empty = { name: '', description: '', price: '', category: '', image: '', stock: '', brand: '' };

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [pendingImagePublicId, setPendingImagePublicId] = useState('');
  const user = useSelector((state) => state.auth.user);
  const { showToast } = useToast();

  const load = async () => {
    try {
      const { data } = await api.get('/products', { params: { limit: 50 } });
      setProducts(data.data.items);
    } catch (loadError) {
      const errorMessage = loadError.response?.data?.message || 'Unable to load products';
      setError(errorMessage); showToast(errorMessage, 'error');
    }
  };

  useEffect(() => { load(); }, []);

  const updateField = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const uploadImage = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const previousPendingImage = pendingImagePublicId;
    setError(''); setUploadingImage(true);
    try {
      const body = new FormData();
      body.append('image', file);
      const { data } = await api.post('/products/upload-image', body, { headers: { 'Content-Type': 'multipart/form-data' } });
      setForm((current) => ({ ...current, image: data.data.imageUrl, imagePublicId: data.data.publicId }));
      setPendingImagePublicId(data.data.publicId);
      if (previousPendingImage && previousPendingImage !== data.data.publicId) await api.delete('/products/upload-image', { data: { publicId: previousPendingImage } });
      showToast('Product image uploaded.');
    } catch (uploadError) {
      const errorMessage = uploadError.response?.data?.message || 'Unable to upload image';
      setError(errorMessage); showToast(errorMessage, 'error');
    } finally {
      setUploadingImage(false); event.target.value = '';
    }
  };

  const submit = async (event) => {
    event.preventDefault(); setError(''); setMessage('');
    try {
      const payload = { ...form, price: Number(form.price), stock: Number(form.stock) };
      if (editingId) await api.patch(`/products/${editingId}`, payload);
      else await api.post('/products', payload);
      const successMessage = editingId ? 'Product updated' : 'Product created';
      setForm(empty); setEditingId(null); setPendingImagePublicId(''); setMessage(successMessage); showToast(successMessage); load();
    } catch (submitError) {
      const errorMessage = submitError.response?.data?.message || 'Operation failed';
      setPendingImagePublicId(''); setError(errorMessage); showToast(errorMessage, 'error');
    }
  };

  const edit = (product) => setForm({ name: product.name, description: product.description, price: product.price, category: product.category, image: product.image, imagePublicId: product.imagePublicId || '', stock: product.stock, brand: product.brand || '' });

  const cancelForm = async () => {
    const imageToRemove = pendingImagePublicId;
    setForm(empty);
    setEditingId(null);
    setPendingImagePublicId('');
    setMessage('');
    setError('');
    if (imageToRemove) {
      try { await api.delete('/products/upload-image', { data: { publicId: imageToRemove } }); showToast('Uploaded image removed.'); }
      catch (cleanupError) { showToast(cleanupError.response?.data?.message || 'Unable to remove uploaded image', 'error'); }
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try { await api.delete(`/products/${id}`); showToast('Product deleted.'); load(); }
    catch (removeError) { const errorMessage = removeError.response?.data?.message || 'Delete failed'; setError(errorMessage); showToast(errorMessage, 'error'); }
  };

  return (
    <section className="space-y-6">
      <div><h1 className="text-3xl font-black">Product Management</h1><p className="mt-1 text-slate-500">Signed in as {user?.email}.</p></div>
      <form onSubmit={submit} className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-5 md:grid-cols-2">
        <input required placeholder="Product name" value={form.name} onChange={(event) => updateField('name', event.target.value)} className="rounded-xl border p-3" />
        <input required placeholder="Category" value={form.category} onChange={(event) => updateField('category', event.target.value)} className="rounded-xl border p-3" />
        <input required type="number" min="0" step="0.01" placeholder="Price" value={form.price} onChange={(event) => updateField('price', event.target.value)} className="rounded-xl border p-3" />
        <input required type="number" min="0" placeholder="Stock" value={form.stock} onChange={(event) => updateField('stock', event.target.value)} className="rounded-xl border p-3" />
        <div className="grid gap-2 md:col-span-2">
          <label className="text-sm font-semibold text-slate-700" htmlFor="product-image">Product image</label>
          <input id="product-image" required={!form.image} type="file" accept="image/*" onChange={uploadImage} disabled={uploadingImage} className="rounded-xl border p-3 file:mr-3 file:rounded-lg file:border-0 file:bg-indigo-50 file:px-3 file:py-2 file:font-semibold file:text-indigo-700" />
          {uploadingImage && <p className="text-sm text-slate-500">Uploading image...</p>}
          {form.image && <img src={form.image} alt="Product preview" className="h-32 w-32 rounded-xl object-cover" />}
        </div>
        <input placeholder="Brand" value={form.brand} onChange={(event) => updateField('brand', event.target.value)} className="rounded-xl border p-3" />
        <textarea required minLength={5} placeholder="Description" value={form.description} onChange={(event) => updateField('description', event.target.value)} className="rounded-xl border p-3 md:col-span-2" rows="4" />
        <div className="flex gap-3 md:col-span-2"><button disabled={uploadingImage} className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white disabled:opacity-50">{editingId ? 'Update product' : 'Create product'}</button><button type="button" onClick={cancelForm} disabled={uploadingImage} className="rounded-xl border px-5 py-3 font-semibold disabled:opacity-50">Cancel</button></div>
      </form>
      {message && <p className="rounded-xl bg-green-50 p-3 text-green-700">{message}</p>}
      {error && <p className="rounded-xl bg-red-50 p-3 text-red-700">{error}</p>}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white"><table className="min-w-full text-left text-sm"><thead className="border-b bg-slate-50"><tr><th className="p-4">Product</th><th className="p-4">Price</th><th className="p-4">Stock</th><th className="p-4">Actions</th></tr></thead><tbody>{products.map((product) => <tr key={product._id} className="border-b last:border-0"><td className="p-4"><div className="flex items-center gap-3"><img src={product.image} alt="" className="h-12 w-12 rounded-lg object-cover" /><div><p className="font-semibold">{product.name}</p><p className="text-xs text-slate-400">{product.category}</p></div></div></td><td className="p-4">₹{product.price.toLocaleString('en-IN')}</td><td className="p-4">{product.stock}</td><td className="space-x-2 p-4"><button onClick={() => { edit(product); setEditingId(product._id); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="rounded-lg border px-3 py-2">Edit</button><button onClick={() => remove(product._id)} className="rounded-lg bg-red-50 px-3 py-2 text-red-700">Delete</button></td></tr>)}</tbody></table></div>
    </section>
  );
};

export default ProductManagement;
