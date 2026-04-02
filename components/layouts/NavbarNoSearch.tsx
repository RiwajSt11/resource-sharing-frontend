"use client"

import Image from "next/image";
import HCKlogo from "@/public/Landing/HCKLogo.svg";
import arrow from "@/public/Landing/arrow.svg";
import Link from "next/link";
import { modules } from "@/data/ModulesData";
import React, { useState } from "react";
import { ResourcesDropdown } from "@/components/resources/ResourcesDropdown";

export const NavbarNoSearch = () => {
  const [show, setShow] = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  React.useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [menuOpen]);

  return (
    <>
      <nav className="fixed top-0 left-0 z-50 w-full flex justify-between items-center bg-[#303030] h-[72px] px-[25px] md:px-[141.5px]">
        <div className="flex">
          <button
            className="md:hidden text-white text-2xl mr-2"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            ☰
          </button>
          <Link href="/">
            <Image
              src={HCKlogo}
              alt=""
              className="w-[120px] md:w-[140px] h-[35px] md:h-[48px]"
            />
          </Link>
        </div>
        <div className="hidden md:flex flex-row gap-5 items-center mr-2.25">
          <Link
            href="/"
            className="text-white text-sm mr-2.25 font-normal transition-colors duration-300 hover:text-primary"
          >
            Home
          </Link>
          <Link
            href=""
            className="text-white text-sm flex gap-2.75 items-center justify-center transition-colors duration-300 hover:text-primary"
            onClick={() => setShow(!show)}
          >
            <span>Resources</span>
            <Image
              src={arrow}
              alt="arrow"
              className={`h-2 w-1.75 transition-transform duration-300 ${show ? "rotate-90" : "rotate-0"}`}
            />
          </Link>
          <Link
            href=""
            className="text-white text-sm transition-colors duration-300 hover:text-primary"
          >
            Search
          </Link>
        </div>
        <div className="flex items-center">
          <button
            type="button"
            className="flex px-3.25 py-2.25 bg-primary text-white rounded-lg text-[10px] md:text-[13px] mr-2.5 cursor-pointer"
          >
            Request Resources
          </button>
        </div>
      </nav>
      <div
        className={`fixed top-[72px] left-0 h-[calc(100vh-72px)] w-[75%] bg-[#303030] text-white flex flex-col items-start gap-6 px-5 py-6 z-70 md:hidden overflow-y-auto transition-all duration-500 ${
          menuOpen
            ? "opacity-100 translate-x-0"
            : "opacity-0 -translate-x-15 pointer-events-none"
        }`}
      >
        <div className="px-5 flex flex-col items-start gap-6 text-[20px]">
          <Link href="/" onClick={() => setMenuOpen(false)}>
            Home
          </Link>

          <Link href="/resources">Resources</Link>
          {modules.map((column, colIndex) => (
            <div key={colIndex} className="flex flex-col gap-8">
              {column.map((group, groupIndex) => (
                <div
                  key={groupIndex}
                  className="flex flex-col gap-3 items-start justify-center"
                >
                  {group.items.map((item, itemIndex) => (
                    <Link
                      href="/module"
                      key={itemIndex}
                      className="text-[14px] text-white/50 transition-colors duration-300 hover:text-primary"
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
      {menuOpen && (
        <div
          className="fixed inset-0 z-60"
          onClick={() => setMenuOpen(false)}
        ></div>
      )}
      <ResourcesDropdown show={show} setShow={setShow} />
    </>
  );
};
