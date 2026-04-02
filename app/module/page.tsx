"use client"

import Image from "next/image";
import heroImg from "@/public/Modules/hero-img.png";
import mail from "@/public/Modules/mail.svg";
import Link from "next/link";
import { ResourcesFooter } from "@/components/layouts/ResourcesFooter";
import { ModuleCard } from "@/components/module/ModuleCard";
import { NavbarNoSearch } from "@/components/layouts/NavbarNoSearch";

const Module = () => {
  return (
    <>
      <NavbarNoSearch />

      <div
        style={{ backgroundImage: `url(${heroImg.src})` }}
        className="h-[220px] md:h-[241.5px] mt-17 bg-cover px-10 md:px-38.25 py-6"
      >
        <div className="text-white text-[13.5px] flex items-center gap-2 font-light px-2">
          <Link href="/">Home</Link>
          <p> / </p>
          <p>Module</p>
        </div>
        <div className="flex flex-col pt-17 md:pt-18 pb-1 md:pb-0">
          <p className="text-[#E4E4E4] text-[13.25px] origin-top scale-y-95 leading-1">
            4CS017
          </p>
          <h1 className="text-[5.5vw] md:text-[46px] font-bold tracking-tight bg-linear-to-b from-[#ACFF76] via-[#90DF5D] to-primary bg-clip-text text-transparent">
            Internet Software Architecture
          </h1>
          <div className="flex items-center mt-1 ml-2 gap-3">
            <Image src={mail} alt="mail-img" className="w-4.5 h-4.5" />
            <a
              href="mailto:bishal.khadka@heraldcollege.edu.np"
              className="underline underline-offset-2 text-white/80 text-[14px]"
            >
              bishal.khadka@heraldcollege.edu.np
            </a>
          </div>
        </div>
      </div>
      <div className="mb-45 md:mb-75">
        <div className="px-10 md:px-37.5 mt-10 md:mt-15 w-full md:w-[72.5%]">
          <h3 className="text-[20px] md:text-[23px] tracking-[-0.035em] font-semibold">
            👋Welcome to ISA!
          </h3>
          <p className="text-[14px] md:text-[15.5px] tracking-tight md:tracking-normal mt-4.75 text-black/60 px-0.75 leading-4.5 md:leading-6 font-light">
            Here, you'll discover lesson plan and additional resources for this
            module. If you have any suggestions, please feel free to reach out
            to me. This list also contains extra resources required for the
            module, excluding resources such as lecture slides, tutorial
            classes, and workshop classes, which can be found in my second
            teacher app.
          </p>
        </div>
        <div className="px-10 md:px-38 mt-10 w-full md:w-[72.5%]">
          <h3 className="text-[20px] md:text-[23px] tracking-[-0.035em] font-semibold">
            Overview and Purpose
          </h3>
          <p className="text-[14px] md:text-[15.5px] tracking-tight md:tracking-normal mt-2 text-black/60 pl-0.25 leading-4.5 md:leading-6 font-light">
            This module focuses on how modern software applications are built
            and structured, with an emphasis on understanding how different
            layers of hardware and software exchange data over the web via HTTP
            services.
          </p>
        </div>
        <div className="px-10 md:px-38 mt-10 w-full md:w-[72.5%]">
          <h3 className="text-[20px] md:text-[23px] tracking-[-0.035em] font-semibold">
            Learning Outcomes
          </h3>
          <p className="text-[14px] md:text-[15.5px] tracking-tight md:tracking-normal mt-4.75 text-black/60 px-0.75 leading-4.5 md:leading-6 font-light flex flex-col">
            <span>
              1. Understand Internet and Cloud-based software architectures and
              related technologies, tools and techniques.
            </span>
            <span>
              2. Design a suitable architecture depending on a set of
              requirements and constraints.
            </span>
            <span>
              3. Implement a simple distributed application using appropriate
              architecture and suitable technologies.
            </span>
          </p>
          <div>
            <h3 className="text-[23px] tracking-[-0.035em] font-semibold mt-10 pl-0.5">
              Lesson Plan and Extra Resources
            </h3>
          </div>
        </div>
        <ModuleCard />
      </div>
      <footer>
        <ResourcesFooter />
      </footer>
    </>
  );
};

export default Module
