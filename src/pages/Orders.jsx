import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyOrders } from '../redux/thunks/orderThunks';
import Loader from '../components/Loader';

const Orders = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.orders);

  useEffect(() => { dispatch(fetchMyOrders()); }, [dispatch]);

  if (loading) return <Loader label="Loading orders..." />;

  return <section className="space-y-5"><div><h1 className="text-3xl font-black">My Orders</h1><p className="mt-1 text-slate-500">Track your purchases and order status.</p></div>{error && <p className="rounded-lg bg-red-50 p-3 text-red-700">{error}</p>}{items.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">No orders yet.</div> : items.map((order) => <article key={order._id} className="rounded-2xl border border-slate-200 bg-white p-5"><div className="flex flex-col justify-between gap-3 sm:flex-row"><div><p className="text-xs uppercase tracking-wider text-slate-400">Order</p><p className="font-semibold">{order._id}</p></div><span className="w-fit rounded-full bg-indigo-50 px-3 py-1 text-sm font-semibold capitalize text-indigo-700">{order.orderStatus}</span></div><div className="mt-5 divide-y divide-slate-100">{order.items.map((item) => <div key={item.product} className="flex items-center gap-3 py-3"><img src={item.image} alt="" className="h-12 w-12 rounded-lg object-cover" /><div className="flex-1"><p className="font-medium">{item.name}</p><p className="text-sm text-slate-500">Qty {item.quantity}</p></div><p className="font-semibold">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p></div>)}</div><div className="mt-4 flex justify-end border-t pt-4 font-black">Total: ₹{order.totalPrice.toLocaleString('en-IN')}</div></article>)}</section>;
};

export default Orders;
