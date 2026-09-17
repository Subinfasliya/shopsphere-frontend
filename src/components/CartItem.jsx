import { Minus, Plus, Trash2 } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { removeCartItem, updateCartItem } from '../redux/thunks/cartThunks';

const CartItem = ({ item }) => {
  const dispatch = useDispatch();

  return (
    <article className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4">
      <img src={item.image} alt={item.name} className="h-24 w-24 rounded-xl object-cover" />
      <div className="min-w-0 flex-1"><h3 className="truncate font-bold">{item.name}</h3><p className="mt-1 text-sm text-slate-500">₹{item.price.toLocaleString('en-IN')} · {item.stock} in stock</p><div className="mt-4 flex items-center gap-2"><button onClick={() => dispatch(updateCartItem({ productId: item.productId, quantity: item.quantity - 1 }))} className="rounded-md border p-1"><Minus size={15} /></button><span className="min-w-7 text-center font-semibold">{item.quantity}</span><button disabled={item.quantity >= item.stock} onClick={() => dispatch(updateCartItem({ productId: item.productId, quantity: item.quantity + 1 }))} className="rounded-md border p-1 disabled:opacity-40"><Plus size={15} /></button></div></div>
      <div className="flex flex-col items-end justify-between"><button onClick={() => dispatch(removeCartItem(item.productId))} className="text-slate-400 hover:text-red-600"><Trash2 size={18} /></button><p className="font-black">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p></div>
    </article>
  );
};

export default CartItem;
