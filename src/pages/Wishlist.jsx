import { useEffect } from 'react';
import { Heart, ShoppingCart } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWishlist, removeWishlist } from '../redux/thunks/wishlistThunks';
import { addCartItem } from '../redux/thunks/cartThunks';
import { Link } from 'react-router';

export default function Wishlist() {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((s)=>s.wishlist);
  useEffect(()=>{dispatch(fetchWishlist())},[dispatch]);
  if (loading && !items.length) return <div className="py-20 text-center text-slate-500">Loading wishlist...</div>;
  return <section><div className="flex items-end justify-between"><div><p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">Saved for later</p><h1 className="text-3xl font-black">Wishlist</h1></div><span className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-700">{items.length} items</span></div>{!items.length?<div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-white p-14 text-center"><Heart className="mx-auto text-slate-300" size={42}/><p className="mt-4 font-semibold text-slate-700">Your wishlist is empty</p><Link to="/" className="mt-5 inline-block rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white">Browse products</Link></div>:<div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{items.map(p=><article key={p._id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white"><img src={p.image} alt={p.name} className="aspect-square w-full object-cover"/><div className="p-4"><div className="flex items-start justify-between gap-3"><Link to={`/products/${p._id}`} className="font-bold hover:text-indigo-600">{p.name}</Link><span className="text-lg font-black">₹{p.price.toLocaleString('en-IN')}</span></div><p className="mt-1 text-sm capitalize text-slate-500">{p.category}</p><div className="mt-4 flex gap-2"><button disabled={p.stock<1} onClick={()=>dispatch(addCartItem({productId:p._id,quantity:1}))} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-3 py-2.5 text-sm font-semibold text-white disabled:opacity-40"><ShoppingCart size={16}/> Cart</button><button onClick={()=>dispatch(removeWishlist(p._id))} className="rounded-xl border px-3 py-2.5 text-rose-600">Remove</button></div></div></article>)}</div>}</section>;
}
