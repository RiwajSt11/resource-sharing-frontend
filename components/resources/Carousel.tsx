interface Props {
  children: React.ReactNode;
}

export const Carousel = ({ children }: Props) => {
  // const scrollRef = useRef<HTMLDivElement | null>(null);
  // const [isInteracting, setIsInteracting] = useState(false);

  // const scrollAmount = 320;

  // const scrollLeft = () => {
  //   scrollRef.current?.scrollBy({
  //     left: -scrollAmount,
  //     behavior: "smooth",
  //   });
  // };

  // const scrollRight = () => {
  //   scrollRef.current?.scrollBy({
  //     left: scrollAmount,
  //     behavior: "smooth",
  //   });
  // };

  // 🔥 Auto slide (mobile only — lg grid doesn't scroll)
  // useEffect(() => {
  //   if (isInteracting) return;

  //   const interval = setInterval(() => {
  //     if (!scrollRef.current) return;
  //     const el = scrollRef.current;

  //     // Only auto-slide when in scroll mode (not grid)
  //     if (el.scrollWidth <= el.clientWidth) return;

  //     if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 10) {
  //       el.scrollTo({ left: 0, behavior: "smooth" });
  //     } else {
  //       el.scrollBy({ left: scrollAmount, behavior: "smooth" });
  //     }
  //   }, 3000);

  //   return () => clearInterval(interval);
  // }, [isInteracting]);

  return (
    <div
      className="relative overflow-hidden md:overflow-visible w-full"
      // onPointerDown={() => setIsInteracting(true)}
      // onPointerUp={() => setIsInteracting(false)}
      // onPointerLeave={() => setIsInteracting(false)}
      // onTouchStart={() => setIsInteracting(true)}
      // onTouchEnd={() => setIsInteracting(false)}
    >
      {/* Left Button — mobile only */}
      {/* <button
        onClick={scrollLeft}
        className="lg:hidden absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur p-2 rounded-full shadow-md text-sm"
      >
        ◀
      </button> */}

      {/* Right Button — mobile only */}
      {/* <button
        onClick={scrollRight}
        className="lg:hidden absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur p-2 rounded-full shadow-md text-sm"
      >
        ▶
      </button> */}

      {/* Scroll container on mobile / grid on desktop */}
      <div
        // ref={scrollRef}
        className="flex overflow-x-auto scroll-smooth snap-x snap-mandatory gap-4 mt-2.25 md:mt-0 px-2 md:px-0 py-3 md:py-0 ml-0.25 md:grid md:grid-cols-2 lg:grid lg:grid-cols-3 md:overflow-visible md:gap-4 md:gap-y-13"
        style={{ scrollbarWidth: "none" }}
      >
        {children}
      </div>
    </div>
  );
};
