import React from "react";
import {
  Users,
  Music,
  BookOpen,
  NotebookPen,
} from "lucide-react"; // or use any icon library

export default function FeatureSection() {
  const features = [
    {
      title: "Qualified Teachers",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.",
      icon: <Users className="w-12 h-12 text-pink-700" />,
    },
    {
      title: "Musical Compositions",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.",
      icon: <Music className="w-12 h-12 text-pink-700" />,
    },
    {
      title: "Unique Classes",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.",
      icon: <BookOpen className="w-12 h-12 text-pink-700" />,
    },
    {
      title: "Lessons",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.",
      icon: <NotebookPen className="w-12 h-12 text-pink-700" />,
    },
  ];

  return (
    <div className="py-20 px-4 bg-white">
      <h2 className="text-4xl md:text-3xl font-bold text-center text-black leading-snug max-w-4xl mx-auto mb-16">
        Genius Starts With a Note You Bring the Passion. <br />
        Together, We’ll Build Your Future.
      </h2>

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className="flex items-start p-6 rounded-lg bg-purple-50 shadow-sm"
          >
            <div className="mr-4">{feature.icon}</div>
            <div>
              <h3 className="text-lg font-semibold text-black mb-1">
                {feature.title}
              </h3>
              <p className="text-gray-700 text-sm">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
