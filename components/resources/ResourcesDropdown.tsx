"use client";

import Link from "next/link";
import { Module } from "@/types/Module";

interface Props {
  show: boolean;
  setShow: (value: boolean) => void;
  modules: Module[];
  loading: boolean;
}

const levels = [4, 5, 6];

const groupModules = (modules: Module[]) => {
  return levels.map((level) => {
    const levelModules = modules.filter((m) => m.level === level);
    const semesters = [...new Set(levelModules.map((m) => m.semester))].sort();
    return {
      level,
      semesters: semesters.map((sem) => ({
        semester: sem,
        items: levelModules.filter((m) => m.semester === sem),
      })),
    };
  });
};

const DropdownSkeleton = () => (
  <div className="flex gap-1 md:gap-9 text-[14px] font-extralight mt-4.25">
    {levels.map((level) => (
      <div key={level} className="flex flex-col gap-8">
        {[1, 2].map((sem) => (
          <div key={sem} className="flex flex-col gap-3 items-center justify-center">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-3 w-32 bg-white/20 animate-pulse rounded"
              />
            ))}
          </div>
        ))}
      </div>
    ))}
  </div>
);

export const ResourcesDropdown = ({ show, setShow, modules, loading }: Props) => {
  const grouped = groupModules(modules);

  return (
    <>
      <div
        className={`fixed top-18 h-[50%] w-full text-white bg-[#303030]/85 flex gap-10 md:gap-25 pl-10 md:pl-69.5 py-6.5 z-520 origin-top transition-all duration-600 ${show ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0"}`}
      >
        <div>
          <h2 className="text-[19.5px] font-medium">Level</h2>
          <div className="flex flex-col mt-19.25 ml-0.25 gap-3.75 font-light text-[13px] tracking-wider">
            {levels.map((level, index) => (
              <h4
                key={index}
                className="transition-colors duration-300 hover:text-primary"
              >
                Level {level}
              </h4>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-[19.5px] font-medium ml-6 md:ml-20">Modules</h2>

          {loading ? (
            <DropdownSkeleton />
          ) : (
            <div className="flex gap-1 md:gap-9 text-[14px] font-extralight mt-4.25">
              {grouped.map(({ level, semesters }) => (
                <div key={level} className="flex flex-col gap-8">
                  {semesters.map(({ semester, items }) => (
                    <div
                      key={semester}
                      className="flex flex-col gap-3 items-center justify-center"
                    >
                      {items.map((module) => (
                        <Link
                          href={`/course/${module.code}`}
                          key={module.code}
                          className="transition-colors duration-300 hover:text-primary"
                        >
                          {module.code} {module.name}
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {show && (
        <div
          className="fixed inset-0 z-90"
          onClick={() => setShow(false)}
        ></div>
      )}
    </>
  );
};