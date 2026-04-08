// components/ResourcesCardSkeleton.tsx

export const ResourcesCardSkeleton = () => {
  return (
    <div className="rounded-xl w-full max-w-65 md:max-w-100 lg:max-w-100 h-98 md:h-108.75 px-4.5 md:px-5.5 py-4.25 flex flex-col items-center shadow-[0px_0px_10px_rgba(0,0,0,0.28)]">
      {/* Image area */}
      <div className="h-37 lg:h-52 w-full rounded-lg bg-gray-200 animate-pulse" />

      {/* Computer Science / Level row */}
      <div className="flex justify-between items-center w-full mt-[14.5px] px-1.75">
        <div className="h-3 w-24 bg-gray-200 animate-pulse rounded" />
        <div className="h-3 w-12 bg-gray-200 animate-pulse rounded" />
      </div>

      {/* Title + module */}
      <div className="w-full mt-0.75 px-1.75 space-y-2">
        <div className="h-5 md:h-6 w-3/4 bg-gray-200 animate-pulse rounded" />
        <div className="h-3 w-1/2 bg-gray-200 animate-pulse rounded" />
      </div>

      {/* Description lines */}
      <div className="w-full mt-1.75 px-1.75 space-y-2">
        <div className="h-3 w-full bg-gray-200 animate-pulse rounded" />
        <div className="h-3 w-full bg-gray-200 animate-pulse rounded" />
        <div className="h-3 w-2/3 bg-gray-200 animate-pulse rounded" />
      </div>

      {/* Bottom row: clock + circles */}
      <div className="flex justify-between w-full mt-[25px] px-1.75 pl-2">
        {/* Clock + time */}
        <div className="flex gap-1 items-center">
          <div className="w-3.5 md:w-4.5 h-3.5 md:h-4.5 bg-gray-200 animate-pulse rounded-full" />
          <div className="h-3 w-16 bg-gray-200 animate-pulse rounded" />
        </div>

        {/* Overlapping circles */}
        <div className="flex relative w-[50%] items-center">
          <div className="w-4.5 md:w-6 h-4.5 md:h-6 rounded-full bg-gray-200 animate-pulse absolute z-20 right-0" />
          <div className="w-4.5 md:w-6 h-4.5 md:h-6 rounded-full bg-gray-300 animate-pulse absolute z-10 right-4" />
          <div className="w-4.5 md:w-6 h-4.5 md:h-6 rounded-full bg-gray-200 animate-pulse absolute z-0 right-8" />
        </div>
      </div>
    </div>
  );
};
