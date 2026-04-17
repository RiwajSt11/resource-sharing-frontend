import { ResourcesCard } from "@/components/layouts/ResourcesCard";
// import cardInfo from "@/data/RecentlyAddedData";
import { Module } from "@/types/Module";
import { ResourcesCardSkeleton } from "../layouts/ResourcesCardSkeleton";

interface Props {
  modules: Module[];
  loading?: boolean;
}
export const RecentlyAddedLayout = ({ modules, loading }: Props) => {
  if (loading) {
    return (
      <>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="snap-center">
            <ResourcesCardSkeleton />
          </div>
        ))}
      </>
    );
  }
  const filteredModules = [...modules]
  .sort(
    (a, b) =>
      (b.updatedAt ? new Date(b.updatedAt).getTime() : 0) -
      (a.updatedAt ? new Date(a.updatedAt).getTime() : 0)
  )
  .slice(0, 3);
  return (
    <>
      {filteredModules.length > 0 ? (
        filteredModules.map((module, index) => (
          <div key={index} className="snap-center">
            <ResourcesCard
              code={module.code}
              title={module.name}
              module={module.code}
              level={module.level}
              description={module.description}
              time={module.time_label}
              image={module.image_url}
              people_photos={module.people_photos || []}
            />
          </div>
        ))
      ) : (
        <div className="w-full md:col-span-2 lg:col-span-3 mt-10 mb-5 flex items-center justify-center text-xl text-black/60">
          No results found
        </div>
      )}
    </>
  );
};
