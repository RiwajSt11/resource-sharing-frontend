"use client";

import { WeekData } from "@/data/WeekData";
import deck from "@/public/Modules/deck.svg";
import deckOpen from "@/public/Modules/deck-open.svg";
import { useState } from "react";
import Image from "next/image";
import { Module } from "@/types/Module";

interface Props {
  module: Module;
}

export const ModuleCard = ({ module }: Props) => {
  const WeekData = module.weeks || [];
  const [showCard, setShowCard] = useState<number[]>([]);
  const handleClick = (number: number) => {
    if (showCard.includes(number)) {
      setShowCard(showCard.filter((card) => card != number));
    } else {
      setShowCard([...showCard, number]);
    }
  };
  return (
    <div className="mt-4.5 flex flex-col md:grid md:grid-cols-2 gap-3 items-start w-full px-10 md:px-37.5 pl-10 md:pl-38.5">
      <div className="flex flex-col gap-3.75">
        {WeekData.filter((week) => week.number <= 6)
          .sort((a, b) => a.number - b.number)
          .map((week) => (
            <div
              key={week.number}
              className={`border w-[99%] md:w-[99%] border-black/10 rounded-lg px-5.5 cursor-pointer transition-all duration-500 ${showCard.includes(week.number) ? "shadow-lg" : ""}`}
              onClick={() => handleClick(week.number)}
            >
              <div className="flex justify-between items-center py-3">
                <div className="flex flex-col">
                  <p
                    className={`font-semibold transition-colors duration-500 ${showCard.includes(week.number) ? "text-primary" : " text-black/90"}`}
                  >
                    Week {week.number}
                  </p>
                  <p
                    className={`text-[14px] transition-colors duration-500 ${showCard.includes(week.number) ? "text-primary" : ""}`}
                  >
                    {week.title}
                  </p>
                </div>
                <div className="relative">
                  <Image
                    src={deck}
                    alt="deck-img"
                    className={`absolute inset-0 w-[19.25px] h-[19.25px] transition-opacity duration-700 ${showCard.includes(week.number) ? "opacity-0" : "opacity-100"}`}
                  />
                  <Image
                    src={deckOpen}
                    alt="deck-img"
                    className={`w-[19.25px] h-[19.25px] transition-opacity duration-700 ${showCard.includes(week.number) ? "opacity-100" : "opacity-0"}`}
                  />
                </div>
              </div>
              <div
                className={`grid transition-all duration-500 ease-in-out ${
                  showCard.includes(week.number)
                    ? "grid-rows-[1fr]"
                    : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <div
                    className={`border-t border-black/10 pt-5.25 flex mb-10.5 origin-top transition-all duration-500 ${showCard.includes(week.number) ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0"}`}
                  >
                    <div className="flex flex-1/2 flex-col">
                      <h3 className="text-[14px] text-black/80 font-semibold">
                        Contents
                      </h3>
                      <div>
                        <ul className="list-disc pl-5 pt-3 space-y-0.25 text-[13px] text-black/65">
                          {week.contents.map((content, index) => (
                            <li key={index} className="marker:text-[8px]">
                              {content}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="flex flex-col flex-1/2 pl-14.5">
                      <h3 className="text-[14px] text-black/80 font-semibold mb-2">
                        Extra Resources
                      </h3>
                      <div>
                        <ul className="pt-3 space-y-3.5 text-[13px] text-black/65">
                          {week.resources.map((resource, index) => (
                            <li key={index} className="marker:text-[8px]">
                              <a
                                href={resource.link}
                                className="inline-block underline underline-offset-2 transition-transform duration-400 ease-in-out hover:text-primary hover:translate-x-2"
                              >
                                {resource.name}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
      <div className="flex flex-col gap-3.75">
        {WeekData.filter((week) => week.number > 6)
          .sort((a, b) => a.number - b.number)
          .map((week) => (
            <div
              key={week.number}
              className={`border w-[99%] md:w-151 border-black/10 rounded-lg px-5.5 cursor-pointer transition-all duration-500 ${showCard.includes(week.number) ? "shadow-lg" : ""}`}
              onClick={() => handleClick(week.number)}
            >
              <div className="flex justify-between items-center py-3">
                <div className="flex flex-col">
                  <p
                    className={`font-semibold transition-colors duration-500 ${showCard.includes(week.number) ? "text-primary" : " text-black/90"}`}
                  >
                    Week {week.number}
                  </p>

                  <p
                    className={`text-[14px] transition-colors duration-500 ${showCard.includes(week.number) ? "text-primary" : ""} ${week.number == 7 || week.number == 12 ? "font-bold" : ""}`}
                  >
                    {week.title}
                  </p>
                </div>
                <div className="relative">
                  <Image
                    src={deck}
                    alt="deck-img"
                    className={`absolute inset-0 w-[19.25px] h-[19.25px] transition-opacity duration-700 ${showCard.includes(week.number) ? "opacity-0" : "opacity-100"}`}
                  />
                  <Image
                    src={deckOpen}
                    alt="deck-img"
                    className={`w-[19.25px] h-[19.25px] transition-opacity duration-700 ${showCard.includes(week.number) ? "opacity-100" : "opacity-0"}`}
                  />
                </div>
              </div>
              <div
                className={`grid transition-all duration-500 ease-in-out ${
                  showCard.includes(week.number)
                    ? "grid-rows-[1fr]"
                    : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <div
                    className={`border-t border-black/10 pt-5.25 flex mb-10.5 origin-top transition-all duration-500 ${showCard.includes(week.number) ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0"}`}
                  >
                    <div className="flex flex-1/2 flex-col">
                      <h3 className="text-[14px] text-black/80 font-semibold">
                        Contents
                      </h3>
                      <div>
                        <ul className="list-disc pl-5 pt-3 space-y-0.25 text-[13px] text-black/65">
                          {week.contents.map((content, index) => (
                            <li key={index} className="marker:text-[8px]">
                              {content}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="flex flex-col flex-1/2 pl-14.5">
                      <h3 className="text-[14px] text-black/80 font-semibold mb-2">
                        Extra Resources
                      </h3>
                      <div>
                        <ul className="pt-3 space-y-3.5 text-[13px] text-black/65">
                          {week.resources.map((resource, index) => (
                            <li key={index} className="marker:text-[8px]">
                              <a
                                href={resource.link}
                                className="inline-block underline underline-offset-2 transition-transform duration-400 ease-in-out hover:text-primary hover:translate-x-2"
                              >
                                {resource.name}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
