import { ResourcesCard } from "@/components/layouts/ResourcesCard";
import { Module } from "@/types/Module";

interface Props {
  search: string;
  level: number;
  modules: Module[];
}

export const PreviousModulesLayout = ({ search, level, modules }: Props) => {
  const filteredModules = modules
    .filter((module) => module.level === level)
    .filter(
      (module) =>
        module.name.toLowerCase().includes(search.toLowerCase()) ||
        module.course_code.toLowerCase().includes(search.toLowerCase()),
    );
  console.log(filteredModules);
  return (
    <>
      {filteredModules.length > 0 ? (
        filteredModules.map((module, index) => (
          <div key={index} className="snap-center">
            <ResourcesCard
              title={module.name}
              module={module.course_code}
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
