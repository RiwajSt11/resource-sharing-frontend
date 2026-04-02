import heraldFooterLogo from "@/public/Landing/heraldFooterLogo.svg";
import Image from "next/image";

export const ResourcesFooter = () => {
  return (
    <div className="w-full overflow-hidden h-[128px] md:h-[73px] pl-[35px] md:pl-[151px] pb-5 md:pb-0.5 bg-[#303030] flex flex-col md:flex-row items-center justify-between text-white text-[11.75px] pr-[40px] md:pr-[169.5px] tracking-wider font-extralight">
      <Image
        src={heraldFooterLogo}
        alt="herald-college-logo"
        className="w-30 md:w-51.5 h-18 md:h-27.75"
      />
      <p className="mr-3.25 text-center mb-2 md:mb-0">
        © 2025-2026 Herald College Kathmandu{" "}
        <span className="text-[9.5px]">|</span> All Rights Reserved
      </p>
      <p>
        <span className="underline underline-offset-2">Privacy Policy</span>
        <span className="text-[9.5px]"> | </span>
        <span className="underline underline-offset-2">Copyright Policy</span>
      </p>
    </div>
  );
};
