import { useEffect, useState } from "react";
import { Search, SlidersHorizontal, Sparkles } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories, fetchProducts } from "../redux/thunks/productThunks";
import { fetchRecommendations } from "../redux/thunks/recommendationThunks";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import { INR_TO_USD } from "../utils/currency";

export default function Home() {
  const dispatch = useDispatch();
  const auth = useSelector((s) => s.auth);
  const { items, categories, pagination, loading, error } = useSelector(
    (s) => s.products,
  );
  const recs = useSelector((s) => s.recommendations.items);
  const [params, setParams] = useState({
    search: "",
    category: "",
    sort: "newest",
    minPrice: "",
    maxPrice: "",
    page: 1,
    limit: 12,
  });
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);
  useEffect(() => {
    dispatch(fetchProducts({ ...params, minPrice: params.minPrice ? Number(params.minPrice) / INR_TO_USD : '', maxPrice: params.maxPrice ? Number(params.maxPrice) / INR_TO_USD : '' }));
  }, [dispatch, params]);
  useEffect(() => {
    if (auth.isAuthenticated) dispatch(fetchRecommendations());
  }, [dispatch, auth.isAuthenticated]);
  const setParam = (k, v) =>
    setParams((p) => ({ ...p, [k]: v, page: k === "page" ? v : 1 }));
  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-[2rem] bg-slate-950 p-8 text-white shadow-2xl lg:p-12">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-indigo-600/30 blur-3xl" />
        <div className="absolute -bottom-24 left-1/3 h-72 w-72 rounded-full bg-violet-600/20 blur-3xl" />
        <div className="relative max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-200">
            <Sparkles size={14} /> Full-stack shopping experience
          </span>
          <h1 className="mt-5 text-4xl font-black leading-tight tracking-tight sm:text-6xl">
            Shop smarter. Checkout securely. Come back for more.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">
            Server-side cart, secure session cookies, personalized
            recommendations, PayPal checkout and an admin operations console—all
            wired through a modular MERN architecture.
          </p>
        </div>
      </section>
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 lg:grid-cols-[1fr_180px_180px_180px_160px]">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-3.5 text-slate-400"
            />
            <input
              value={params.search}
              onChange={(e) => setParam("search", e.target.value)}
              placeholder="Search products, brands..."
              className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
            />
          </div>
          <select
            value={params.category}
            onChange={(e) => setParam("category", e.target.value)}
            className="rounded-xl border border-slate-200 px-4 py-3"
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <input
            type="number"
            min="0"
            placeholder="Min USD"
            value={params.minPrice}
            onChange={(e) => setParam("minPrice", e.target.value)}
            className="rounded-xl border border-slate-200 px-4 py-3"
          />
          <input
            type="number"
            min="0"
            placeholder="Max USD"
            value={params.maxPrice}
            onChange={(e) => setParam("maxPrice", e.target.value)}
            className="rounded-xl border border-slate-200 px-4 py-3"
          />
          <select
            value={params.sort}
            onChange={(e) => setParam("sort", e.target.value)}
            className="rounded-xl border border-slate-200 px-4 py-3"
          >
            <option value="newest">Newest</option>
            <option value="price_asc">Price ↑</option>
            <option value="price_desc">Price ↓</option>
            <option value="rating">Top rated</option>
            <option value="name">Name</option>
          </select>
        </div>
      </section>
      {auth.isAuthenticated && recs.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">
                Personalized for you
              </p>
              <h2 className="text-2xl font-black">Recommended products</h2>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500">
              <SlidersHorizontal size={14} />
              Hugging Face powered
            </span>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {recs.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}
      {loading ? (
        <Loader label="Loading products..." />
      ) : error ? (
        <ErrorMessage
          message={error}
          onRetry={() => dispatch(fetchProducts(params))}
        />
      ) : (
        <section className="space-y-5">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-black">All products</h2>
              <p className="text-sm text-slate-500">
                {pagination.total} products found
              </p>
            </div>
          </div>
          {items.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500">
              No products match those filters.
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {items.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button
                disabled={pagination.page <= 1}
                onClick={() => setParam("page", pagination.page - 1)}
                className="rounded-xl border bg-white px-4 py-2.5 text-sm font-semibold disabled:opacity-40"
              >
                Previous
              </button>
              <span className="px-3 text-sm text-slate-500">
                Page {pagination.page} of {pagination.pages}
              </span>
              <button
                disabled={pagination.page >= pagination.pages}
                onClick={() => setParam("page", pagination.page + 1)}
                className="rounded-xl border bg-white px-4 py-2.5 text-sm font-semibold disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
