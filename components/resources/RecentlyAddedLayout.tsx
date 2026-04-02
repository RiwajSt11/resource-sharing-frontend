import { ResourcesCard } from "@/components/layouts/ResourcesCard";
import img1 from "@/public/Landing/img1.svg";
import img2 from "@/public/Landing/img2.svg";
import img3 from "@/public/Landing/img3.svg";

export const RecentlyAddedLayout = () => {
  const cardInfo = [
    {
      title: "Human Computer Interaction",
      module: "5CS020",
      level: 5,
      description:
        "In this module, you will learn how to program, using the programming language Python. You will then apply what you have learn to solve problems.",
      time: "2 hours ago",
      image: img1,
    },
    {
      title: "Collaborative Development",
      module: "5CS024",
      level: 5,
      description:
        "In this module, you will learn how to program, using the programming language Python. You will then apply what you have learn to solve problems.",
      time: "16 hours ago",
      image: img2,
    },
    {
      title: "Distributed and Cloud Systems Programming",
      module: "5CS022",
      level: 5,
      description:
        "In this module, you will learn how to program, using the programming language Python. You will then apply what you have learn to solve problems.",
      time: "2 days ago",
      image: img3,
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
