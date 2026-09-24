import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllOrders, updateOrderStatus } from '../../redux/thunks/orderThunks';
import Loader from '../../components/Loader';

const statuses = ['placed', 'processing', 'shipped', 'delivered', 'cancelled'];

const formatCurrency = (value) =>
  Number(value || 0).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  });

const OrderManagement = () => {
  const dispatch = useDispatch();
  const { allOrders: orders, allOrdersPagination: pagination, loading, error } = useSelector((state) => state.orders);
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchAllOrders({ page, limit: 10 }));
  }, [dispatch, page]);

  if (loading && !orders.length) {
    return <Loader label="Loading orders..." />;
  }

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-slate-900">Order Management</h1>
        <p className="mt-1 text-slate-500">
          View customer details, ordered products, quantities, prices and update order status.
        </p>
      </div>

      {error && (
        <p className="rounded-xl bg-red-50 p-3 text-red-700" role="alert">
          {error}
        </p>
      )}

      <div className="space-y-5">
        {orders.map((order) => (
          <article
            key={order._id}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
          >
            {/* Order header */}
            <div className="border-b border-slate-100 bg-slate-50 p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="font-semibold text-slate-900">
                    {order.user?.name || 'Customer'}
                    {order.user?.email ? ` · ${order.user.email}` : ''}
                  </p>
                  <p className="mt-1 break-all text-xs text-slate-400">
                    Order ID: {order._id}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {new Date(order.createdAt).toLocaleString('en-IN')}
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <div className="rounded-xl bg-white px-4 py-3 ring-1 ring-slate-200">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Order total
                    </p>
                    <p className="text-lg font-bold text-slate-900">
                      {formatCurrency(order.totalPrice)}
                    </p>
                  </div>

                  <select
                    value={order.orderStatus}
                    disabled={order.orderStatus === 'cancelled'}
                    onChange={(e) =>
                      dispatch(
                        updateOrderStatus({
                          id: order._id,
                          orderStatus: e.target.value,
                        })
                      )
                    }
                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {order.orderStatus === 'cancelled' && <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800"><strong>Order cancelled</strong><span>By: {order.cancelledBy === 'user' ? 'Customer' : 'Admin'}</span>{order.cancelledAt && <span>At: {new Date(order.cancelledAt).toLocaleString()}</span>}</div>}
              {order.orderStatus === 'shipped' && order.deliveryOtpSentAt && <div className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">Delivery OTP sent. Waiting for customer confirmation.</div>}
              {order.returnStatus && order.returnStatus !== 'none' && <div className="mt-4 rounded-xl bg-slate-100 px-4 py-3 text-sm capitalize text-slate-700">Return status: {order.returnStatus.replace('_', ' ')}{order.returnConfirmedAt ? ` · confirmed ${new Date(order.returnConfirmedAt).toLocaleString()}` : ''}</div>}
            </div>

            {/* Customer shipping information */}
            {order.shippingAddress && (
              <div className="border-b border-slate-100 p-5">
                <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">
                  Shipping information
                </h2>
                <div className="mt-3 grid gap-2 text-sm text-slate-600 sm:grid-cols-2 lg:grid-cols-3">
                  <p><span className="font-semibold text-slate-800">Name:</span> {order.shippingAddress.name}</p>
                  <p><span className="font-semibold text-slate-800">Phone:</span> {order.shippingAddress.phone}</p>
                  <p><span className="font-semibold text-slate-800">City:</span> {order.shippingAddress.city}</p>
                  <p><span className="font-semibold text-slate-800">State:</span> {order.shippingAddress.state}</p>
                  <p><span className="font-semibold text-slate-800">Postal code:</span> {order.shippingAddress.postalCode}</p>
                  <p><span className="font-semibold text-slate-800">Country:</span> {order.shippingAddress.country}</p>
                  <p className="sm:col-span-2 lg:col-span-3">
                    <span className="font-semibold text-slate-800">Address:</span>{' '}
                    {order.shippingAddress.street}, {order.shippingAddress.city},{' '}
                    {order.shippingAddress.state} - {order.shippingAddress.postalCode}
                  </p>
                </div>
              </div>
            )}

            {/* Ordered products */}
            <div className="p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-lg font-bold text-slate-900">Ordered products</h2>
                <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                  {order.items?.length || 0} product(s)
                </span>
              </div>

              <div className="space-y-3">
                {order.items?.map((item) => {
                  const product = item.product && typeof item.product === 'object' ? item.product : null;
                  const productName = item.name || product?.name || 'Product';
                  const productImage = item.image || product?.image || '';
                  const productId = product?._id || item.product;
                  const unitPrice = Number(item.price ?? product?.price ?? 0);

                  return (
                  <div
                    key={`${order._id}-${productId}-${productName}`}
                    className="flex flex-col gap-4 rounded-xl border border-slate-200 p-3 sm:flex-row sm:items-center"
                  >
                    <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-100 ring-1 ring-slate-200">
                      {productImage ? (
                        <img
                          src={productImage}
                          alt={productName}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center px-2 text-center text-xs font-medium text-slate-400">
                          No image
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-slate-900">{productName}</p>
                      <p className="mt-1 text-sm text-slate-500">
                        Product ID: {productId}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-slate-600">
                        <span>Unit price: <strong className="text-slate-800">{formatCurrency(unitPrice)}</strong></span>
                        <span>Quantity: <strong className="text-slate-800">{item.quantity}</strong></span>
                        <span>Subtotal: <strong className="text-slate-800">{formatCurrency(unitPrice * item.quantity)}</strong></span>
                      </div>
                    </div>
                  </div>
                  );
                })}
              </div>

              {!order.items?.length && (
                <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
                  No product items found in this order.
                </div>
              )}
            </div>

            {/* Payment information */}
            <div className="flex flex-col gap-2 border-t border-slate-100 bg-slate-50 px-5 py-4 text-sm sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap gap-x-5 gap-y-2 text-slate-600">
                <span>
                  Payment: <strong className="capitalize text-slate-800">{order.paymentMethod}</strong>
                </span>
                <span>
                  Payment status: <strong className="capitalize text-slate-800">{order.paymentStatus}</strong>
                </span>
              </div>
              <span className="font-bold text-slate-900">
                Total: {formatCurrency(order.totalPrice)}
              </span>
            </div>
          </article>
        ))}
      </div>

      {!orders.length && (
        <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-slate-500">
          No orders.
        </div>
      )}
      {pagination?.pages > 1 && <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4"><button type="button" disabled={page <= 1 || loading} onClick={() => setPage((current) => current - 1)} className="rounded-lg border px-3 py-2 text-sm font-semibold disabled:opacity-40">Previous</button><span className="text-sm text-slate-500">Page {page} of {pagination.pages} · {pagination.total} active orders</span><button type="button" disabled={page >= pagination.pages || loading} onClick={() => setPage((current) => current + 1)} className="rounded-lg border px-3 py-2 text-sm font-semibold disabled:opacity-40">Next</button></div>}
    </section>
  );
};

export default OrderManagement;
