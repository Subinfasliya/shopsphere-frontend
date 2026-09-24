import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { Heart, ShoppingCart, ShieldCheck, Star } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById } from '../redux/thunks/productThunks';
import { addCartItem } from '../redux/thunks/cartThunks';
import { addWishlist, removeWishlist } from '../redux/thunks/wishlistThunks';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import { useToast } from '../components/ToastProvider';
import api from '../api/axiosInstance';
import { formatMoney, toUsd } from '../utils/currency';

export default function ProductDetail() {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { current: product, loading, error } = useSelector((state) => state.products);
  const auth = useSelector((state) => state.auth);
  const saved = useSelector((state) => state.wishlist.items.some((item) => item._id === productId));
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [ratingLoading, setRatingLoading] = useState(false);

  useEffect(() => { dispatch(fetchProductById(productId)); }, [dispatch, productId]);

  const add = () => {
    if (!auth.isAuthenticated) { navigate('/login', { state: { from: `/products/${productId}` } }); return; }
    dispatch(addCartItem({ productId, quantity }));
  };

  const toggle = () => {
    if (!auth.isAuthenticated) { navigate('/login', { state: { from: `/products/${productId}` } }); return; }
    dispatch(saved ? removeWishlist(productId) : addWishlist(productId));
  };

  const submitRating = async (event) => {
    event.preventDefault();
    if (!rating) { showToast('Choose a rating first.', 'error'); return; }
    setRatingLoading(true);
    try {
      await api.post(`/products/${productId}/rating`, { rating, comment });
      setComment('');
      showToast('Your rating was saved.');
      dispatch(fetchProductById(productId));
    } catch (ratingError) {
      showToast(ratingError.response?.data?.message || 'Unable to save rating', 'error');
    } finally { setRatingLoading(false); }
  };

  if (loading) return <Loader label="Loading product..." />;
  if (error) return <ErrorMessage message={error} onRetry={() => dispatch(fetchProductById(productId))} />;
  if (!product) return null;

  return <div className="space-y-10"><div className="grid gap-10 lg:grid-cols-[1.05fr_.95fr]"><div className="overflow-hidden rounded-[2rem] bg-slate-100"><img src={product.image} alt={product.name} className="aspect-square h-full w-full object-cover" /></div><div className="flex flex-col justify-center"><Link to="/" className="text-sm font-semibold text-indigo-600">Back to products</Link><div className="mt-5 flex items-center justify-between gap-4"><span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold capitalize text-indigo-700">{product.category}</span><button onClick={toggle} aria-label="Toggle wishlist" className={`rounded-full border p-3 ${saved ? 'border-rose-200 bg-rose-50 text-rose-600' : 'border-slate-200 bg-white text-slate-600'}`}><Heart size={19} fill={saved ? 'currentColor' : 'none'} /></button></div><h1 className="mt-5 text-4xl font-black tracking-tight">{product.name}</h1><div className="mt-4 flex items-center gap-2 text-amber-500"><Star size={18} fill="currentColor" />{Number(product.ratings || 0).toFixed(1)} <span className="text-sm text-slate-400">({product.numReviews || 0} reviews)</span></div><p className="mt-6 text-4xl font-black">{formatMoney(toUsd(product.price))}</p><p className="mt-5 leading-8 text-slate-600">{product.description}</p><div className="mt-6 grid gap-3 sm:grid-cols-2"><div className="rounded-xl bg-slate-50 p-4"><p className="text-xs text-slate-500">Brand</p><p className="mt-1 font-semibold">{product.brand || 'Not specified'}</p></div><div className="rounded-xl bg-slate-50 p-4"><p className="text-xs text-slate-500">Availability</p><p className="mt-1 font-semibold">{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</p></div></div><div className="mt-7 flex gap-3"><div className="flex items-center rounded-xl border border-slate-200"><button disabled={quantity <= 1} onClick={() => setQuantity((value) => value - 1)} className="px-4 py-3 disabled:opacity-30">-</button><span className="w-10 text-center font-semibold">{quantity}</span><button disabled={quantity >= Math.min(99, product.stock)} onClick={() => setQuantity((value) => value + 1)} className="px-4 py-3 disabled:opacity-30">+</button></div><button disabled={!product.stock} onClick={add} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white disabled:opacity-40"><ShoppingCart size={18} />Add to cart</button></div><div className="mt-6 flex items-center gap-2 text-sm text-slate-500"><ShieldCheck size={18} className="text-emerald-600" />Secure session, server-side cart and verified payment flow.</div></div></div>{auth.isAuthenticated && <form onSubmit={submitRating} className="rounded-2xl border border-slate-200 bg-white p-6"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><h2 className="text-xl font-black">Rate this product</h2><p className="mt-1 text-sm text-slate-500">Ratings are available after a delivered purchase.</p></div><div className="flex gap-1" aria-label="Choose rating">{[1, 2, 3, 4, 5].map((value) => <button key={value} type="button" onClick={() => setRating(value)} aria-label={`${value} star${value === 1 ? '' : 's'}`} className={value <= rating ? 'text-amber-400' : 'text-slate-300'}><Star size={25} fill="currentColor" /></button>)}</div></div><textarea value={comment} onChange={(event) => setComment(event.target.value)} maxLength={500} rows="3" placeholder="Share a short comment (optional)" className="mt-4 w-full rounded-xl border border-slate-200 p-3" /><button disabled={ratingLoading} className="mt-3 rounded-xl bg-indigo-600 px-5 py-2.5 font-semibold text-white disabled:opacity-50">{ratingLoading ? 'Saving...' : 'Save rating'}</button></form>}</div>;
}
