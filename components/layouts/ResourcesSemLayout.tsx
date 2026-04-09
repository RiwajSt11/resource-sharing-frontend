import { cardInfo } from "@/data/ResourcesCardData";
import { ResourcesCard } from "./ResourcesCard";

import { Module } from "@/types/Module";
import { modules } from "@/data/ModulesData";
import { ResourcesCardSkeleton } from "./ResourcesCardSkeleton";

interface Props {
  search: string;
  level: number;
  sem: number;
  modules: Module[];
  loading: boolean;
}

export const ResourcesSemLayout = ({
  search,
  level,
  sem,
  modules,
  loading,
}: Props) => {
  // const filteredModules = cardInfo
  //   .filter((card) => level === card.level && sem === card.sem)
  //   .filter(
  //     (card) =>
  //       card.title.toLowerCase().includes(search.toLowerCase()) ||
  //       card.module.toLowerCase().includes(search.toLowerCase()),
  //   );

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
  const filteredModules = modules
    .filter((module) => module.level === level && module.semester == sem)
    .filter(
      (module) =>
        module.name.toLowerCase().includes(search.toLowerCase()) ||
        module.code.toLowerCase().includes(search.toLowerCase()),
    );
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
            />
          </div>
        ))
      ) : (
        <div className="w-[1250px] mt-15 flex items-center justify-center text-xl text-black/60">
          No results found
        </div>
      )}
    </>
  );
};
