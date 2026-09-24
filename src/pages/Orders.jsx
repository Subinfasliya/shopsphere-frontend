import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { cancelOrder, confirmDelivery, confirmReturn, fetchMyOrders, requestReturn } from '../redux/thunks/orderThunks';
import { useToast } from '../components/ToastProvider';
import Loader from '../components/Loader';
import { formatMoney } from '../utils/currency';

const Orders = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.orders);
  const { showToast } = useToast();

  useEffect(() => { dispatch(fetchMyOrders()); }, [dispatch]);

  const handleCancel = async (orderId) => {
    if (!window.confirm('Cancel this order? Reserved stock will be returned.')) return;
    try { await dispatch(cancelOrder(orderId)).unwrap(); showToast('Order cancelled.'); }
    catch (cancelError) { showToast(cancelError || 'Unable to cancel order', 'error'); }
  };

  const handleDeliveryConfirmation = async (orderId) => {
    const otp = window.prompt('Enter the six-digit delivery OTP sent to your email.');
    if (!otp) return;
    try { await dispatch(confirmDelivery({ orderId, otp: otp.trim() })).unwrap(); showToast('Delivery confirmed successfully.'); }
    catch (confirmError) { showToast(confirmError || 'Unable to confirm delivery', 'error'); }
  };

  const handleReturn = async (orderId) => {
    try {
      await dispatch(requestReturn(orderId)).unwrap();
      const otp = window.prompt('Return OTP sent. Enter the six-digit OTP to confirm your return.');
      if (!otp) return;
      await dispatch(confirmReturn({ orderId, otp: otp.trim() })).unwrap();
      showToast('Return request submitted.');
    } catch (returnError) { showToast(returnError || 'Unable to submit return request', 'error'); }
  };

  if (loading && !items.length) return <Loader label="Loading orders..." />;

  return <section className="space-y-5"><div><h1 className="text-3xl font-black">My Orders</h1><p className="mt-1 text-slate-500">Confirm delivery with your OTP and request returns within seven days.</p></div>{error && <p className="rounded-lg bg-red-50 p-3 text-red-700">{error}</p>}{items.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">No orders yet.</div> : items.map((order) => <article key={order._id} className="rounded-2xl border border-slate-200 bg-white p-5"><div className="flex flex-col justify-between gap-3 sm:flex-row"><div><p className="text-xs uppercase tracking-wider text-slate-400">Order</p><p className="font-semibold">{order._id}</p></div><span className="w-fit rounded-full bg-indigo-50 px-3 py-1 text-sm font-semibold capitalize text-indigo-700">{order.orderStatus}</span></div>{order.orderStatus === 'shipped' && order.deliveryOtpSentAt && <div className="mt-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">Delivery confirmation is waiting for your OTP.</div>}{order.orderStatus === 'delivered' && <div className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800">Delivered {order.deliveredAt ? new Date(order.deliveredAt).toLocaleString() : ''}</div>}{order.returnStatus && order.returnStatus !== 'none' && <div className="mt-4 rounded-xl bg-slate-100 p-3 text-sm capitalize text-slate-700">Return status: {order.returnStatus.replace('_', ' ')}</div>}<div className="mt-5 divide-y divide-slate-100">{order.items.map((item) => <div key={item.product} className="flex items-center gap-3 py-3"><img src={item.image} alt="" className="h-12 w-12 rounded-lg object-cover" /><div className="flex-1"><p className="font-medium">{item.name}</p><p className="text-sm text-slate-500">Qty {item.quantity}</p></div><p className="font-semibold">{formatMoney(item.price * item.quantity)}</p></div>)}</div><div className="mt-4 flex flex-col items-end gap-3 border-t pt-4 sm:flex-row sm:justify-between"><div>{order.canCancel && <p className="text-xs text-slate-500">Cancel before {new Date(order.cancellationDeadline).toLocaleString()}</p>}{!order.canCancel && order.orderStatus === 'placed' && <p className="text-xs text-slate-500">Cancellation window expired</p>}</div><div className="font-black">Total: {formatMoney(order.totalPrice)}</div></div><div className="mt-4 flex flex-wrap gap-3">{order.orderStatus === 'shipped' && order.deliveryOtpSentAt && <button type="button" onClick={() => handleDeliveryConfirmation(order._id)} className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white">Confirm delivery</button>}{order.orderStatus === 'delivered' && order.returnStatus === 'none' && <button type="button" onClick={() => handleReturn(order._id)} className="rounded-xl border border-amber-300 px-4 py-2.5 text-sm font-semibold text-amber-800 hover:bg-amber-50">Request return</button>}{order.canCancel && <button type="button" disabled={loading} onClick={() => handleCancel(order._id)} className="rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50">Cancel order</button>}</div></article>)}</section>;
};

export default Orders;
