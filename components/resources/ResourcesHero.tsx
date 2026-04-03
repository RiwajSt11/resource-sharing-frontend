"use client";

import Link from "next/link";
import image1 from "@/public/Landing/image1.svg";
import image2 from "@/public/Landing/image2.svg";
import image3 from "@/public/Landing/image3.svg";
import image4 from "@/public/Landing/image4.svg";
import Image from "next/image";

import { useEffect, useState } from "react";

export const ResourcesHero = () => {
  const images: string[] = [image1, image2, image3, image4];
  const [index, setIndex] = useState<number>(0);
  const [sliderIndex, setSliderIndex] = useState<number>(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex: number) => (prevIndex + 1) % images.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);
  const slidingWords = ["Resources.", "Materials.", "Guides.", "Reference."];

  useEffect(() => {
    const interval = setInterval(() => {
      setSliderIndex((prev) => (prev + 1) % slidingWords.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const container = {
    height: "40px",
    overflow: "hidden",
  };

  const slider = {
    transition: "transform 0.5s ease",
  };

  const item = {
    height: "40px",
    display: "flex",
    alignItems: "center",
  };
  return (
    <div className="relative slider w-full overflow-hidden mt-18">
      <div
        className="sliderTrack h-[220px] md:h-[477.75px] w-full flex transition-transform duration-700 ease-in-out scroll-smooth "
        style={{
          transform: `translateX(-${index * 100}%)`,
        }}
      >
        {images.map((img: string, i: number) => (
          <Image
            key={i}
            src={img}
            alt={`slide-${i}`}
            className=" h-full object-cover "
          />
        ))}
      </div>
      <div className="hidden absolute w-[600px] z-10 top-10 md:top-21.25 left-4 md:left-32.25 p-6 md:flex flex-col gap-0 md:gap-4">
        <div className="text-white text-[28px] md:text-[43px] tracking-[-0.0085em] leading-5 md:leading-12 font-[600]  mb-3 md:mb-0">
          <div className="flex gap-1.5">
            <span>Push</span>
            <span>Yourself</span>
            <span>With</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-primary">Extra</span>
            <div style={container}>
              <div
                style={{
                  ...slider,
                  transform: `translateY(-${sliderIndex * 40}px)`,
                }}
              >
                {slidingWords.map((word, i) => (
                  <div key={i} style={item}>
                    {word}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <p className="hidden md:flex text-white text-[17.25px] mt-2.75 leading-5.75">
          Why limit yourself with normal study materials when you can <br />
          push your limits with extra materials provided by your module <br />
          leader/ tutors themselves.
        </p>
        <Link href="/resources"
          className="relative text-[10px] md:text-[12.5px] text-white mt-2.5 md:mt-3.5 px-1 py-2.5 w-27 md:w-36 overflow-hidden rounded-full group cursor-pointer text-center"
          
        >
          <div className="absolute inset-0 border border-white rounded-full z-10 group-hover:border-primary transition-all duration-0 delay-100"></div>

          <span className="relative z-10">Find Your Resource</span>

          <span className="absolute left-0 top-0 h-full w-0 rounded-full bg-primary transition-all duration-400 ease-out group-hover:w-full"></span>
        </Link>
      </div>
    </div>
  );
};
