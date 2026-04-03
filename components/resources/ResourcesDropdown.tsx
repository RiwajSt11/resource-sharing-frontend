"use client";

import Link from "next/link";
import { modules } from "@/data/ModulesData";

interface Props {
  show: boolean;
  setShow: (value: boolean) => void;
}

const levels = [4, 5, 6];

export const ResourcesDropdown = ({ show, setShow }: Props) => {
  return (
    <>
      <div
        className={`fixed top-18 h-86.5 w-full text-white bg-[#303030]/85 flex gap-10 md:gap-25 pl-10 md:pl-69.5 py-6.5 z-520 origin-top transition-all duration-600 ${show ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0"}`}
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

          <div className="flex gap-1 md:gap-9 text-[14px] font-extralight mt-4.25">
            {modules.map((column, colIndex) => (
              <div key={colIndex} className="flex flex-col gap-8">
                {column.map((group, groupIndex) => (
                  <div
                    key={groupIndex}
                    className="flex flex-col gap-3 items-center justify-center"
                  >
                    {group.items.map((item, itemIndex) => (
                      <Link
                        href="/module"
                        key={itemIndex}
                        className="transition-colors duration-300 hover:text-primary"
                      >
                        {item}
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
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
