import { createListing } from "../actions";
import ListingFormFields from "../_components/ListingFormFields";

export default function NouPage() {
  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <a href="/admin" className="text-sm font-bold text-gray-400 hover:text-[#ff5a2e]">← Dashboard</a>
        <h1 className="text-2xl font-black text-[#1a1a2e] mt-2">Adaugă listing nou</h1>
      </div>

      <form action={createListing} className="bg-white rounded-2xl border border-gray-200 p-6">
        <ListingFormFields />

        <div className="flex items-center gap-3 mt-8 pt-6 border-t border-gray-100">
          <button
            type="submit"
            className="bg-[#ff5a2e] hover:bg-[#f03d12] text-white font-black px-6 py-3 rounded-xl transition-colors"
          >
            Salvează listing
          </button>
          <a href="/admin" className="text-sm font-bold text-gray-500 hover:text-gray-700 px-4 py-3">
            Anulează
          </a>
        </div>
      </form>
    </div>
  );
}
