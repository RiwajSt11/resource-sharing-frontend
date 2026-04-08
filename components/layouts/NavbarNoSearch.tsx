"use client";

import Image from "next/image";
import HCKlogo from "@/public/Landing/HCKLogo.svg";
import arrow from "@/public/Landing/arrow.svg";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { ResourcesDropdown } from "@/components/resources/ResourcesDropdown";
import { SubmitRequest } from "./SubmitRequest";
import { getModules } from "@/libs/services/moduleService";
import { Module } from "@/types/Module";

const groupModules = (modules: Module[]) => {
  const levels = [4, 5, 6];
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

const MobileMenuSkeleton = () => (
  <>
    {[1, 2, 3].map((col) => (
      <div key={col} className="flex flex-col gap-8">
        {[1, 2].map((group) => (
          <div
            key={group}
            className="flex flex-col gap-3 items-start justify-center"
          >
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
  </>
);

export const NavbarNoSearch = () => {
  const [show, setShow] = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [submitOpen, setSubmitOpen] = useState<boolean>(false);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [menuOpen]);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await getModules();
        setModules(response.data);
      } catch (error) {
        console.error("Error fetching modules:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchModules();
  }, []);

  const grouped = groupModules(modules);

  return (
    <>
      <nav className="fixed top-0 left-0 z-30 w-full flex justify-between items-center bg-[#303030] h-[72px] px-[25px] md:px-[141.5px]">
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
        <div
          className={`hidden md:flex flex-row gap-5 items-center mr-2.25 ${submitOpen ? "-translate-x-66" : "translate-x-0"} transition-transform duration-500`}
        >
          <Link
            href="/"
            className="text-white text-sm mr-2.25 font-normal transition-colors duration-300 hover:text-primary"
          >
            Home
          </Link>
          <div
            className="text-white text-sm flex gap-2.75 items-center justify-center cursor-pointer transition-colors duration-300 hover:text-primary"
            onClick={() => setShow(!show)}
          >
            <span>Resources</span>
            <Image
              src={arrow}
              alt="arrow"
              className={`h-2 w-1.75 transition-transform duration-300 ${show ? "rotate-90" : "rotate-0"}`}
            />
          </div>
          <div className="text-white text-sm cursor-pointer transition-colors duration-300 hover:text-primary">
            Search
          </div>
        </div>
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => setSubmitOpen(!submitOpen)}
            className={`flex px-3.25 py-2.25 bg-primary text-white rounded-lg text-[10px] md:text-[13px] mr-2.5 cursor-pointer ${submitOpen ? "-translate-x-132.5" : "translate-x-0"} transition-transform duration-500`}
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

          {loading ? (
            <MobileMenuSkeleton />
          ) : (
            grouped.map(({ level, semesters }) => (
              <div key={level} className="flex flex-col gap-8">
                {semesters.map(({ semester, items }) => (
                  <div
                    key={semester}
                    className="flex flex-col gap-3 items-start justify-center"
                  >
                    {items.map((module) => (
                      <Link
                        href={`/course/${module.code}`}
                        key={module.code}
                        className="text-[14px] text-white/50 transition-colors duration-300 hover:text-primary"
                      >
                        {module.code} {module.name}
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      </div>

      {menuOpen && (
        <div
          className="fixed inset-0 z-60"
          onClick={() => setMenuOpen(false)}
        ></div>
      )}
      <ResourcesDropdown
        show={show}
        setShow={setShow}
        modules={modules}
        loading={loading}
      />
      <SubmitRequest submitOpen={submitOpen} setSubmitOpen={setSubmitOpen} />
    </>
  );
};
