import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const instruments = [
 {
    name: "Guitar",
    image: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=500&q=60",
    description: "Learn acoustic and electric guitar techniques from professional musicians.",
    expert: "Top-tier guitarists with years of studio and stage experience.",
    offer: "20% off for first 3 months & free trial class.",
    group: "Weekend group jam sessions & theory workshops.",
  },
  {
    name: "Vocal",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=500&q=60",
    description: "Master your voice with our comprehensive vocal training program.",
    expert: "Trained vocalists and performing artists as your mentors.",
    offer: "Get one free session with every referral.",
    group: "Live group singing sessions every Thursday.",
  },
  {
    name: "Drum",
    image: "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?auto=format&fit=crop&w=500&q=60",
    description: "Develop rhythm and technique with our expert drum instructors.",
    expert: "Drummers who have toured nationally and internationally.",
    offer: "Buy 2 months, get 1 month free.",
    group: "Weekly rhythm circle for practice & fun.",
  },
  {
    name: "Piano",
    image: "https://images.unsplash.com/photo-1571974599782-87624638275e?auto=format&fit=crop&w=500&q=60",
    description: "From classical to contemporary, learn piano at any skill level.",
    expert: "Award-winning concert pianists and studio performers.",
    offer: "Free theory booklet on signup.",
    group: "Small group theory & sight-reading sessions.",
  },
 {
    name: "Guitar",
    image: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=500&q=60",
    description: "Learn acoustic and electric guitar techniques from professional musicians.",
    expert: "Top-tier guitarists with years of studio and stage experience.",
    offer: "20% off for first 3 months & free trial class.",
    group: "Weekend group jam sessions & theory workshops.",
  },
  {
    name: "Vocal",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=500&q=60",
    description: "Master your voice with our comprehensive vocal training program.",
    expert: "Trained vocalists and performing artists as your mentors.",
    offer: "Get one free session with every referral.",
    group: "Live group singing sessions every Thursday.",
  },
  {
    name: "Drum",
    image: "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?auto=format&fit=crop&w=500&q=60",
    description: "Develop rhythm and technique with our expert drum instructors.",
    expert: "Drummers who have toured nationally and internationally.",
    offer: "Buy 2 months, get 1 month free.",
    group: "Weekly rhythm circle for practice & fun.",
  },
  {
    name: "Piano",
    image: "https://images.unsplash.com/photo-1571974599782-87624638275e?auto=format&fit=crop&w=500&q=60",
    description: "From classical to contemporary, learn piano at any skill level.",
    expert: "Award-winning concert pianists and studio performers.",
    offer: "Free theory booklet on signup.",
    group: "Small group theory & sight-reading sessions.",
  },
];

export default function Classes() {
  const navigate = useNavigate();

  const handleLearnMore = (instrument) => {
    navigate("/music-lab", { state: { instrument } });
  };

  return (
    <div className="py-16 px-4 bg-gray-50">
      <div className="text-center mb-12">
        <p className="text-red-600 font-semibold tracking-widest uppercase">Our Class</p>
        <h1 className="text-5xl font-bold my-4">Musical Instruments</h1>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Explore our wide range of musical instrument classes guided by expert musicians and educators.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 max-w-7xl mx-auto">
        {instruments.map((instrument, index) => (
          <Card key={index} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300">
            <div className="h-48 overflow-hidden rounded-t-xl">
              <img
                src={instrument.image}
                alt={instrument.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/500x300?text=Instrument+Image";
                }}
              />
            </div>
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-semibold mb-2 text-gray-800">{instrument.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{instrument.description}</p>
              <Button
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full transition duration-300"
                onClick={() => handleLearnMore(instrument)}
              >
                Learn More
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
