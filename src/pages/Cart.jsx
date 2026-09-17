import { Link, useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import CartItem from '../components/CartItem';
import { clearServerCart } from '../redux/thunks/cartThunks';
import Loader from '../components/Loader';

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.cart);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  if (loading && !items.length) return <Loader label="Loading your cart..." />;

  if (!items.length) return <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center"><h1 className="text-2xl font-black">Your cart is empty</h1><p className="mt-2 text-slate-500">Add something you like from the catalog.</p><Link to="/" className="mt-5 inline-block rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white">Browse products</Link></div>;

  return <div className="grid gap-8 lg:grid-cols-[1fr_360px]"><section className="space-y-4"><div className="flex items-end justify-between gap-4"><h1 className="text-3xl font-black">Your cart <span className="text-base font-medium text-slate-400">({count})</span></h1><button onClick={() => dispatch(clearServerCart())} className="text-sm font-semibold text-red-600">Clear cart</button></div>{error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}{items.map((item) => <CartItem key={item.productId} item={item} />)}</section><aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="text-xl font-bold">Order summary</h2><div className="mt-6 flex justify-between text-sm"><span>Subtotal</span><span>₹{total.toLocaleString('en-IN')}</span></div><div className="mt-2 flex justify-between text-sm text-slate-500"><span>Payment</span><span>COD or PayPal</span></div><div className="my-5 border-t border-slate-200 pt-5"><div className="flex justify-between text-lg font-black"><span>Total</span><span>₹{total.toLocaleString('en-IN')}</span></div></div><button onClick={() => navigate('/checkout')} className="w-full rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white">Proceed to checkout</button></aside></div>;
};
export default Cart;
