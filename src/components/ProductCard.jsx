import { Link, useNavigate } from 'react-router';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addCartItem } from '../redux/thunks/cartThunks';
import { addWishlist, removeWishlist } from '../redux/thunks/wishlistThunks';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch(); const navigate = useNavigate();
  const authenticated = useSelector((s)=>s.auth.isAuthenticated);
  const saved = useSelector((s)=>s.wishlist.items.some((i)=>i._id===product._id));
  const toggleWishlist = () => { if(!authenticated){navigate('/login',{state:{from:`/products/${product._id}`}});return;} dispatch(saved?removeWishlist(product._id):addWishlist(product._id)); };
  const add = () => { if(!authenticated){navigate('/login',{state:{from:`/products/${product._id}`}});return;} dispatch(addCartItem({productId:product._id,quantity:1})); };
  return <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"><div className="relative aspect-square overflow-hidden bg-slate-100"><img src={product.image} alt={product.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy"/><button onClick={toggleWishlist} className={`absolute right-3 top-3 rounded-full p-2.5 backdrop-blur ${saved?'bg-rose-500 text-white':'bg-white/90 text-slate-700'}`} aria-label="Wishlist"><Heart size={18} fill={saved?'currentColor':'none'}/></button>{product.stock<1&&<span className="absolute left-3 top-3 rounded-full bg-slate-900/90 px-2.5 py-1 text-xs font-semibold text-white">Out of stock</span>}</div><div className="p-4"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">{product.category}</p><Link to={`/products/${product._id}`} className="mt-1 line-clamp-2 font-bold text-slate-900 hover:text-indigo-600">{product.name}</Link></div><p className="shrink-0 text-lg font-black">₹{product.price.toLocaleString('en-IN')}</p></div><p className="mt-2 line-clamp-2 text-sm text-slate-500">{product.description}</p><div className="mt-4 flex items-center justify-between"><span className="inline-flex items-center gap-1 text-sm text-amber-500"><Star size={15} fill="currentColor"/>{Number(product.ratings||0).toFixed(1)} <span className="text-slate-400">({product.numReviews||0})</span></span><span className={`text-xs font-semibold ${product.stock<=5?'text-amber-600':'text-emerald-600'}`}>{product.stock} in stock</span></div><button onClick={add} disabled={product.stock<1} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"><ShoppingCart size={17}/>Add to cart</button></div></article>;
};
export default ProductCard;
