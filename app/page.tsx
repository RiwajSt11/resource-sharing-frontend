"use client";

import { useState } from "react";

import searchImg from "@/public/Landing/search.svg";
import Image from "next/image";

import { useRef } from "react";

import { RecentlyAddedLayout } from "@/components/resources/RecentlyAddedLayout";
import { OngoingModulesLayout } from "@/components/resources/OngoingModulesLayout";
import { PreviousModulesLayout } from "@/components/resources/PreviousModulesLayout";

import { Navbar } from "@/components/layouts/Navbar";
import { ResourcesFooter } from "@/components/layouts/ResourcesFooter";
import { ResourcesHero } from "@/components/resources/ResourcesHero";
import { Carousel } from "@/components/resources/Carousel";

import { getModules } from "@/libs/services/moduleService";
import { useEffect } from "react";
import { Module } from "@/types/Module";

function ResourcesLanding() {
  const [search, setSearch] = useState<string>("");

  const searchRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const handleScrollToSearch = () => {
    const yOffset = -120;
    const element = searchRef.current;

    if (element) {
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;

      window.scrollTo({ top: y, behavior: "smooth" });
    }
    setTimeout(() => {
      inputRef.current?.focus();
    }, 500);
  };

  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await getModules();
     
        setModules(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching modules:", error);
      }
    };
    fetchModules();
  }, []);

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <header>
          <Navbar
            search={search}
            setSearch={setSearch}
            handleScrollToSearch={handleScrollToSearch}
          />
        </header>

        <div className="flex-1">
          <ResourcesHero />
          <div className="px-5 pr-0 md:px-38 mt-8 md:mt-15.75">
            <h1 className="text-[24px] md:text-[32.25px] text-black/90 font-semibold tracking-tight flex gap-1.5 ml-0.5 md:mb-7.75">
              <span>Recently</span>
              <span>Added</span>
              <span>Materials</span>
            </h1>
            <Carousel>
              <RecentlyAddedLayout modules={modules} loading={loading} />
            </Carousel>
          </div>
          <div className="px-5 pr-0 md:px-38 mt-8 md:mt-24">
            <h1 className="text-[24px] md:text-[32.25px] text-black/90 font-semibold tracking-tight flex gap-1.5 ml-0.5 md:mb-7.75">
              <span>Ongoing</span>
              <span>Modules</span>
            </h1>
            <Carousel>
              <OngoingModulesLayout modules={modules} loading={loading} />
            </Carousel>
          </div>
          <div
            className="px-5 pr-0 md:px-37.5 mt-20 md:mt-[87px] mb-10 scroll-mt-35"
            ref={searchRef}
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-4.5 md:px-0">
              <h1 className="text-[24px] md:text-[32.25px] text-black/90 font-semibold tracking-tight flex gap-1.5 ml-0.5">
                <span>Previous</span>
                <span>Modules</span>
              </h1>
              <div className="flex items-center gap-2.5">
                <div className="flex items-center rounded-full w-55 md:w-96 border border-black/50 px-5 py-[5px] md:py-[7.25px] mt-5 md:mt-0">
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search"
                    className="w-full outline-none text-[13.25px]"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <Image
                    src={searchImg}
                    alt="search-img"
                    className="w-3 h-3 cursor-pointer"
                  />
                </div>
                <button className="px-1 md:px-3.25 py-[4px] md:py-2 text-primary border border-primary rounded-3xl text-[11px] md:text-[13px] mr-1.5 cursor-pointer transition-colors duration-400 ease-in-out hover:bg-primary hover:text-white hidden md:flex justify-center items-center">
                  Sort by Level
                </button>
              </div>
            </div>
            <div>
              <div>
                <h2 className="text-primary text-[16px] md:text-[18px] font-medium tracking-widest mt-9.75 ml-4.5 md:mb-5.5">
                  Level - 4
                </h2>
                <div className="md:mx-0.75">
                  <Carousel>
                    <PreviousModulesLayout
                      level={4}
                      search={search}
                      modules={modules}
                      loading={loading}
                    />
                  </Carousel>
                </div>
              </div>
              <div className="mt-10 md:mt-23.75">
                <h2 className="text-primary text-[18px] font-medium tracking-widest ml-4.5 md:mb-5.5">
                  Level - 5
                </h2>
                <div className="md:mx-0.75">
                  <Carousel>
                    <PreviousModulesLayout
                      level={5}
                      search={search}
                      modules={modules}
                      loading={loading}
                    />
                  </Carousel>
                </div>
              </div>
            </div>
          </div>
        </div>
        <footer className="mt-15 md:mt-42">
          <ResourcesFooter />
        </footer>
      </div>
    </>
  );
}

export default ResourcesLanding;
