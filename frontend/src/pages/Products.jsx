import { useEffect, useState } from "react";
import api from "../api/axios";
import { exportToCsv } from "../api/csv";
import { useAuth } from "../context/AuthContext";
import ProductModal from "../components/ProductModal";

const CATEGORIES = ["Electronics", "Clothing", "Home", "Books", "Toys"];

export default function Products() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [items, setItems] = useState([]);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  // query state
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState(""); // search after the user stops typing
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("-createdAt"); // "-field" = descending
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  // DEBOUNCE: don't fire a request on every keystroke. Wait 400ms after typing
  // stops; the cleanup cancels the pending timer if the user types again.
  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  // One fetch function used by both the effect and after mutations, so the list
  // always reflects the DB. It reads the current query state via closure.
  const load = () => {
    setLoading(true);
    api
      .get("/products", { params: { search: debounced, category, sort, page, limit: 10 } })
      .then((res) => {
        setItems(res.data.items);
        setPages(res.data.pages);
        setTotal(res.data.total);
      })
      .finally(() => setLoading(false));
  };

  // Re-fetch whenever any query input changes. Backend does search/sort/paginate.
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced, category, sort, page]);

  // SORTING: click a header to sort by it; click again to flip direction.
  // Direction is encoded as a leading "-" to match the API.
  const toggleSort = (field) => {
    setPage(1);
    setSort((cur) => (cur === field ? `-${field}` : field));
  };
  const sortIcon = (field) => (sort === field ? "▲" : sort === `-${field}` ? "▼" : "");

  const remove = async (id) => {
    if (!confirm("Delete this product?")) return;
    await api.delete(`/products/${id}`);
    load();
  };

  const onSaved = () => {
    setModalOpen(false);
    setEditing(null);
    load();
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <input
          placeholder="Search products…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="w-56 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
        />
        <select
          value={category}
          onChange={(e) => { setCategory(e.target.value); setPage(1); }}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-accent"
        >
          <option value="">All categories</option>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>

        <div className="ml-auto flex gap-2">
          <button
            onClick={() => exportToCsv("products.csv", items.map(({ name, category, price, stock }) => ({ name, category, price, stock })))}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Export CSV
          </button>
          {isAdmin && (
            <button
              onClick={() => { setEditing(null); setModalOpen(true); }}
              className="rounded-lg bg-accent px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              + Add product
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <Th onClick={() => toggleSort("name")}>Name {sortIcon("name")}</Th>
              <Th onClick={() => toggleSort("category")}>Category {sortIcon("category")}</Th>
              <Th onClick={() => toggleSort("price")}>Price {sortIcon("price")}</Th>
              <Th onClick={() => toggleSort("stock")}>Stock {sortIcon("stock")}</Th>
              {isAdmin && <th className="px-4 py-3 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td colSpan="5" className="px-4 py-8 text-center text-slate-400">Loading…</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan="5" className="px-4 py-8 text-center text-slate-400">No products found.</td></tr>
            ) : (
              items.map((p) => (
                <tr key={p._id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{p.name}</td>
                  <td className="px-4 py-3 text-slate-600">{p.category}</td>
                  <td className="px-4 py-3 text-slate-600">${p.price}</td>
                  <td className="px-4 py-3">
                    <span className={p.stock < 5 ? "text-red-600 font-medium" : "text-slate-600"}>{p.stock}</span>
                  </td>
                  {isAdmin && (
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => { setEditing(p); setModalOpen(true); }} className="text-accent hover:underline">Edit</button>
                      <button onClick={() => remove(p._id)} className="ml-3 text-red-600 hover:underline">Delete</button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm text-slate-500">
        <span>{total} products</span>
        <div className="flex items-center gap-2">
          <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="rounded-lg border border-slate-200 px-3 py-1.5 disabled:opacity-40">Prev</button>
          <span>Page {page} of {pages || 1}</span>
          <button disabled={page >= pages} onClick={() => setPage((p) => p + 1)} className="rounded-lg border border-slate-200 px-3 py-1.5 disabled:opacity-40">Next</button>
        </div>
      </div>

      <ProductModal open={modalOpen} product={editing} onClose={() => setModalOpen(false)} onSaved={onSaved} />
    </div>
  );
}

function Th({ children, onClick }) {
  return (
    <th onClick={onClick} className="cursor-pointer select-none px-4 py-3 font-medium hover:text-slate-700">
      {children}
    </th>
  );
}
