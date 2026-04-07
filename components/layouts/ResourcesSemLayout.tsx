import { cardInfo } from "@/data/ResourcesCardData";
import { ResourcesCard } from "./ResourcesCard";

import { useEffect, useState } from "react";
import {getModules} from "@/libs/services/moduleService";
import { Module } from "@/types/Module";
import { modules } from "@/data/ModulesData";

interface Props {
  search: string;
  level: number;
  sem: number;
}

export const ResourcesSemLayout = ({ search, level, sem }: Props) => {
  const [modules, setModules] = useState<Module[]>([]);
  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await getModules();
        console.log(response.data);
        setModules(response.data);
      } catch (error) {
        console.error("Error fetching modules:", error);
      }
    };
    fetchModules();
  }, []);
  // const filteredModules = cardInfo
  //   .filter((card) => level === card.level && sem === card.sem)
  //   .filter(
  //     (card) =>
  //       card.title.toLowerCase().includes(search.toLowerCase()) ||
  //       card.module.toLowerCase().includes(search.toLowerCase()),
  //   );
  const filteredModules = modules
    .filter((module) => module.level === level && module.semester == sem)
    .filter(
      (module) =>
        module.name.toLowerCase().includes(search.toLowerCase()) ||
        module.code.toLowerCase().includes(search.toLowerCase()),
    );
  console.log(filteredModules);
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
