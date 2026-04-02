import { ResourcesCard } from "@/components/layouts/ResourcesCard";
import img1 from "@/public/Landing/img1.svg";
import img2 from "@/public/Landing/img2.svg";
import img3 from "@/public/Landing/img3.svg";

export const OngoingModulesLayout = () => {
  const cardInfo = [
    {
      title: "Distributed and Cloud Systems Programming",
      module: "5CS022",
      level: 5,
      description:
        "In this module, you will learn how to program, using the programming language Python. You will then apply what you have learn to solve problems.",
      time: "Week 4 (Ongoing)",
      image: img3,
    },
    {
      title: "Human Computer Interaction",
      module: "5CS020",
      level: 5,
      description:
        "In this module, you will learn how to program, using the programming language Python. You will then apply what you have learn to solve problems.",
      time: "Week 4",
      image: img1,
    },
    {
      title: "Collaborative Development",
      module: "5CS024",
      level: 5,
      description:
        "In this module, you will learn how to program, using the programming language Python. You will then apply what you have learn to solve problems.",
      time: "Week 3",
      image: img2,
    },
  ];
  return (
    <>
      {cardInfo.map((card, index) => (
        <div key={index} className="snap-center">
          <ResourcesCard
            title={card.title}
            module={card.module}
            level={card.level}
            description={card.description}
            time={card.time}
            image={card.image}
          />
        </div>
      ))}
    </>
  );
};
