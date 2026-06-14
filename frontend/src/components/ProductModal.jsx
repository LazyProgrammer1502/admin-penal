import { useState, useEffect } from "react";
import api from "../api/axios";

const CATEGORIES = ["Electronics", "Clothing", "Home", "Books", "Toys"];
const empty = { name: "", category: "Electronics", price: "", stock: "" };

export default function ProductModal({ open, product, onClose, onSaved }) {
  const [form, setForm] = useState(empty);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  // Same modal handles "add" and "edit": if a product is passed we prefill the
  // form with it, otherwise start empty. Re-runs whenever we open it.
  useEffect(() => {
    setForm(
      product
        ? { name: product.name, category: product.category, price: product.price, stock: product.stock }
        : empty
    );
    setError("");
  }, [product, open]);

  if (!open) return null;

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const save = async () => {
    setSaving(true);
    setError("");
    try {
      const payload = { ...form, price: Number(form.price), stock: Number(form.stock) };
      if (product) await api.put(`/products/${product._id}`, payload); // edit
      else await api.post("/products", payload); // create
      onSaved(); // parent refetches the list and closes
    } catch (err) {
      setError(err.response?.data?.error || "Could not save product");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4" onClick={onClose}>
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-lg font-semibold text-slate-900">{product ? "Edit product" : "Add product"}</h2>

        <div className="mt-4 space-y-3">
          <Field label="Name">
            <input className={inputCls} value={form.name} onChange={update("name")} />
          </Field>
          <Field label="Category">
            <select className={inputCls} value={form.category} onChange={update("category")}>
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Price ($)">
              <input type="number" min="0" className={inputCls} value={form.price} onChange={update("price")} />
            </Field>
            <Field label="Stock">
              <input type="number" min="0" className={inputCls} value={form.stock} onChange={update("stock")} />
            </Field>
          </div>
        </div>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
            Cancel
          </button>
          <button onClick={save} disabled={saving} className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60">
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

const inputCls =
  "mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20";

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      {children}
    </label>
  );
}
