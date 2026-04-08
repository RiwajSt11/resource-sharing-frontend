"use-client"

import { ResourcesSemLayout } from "@/components/layouts/ResourcesSemLayout";
import searchImg from "@/public/Landing/search.svg";
import { Carousel } from "./Carousel";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getModules } from "@/libs/services/moduleService";
import { Module } from "@/types/Module";

interface Props {
  searchRef?: React.RefObject<HTMLDivElement | null>;
  inputRef?: React.RefObject<HTMLInputElement | null>;
  level: number;
  search: string;
  setSearch: (value: string) => void;
  searchDiv: boolean;
}

export const ResourcesSemSection = ({
  searchRef,
  inputRef,
  level,
  search,
  setSearch,
  searchDiv,
}: Props) => {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await getModules();
        console.log(response.data);
        setModules(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching modules:", error);
      }
    };
    fetchModules();
  }, []);
  return (
    <div>
      <div className="flex flex-col-reverse md:flex-row justify-between items-start md:items-center px-2 md:px-2.75">
        <div className="flex flex-col items-start mb-0">
          <h1 className="text-[30px] md:text-[54.75px] font-extrabold tracking-tight scale-y-77 origin-top text-primary leading-12 pl-0.25">
            Resources
          </h1>
          <p className="leading-0 text-[18px] text-black/40 pl-1 tracking-tight">
            Level {level}
          </p>
        </div>
        {searchDiv && (
          <div className="hidden md:flex flex-row items-center gap-2.5 mt-0.5 mb-12 md:mb-0">
            <div
              className="flex items-center rounded-full w-55 md:w-95.5 border border-black/70 px-5.25 pl-4.5 py-[7.5px]"
              ref={searchRef}
            >
              <input
                ref={inputRef}
                type="text"
                placeholder="Search"
                className="w-full outline-none text-[13px]"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Image
                src={searchImg}
                alt="search-img"
                className="w-3 h-3 cursor-pointer"
              />
            </div>
            <button className="px-1 md:px-3.5 py-[4px] md:py-[7.5px] text-primary border border-primary rounded-3xl text-[11px] md:text-[13px] mr-1.5 cursor-pointer transition-colors duration-400 ease-in-out hover:bg-primary hover:text-white">
              Sort by Level
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col items-start w-full min-w-0">
        <h3 className="text-primary mt-10.5 text-[23px] tracking-tight scale-y-80 origin-top px-3">
          1st Semester
        </h3>
        <Carousel>
          <ResourcesSemLayout
            search={search}
            level={level}
            sem={1}
            modules={modules}
            loading={loading}
          />
        </Carousel>
      </div>
      <div className="flex flex-col items-start w-full min-w-0">
        <h3 className="text-primary mt-9 text-[23px] tracking-tight scale-y-80 origin-top px-3">
          2nd Semester
        </h3>
        <Carousel>
          <ResourcesSemLayout
            search={search}
            level={level}
            sem={2}
            modules={modules}
            loading={loading}
          />
        </Carousel>
      </div>
    </div>
  );
};
