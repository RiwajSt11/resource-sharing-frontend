import { ResourcesCard } from "@/components/layouts/ResourcesCard";
import { Module } from "@/types/Module";

interface Props {
  modules: Module[];
}

export const OngoingModulesLayout = ({ modules }: Props) => {
  const filteredModules = modules.filter(
    (module) => module.status === "ongoing",
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
        <div className="w-[1250px] mt-10 mb-5 flex items-center justify-center text-xl text-black/60">
          No results found
        </div>
      )}
    </>
  );
};
