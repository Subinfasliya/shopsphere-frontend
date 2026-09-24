import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import {
  PayPalOneTimePaymentButton,
  PayPalProvider,
} from "@paypal/react-paypal-js/sdk-v6";
import {
  createCodOrder,
  createPaypalOrder,
  capturePaypalOrder,
  cancelPaypalOrder,
} from "../redux/thunks/orderThunks";
import { clearLocalCart } from "../redux/slices/cartSlice";
import { clearCurrentOrder } from "../redux/slices/orderSlice";
import Loader from "../components/Loader";

const formatMoney = (amount, currency = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency }).format(
    Number(amount || 0),
  );

export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const { current, paymentLoading, loading, error } = useSelector(
    (state) => state.orders,
  );
  const [paypalConfig, setPaypalConfig] = useState(null);
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    street: user?.address?.street || "",
    city: user?.address?.city || "",
    state: user?.address?.state || "",
    postalCode: user?.address?.postalCode || "",
    country: user?.address?.country || "India",
  });

  const address = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(form).map(([key, value]) => [
          key,
          String(value || "").trim(),
        ]),
      ),
    [form],
  );
  const addressComplete = Object.values(address).every(Boolean);
  const totalInr = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const paypalCurrency = paypalConfig?.currency || "USD";
  const conversionRate = Number(
    paypalConfig?.conversionRate || (paypalCurrency === "INR" ? 1 : 0.012),
  );
  const paypalTotal = totalInr * conversionRate;

  useEffect(() => {
    dispatch(clearCurrentOrder());
  }, [dispatch]);
  useEffect(() => {
    if (!items.length && !current) navigate("/cart", { replace: true });
  }, [items.length, current, navigate]);
  useEffect(() => {
    let mounted = true;
    const apiBaseUrl = (import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1").replace(/\/+$/, "");
    fetch(
      `${apiBaseUrl}/paypal/config`,
      { credentials: "include" },
    )
      .then((response) => {
        if (!response.ok) throw new Error("PayPal configuration unavailable");
        return response.json();
      })
      .then((response) => {
        if (mounted) setPaypalConfig(response.data);
      })
      .catch(() => {
        if (mounted)
          setPaypalConfig({
            clientId: "",
            currency: "USD",
            conversionRate: 0.012,
          });
      });
    return () => {
      mounted = false;
    };
  }, []);
  useEffect(() => {
    if (current) navigate("/orders", { replace: true });
  }, [current, navigate]);

  const submitCod = async (event) => {
    event.preventDefault();
    if (!addressComplete) return;
    await dispatch(createCodOrder({ shippingAddress: address })).unwrap();
    dispatch(clearLocalCart());
  };

  if (!items.length) return <Loader label="Checking cart..." />;

  const input = (key, placeholder) => (
    <input
      required
      value={form[key]}
      placeholder={placeholder}
      onChange={(event) =>
        setForm((current) => ({ ...current, [key]: event.target.value }))
      }
      className="w-full rounded-xl border border-slate-200 px-4 py-3"
    />
  );
  const paypal = paypalConfig?.clientId ? (
    <PayPalProvider
      clientId={paypalConfig.clientId}
      environment={paypalConfig.environment}
      currency={paypalCurrency}
      components={["paypal-payments"]}
      pageType="checkout"
    >
      <PayPalOneTimePaymentButton
        type="checkout"
        disabled={paymentLoading || !addressComplete}
        createOrder={async () => {
          const result = await dispatch(
            createPaypalOrder({ shippingAddress: address }),
          ).unwrap();
          return { orderId: result.paypalOrderId };
        }}
        onApprove={async ({ orderId }) => {
          await dispatch(capturePaypalOrder(orderId)).unwrap();
          dispatch(clearLocalCart());
        }}
        onCancel={async ({ orderId }) => {
          if (orderId) await dispatch(cancelPaypalOrder(orderId));
        }}
        onError={(paypalError) => console.error("PayPal error", paypalError)}
      />
    </PayPalProvider>
  ) : (
    <div className="rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
      PayPal is disabled until the backend client ID is configured.
    </div>
  );

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">
          Secure checkout
        </p>
        <h1 className="text-3xl font-black">Complete your order</h1>
        <p className="mt-1 text-slate-500">
          Final prices and stock are calculated on the server.
        </p>
      </div>
      {error && (
        <div className="rounded-xl bg-red-50 p-4 text-red-700">{error}</div>
      )}
      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <form
          onSubmit={submitCod}
          className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 lg:p-8"
        >
          <h2 className="text-xl font-black">Delivery details</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {input("name", "Full name")}
            {input("phone", "Phone")}
            {input("street", "Street address")}
            {input("city", "City")}
            {input("state", "State")}
            {input("postalCode", "Postal code")}
            {input("country", "Country")}
          </div>
          <button
            disabled={loading}
            className="w-full rounded-xl bg-slate-900 px-4 py-3.5 font-semibold text-white disabled:opacity-50"
          >
            {loading ? "Placing order..." : "Cash on Delivery"}
          </button>
        </form>
        <aside className="h-fit space-y-5 rounded-3xl border border-slate-200 bg-white p-6">
          <div>
            <h2 className="text-xl font-black">Pay with PayPal</h2>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Checkout total: {formatMoney(paypalTotal, paypalCurrency)}
            </p>
          </div>
          {paypal}
          <div className="border-t pt-5">
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.productId} className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt=""
                    className="h-12 w-12 rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      {item.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {item.quantity} ×{" "}
                      {formatMoney(item.price * conversionRate, paypalCurrency)}
                    </p>
                  </div>
                  <span className="font-semibold">
                    {formatMoney(
                      item.price * item.quantity * conversionRate,
                      paypalCurrency,
                    )}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-5 flex justify-between border-t pt-4 text-lg font-black">
              <span>Total</span>
              <span>{formatMoney(paypalTotal, paypalCurrency)}</span>
            </div>
            <p className="mt-2 text-xs text-slate-400">
              COD remains in INR. PayPal uses the configured {paypalCurrency}{" "}
              currency.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
