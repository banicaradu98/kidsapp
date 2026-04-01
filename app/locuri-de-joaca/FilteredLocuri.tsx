import ListingCard, { Listing } from "@/app/components/ListingCard";
import EmptyState from "@/app/components/EmptyState";

export default function FilteredLocuri({ listings }: { listings: Listing[] }) {
  if (listings.length === 0) {
    return <EmptyState title="Niciun loc de joacă găsit" subtitle="Revino curând — actualizăm constant locurile de joacă din Sibiu." />;
  }

  return (
    <div className="flex flex-col gap-4 sm:grid sm:grid-cols-2">
      {listings.map((l) => <ListingCard key={l.id} listing={l} />)}
    </div>
  );
}
