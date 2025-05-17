// import { About } from "./About";

import About from "./About";


export default function  AboutUs() {
  return (
    <div className="w-full bg-white">
      {/* Header with background image */}
   <div 
        className="w-full min-h-[400px] py-16 px-4 border-b border-gray-200 relative bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80')",
          backgroundBlendMode: "overlay",
          backgroundColor: "rgba(0,0,0,0.3)"
        }}
      >
        <div className="container mx-auto relative z-10 h-full flex flex-col justify-center">
          <div className="flex justify-between items-center w-full">
            <h1 className="text-5xl font-bold text-white ml-16">About Us</h1>
            <div className="flex items-center text-sm text-gray-200 mr-18">
              <span>HOME</span>
              <span className="mx-2 text-white">&gt;&gt;</span>
              <span className="font-medium text-red-900">ABOUT US</span>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-black opacity-30 z-0"></div>
      </div>
    
        <About/>
    </div>
  );
}