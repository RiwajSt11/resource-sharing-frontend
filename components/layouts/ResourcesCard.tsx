"use client";

import clockImg from "@/public/Landing/clockImg.svg";
import circle from "@/public/Landing/circle.svg";
import explore from "@/public/Landing/explore.svg";
import Link from "next/link";
import Image from "next/image";

interface Props {
  code: string;
  title: string;
  module: string;
  level: number;
  description: string;
  image: string;
  time: string;
}

export const ResourcesCard = ({
  code,
  title,
  module,
  level,
  description,
  image,
  time,
}: Props) => {
  return (
    <Link
      href={`/course/${code}`}
      className="rounded-xl w-65 flex-shrink-0 md:w-full md:max-w-[360px] lg:max-w-100 mx-auto px-4.5 md:px-5.5 py-4.25 flex flex-col items-center shadow-[0px_0px_10px_rgba(0,0,0,0.28)] group cursor-pointer
      
    "
    >
      <div className="relative h-37 md:h-44 lg:h-52 w-full rounded-lg overflow-hidden">
        <Image
          src={image || "/default"}
          alt="image"
          fill
          className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-120"
        />
        <div
          className="absolute inset-0 flex flex-col items-center gap-18.5 
                  bg-black/30 opacity-0 group-hover:opacity-100 
                  transition-opacity duration-300"
        >
          <div className="flex">
            <Image
              src={explore}
              alt="explore-img"
              className="w-4 h-4 mt-23.5 pr-1"
            />
            <span className="text-white text-[11.5px] mt-23.5">
              Explore Content
            </span>
          </div>
          <span className="text-white text-[11px]">Files Shared: 12</span>
        </div>
      </div>
      <div className="flex justify-between items-center w-full text-[12.5px] mt-[14.5px] text-black/65 px-1.75">
        <p>Computer Science</p>
        <p>Level {level}</p>
      </div>
      <div className="leading-6.25 w-full mt-0.75 px-1.75">
        <h2 className="text-[16px] md:text-[21.25px] font-semibold tracking-tighter truncate">
          {title}
        </h2>
        <p className="text-[12.5px] text-black/65">{module}</p>
      </div>
      <p className="w-full text-[14px] text-black/80 mt-1.75 leading-4.25 px-1.75 line-clamp-3">
        {description}
      </p>
      <div className="flex justify-between w-full mt-auto pt-4 px-1.75 pl-2">
        <div className="flex gap-1 items-center mt-0.25">
          <Image
            src={clockImg}
            alt="clock"
            className="w-3.5 md:w-4.5 h-3.5 md:h-4.5"
          />
          <p className="text-[10.5px] md:text-[11.75px] text-black/50 pb-0.5">
            {time}
          </p>
        </div>
        <div className="flex relative w-[50%] items-center">
          <Image
            src={circle}
            alt="circle-img"
            className="w-4.5 md:w-6 h-4.5 md:h-6 absolute z-20 right-0"
          />
          <Image
            src={circle}
            alt="circle-img"
            className="w-4.5 md:w-6 h-4.5 md:h-6 absolute z-10 right-4 transition-all ease-in-out duration-500 group-hover:right-6.5"
          />
          <Image
            src={circle}
            alt="circle-img"
            className="w-4.5 md:w-6 h-4.5 md:h-6 absolute z-0 right-8 transition-all ease-in-out duration-500 group-hover:right-13"
          />
        </div>
      </div>
    </Link>
  );
};
