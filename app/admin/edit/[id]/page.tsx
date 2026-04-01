import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { updateListing } from "../../actions";
import ListingFormFields from "../../_components/ListingFormFields";

export default async function EditPage({ params }: { params: { id: string } }) {
  const supabase = createClient(await cookies());
  const { data: listing } = await supabase
    .from("listings")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!listing) notFound();

  const updateWithId = updateListing.bind(null, params.id);

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <a href="/admin" className="text-sm font-bold text-gray-400 hover:text-[#ff5a2e]">← Dashboard</a>
        <h1 className="text-2xl font-black text-[#1a1a2e] mt-2">Editează listing</h1>
        <p className="text-gray-500 font-medium text-sm mt-0.5">{listing.name}</p>
      </div>

      <form action={updateWithId} className="bg-white rounded-2xl border border-gray-200 p-6">
        <ListingFormFields d={{
          name:        listing.name,
          category:    listing.category,
          description: listing.description,
          address:     listing.address,
          city:        listing.city,
          price:       listing.price,
          age_min:     listing.age_min,
          age_max:     listing.age_max,
          schedule:    listing.schedule,
          phone:       listing.phone,
          is_verified: listing.is_verified,
          is_featured: listing.is_featured,
        }} />

        <div className="flex items-center gap-3 mt-8 pt-6 border-t border-gray-100">
          <button
            type="submit"
            className="bg-[#ff5a2e] hover:bg-[#f03d12] text-white font-black px-6 py-3 rounded-xl transition-colors"
          >
            Salvează modificările
          </button>
          <a href="/admin" className="text-sm font-bold text-gray-500 hover:text-gray-700 px-4 py-3">
            Anulează
          </a>
          <div className="ml-auto">
            <a
              href={`/listing/${params.id}`}
              target="_blank"
              className="text-sm font-semibold text-gray-400 hover:text-[#ff5a2e]"
            >
              Vezi pe site →
            </a>
          </div>
        </div>
      </form>
    </div>
  );
}
