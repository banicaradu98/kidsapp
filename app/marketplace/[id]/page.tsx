import { notFound } from "next/navigation";
import { adminClient } from "@/utils/supabase/admin";
import Navbar from "@/app/components/Navbar";
import ListingDetailClient from "./ListingDetailClient";

export default async function MarketplaceDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { data: listing } = await adminClient
    .from("marketplace_listings")
    .select("*, profiles(full_name, avatar_url, created_at)")
    .eq("id", params.id)
    .single();

  if (!listing) notFound();

  const { data: related } = await adminClient
    .from("marketplace_listings")
    .select("*, profiles(full_name, avatar_url)")
    .eq("category", listing.category)
    .eq("status", "activ")
    .neq("id", params.id)
    .order("created_at", { ascending: false })
    .limit(4);

  return (
    <>
      <Navbar />
      <ListingDetailClient listing={listing} related={related ?? []} />
    </>
  );
}
