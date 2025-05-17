import React from "react";
import { useLocation } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function MusicLabSection() {
  const { state } = useLocation();
  const instrument = state?.instrument;

if (!instrument) return <div className="p-10 text-center text-gray-500">No class data available.</div>;

  return (
    <div className="max-w-7xl mx-auto py-16 px-4 md:px-8">
      <div className="grid md:grid-cols-2 gap-12 items-start">
        {/* Accordion Section */}
        <div>
          <h2 className="text-4xl font-bold mb-8 text-gray-800">
            Learn More About {instrument.name} at MusicLab
          </h2>
          <Accordion type="single" collapsible className="w-full space-y-4">
            <AccordionItem value="expert">
              <AccordionTrigger className="bg-red-700 text-white px-4 py-3 rounded font-semibold">
                Expert Teacher
              </AccordionTrigger>
              <AccordionContent className="p-4 bg-white border border-gray-200 rounded-b text-gray-700">
                {instrument.expert}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="offer">
              <AccordionTrigger className="bg-gray-200 px-4 py-3 rounded font-semibold">
                Special Offers
              </AccordionTrigger>
              <AccordionContent className="p-4 bg-white border border-gray-200 rounded-b text-gray-700">
                {instrument.offer}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="group">
              <AccordionTrigger className="bg-gray-100 px-4 py-3 rounded font-semibold">
                Learning Groups
              </AccordionTrigger>
              <AccordionContent className="p-4 bg-white border border-gray-200 rounded-b text-gray-700">
                {instrument.group}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Class Image */}
        <div className="text-center md:text-left">
          <h3 className="text-3xl font-bold text-gray-900 mb-2">{instrument.name}</h3>
          <p className="text-gray-600 mb-6">{instrument.description}</p>
          <img
            src={instrument.image}
            alt={instrument.name}
            className="rounded-xl shadow-md w-full max-h-[400px] object-cover"
          />
        </div>
      </div>
    </div>
  );
}
