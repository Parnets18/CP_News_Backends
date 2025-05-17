
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Music, Guitar, Mic2, ArrowRight } from "lucide-react";
import { MusicQuoteCarousel } from "../Pages/MusicQuoteCarousel";
import  About  from "./About";
import Classes from "./Classes";
import FeatureSection from "./FeatureSection";


export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
     
      
      {/* Hero Section */}
      <section className="flex-grow">
        <div className="h-[80vh] bg-[url('https://publications.csba.org/wp-content/uploads/2023/02/arts-education-lead.jpg')] bg-cover bg-center text-white overflow-hidden relative">
          {/* Animated background elements */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            transition={{ duration: 2 }}
            className="absolute inset-0 overflow-hidden"
          >
            <Music className="absolute top-1/4 left-1/4 h-32 w-32 text-amber-400/20" />
            <Guitar className="absolute bottom-1/3 right-1/4 h-40 w-40 text-amber-400/20" />
            <Mic2 className="absolute top-1/3 right-1/3 h-28 w-28 text-amber-400/20" />
          </motion.div>

          <div className="container mx-auto px-4 h-full flex flex-col items-center justify-center text-center relative z-10">
            {/* Main Heading with animation */}
            <motion.h1
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl text-red-400 md:text-7xl font-bold mb-6 tracking-wider"
            >
              WELCOME TO CP Sangeetha
            </motion.h1>

            {/* Divider with animation */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="w-24 h-1 bg-amber-400 my-8 origin-center"
            />

            {/* Tagline with staggered animation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.2 }}
            >
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl md:text-3xl font-light italic mb-8"
              >
                Where Words Leave Off,
              </motion.h2>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl md:text-3xl font-light italic"
              >
                Music Begins
              </motion.h2>
            </motion.div>

            {/* Description with fade-in */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="max-w-2xl text-lg text-gray-300 mb-12"
            >
              Experience the transformative power of music at CP Sangeetha. Our expert instructors guide students of all ages on their musical journey.
            </motion.p>

            {/* Buttons with hover animations */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <Button 
                className="bg-amber-500 hover:bg-amber-600 text-black font-bold py-6 px-8 text-lg transition-all duration-300 hover:scale-105"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="flex items-center gap-2">
                  Discover More <ArrowRight className="h-5 w-5" />
                </span>
              </Button>
            </motion.div>

            {/* Floating music notes animation */}
            <motion.div 
              className="absolute bottom-20 left-0 right-0 flex justify-center gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              {['♪', '♫', '♩', '♬'].map((note, i) => (
                <motion.span
                  key={i}
                  className="text-amber-400 text-2xl"
                  animate={{ 
                    y: [0, -15, 0],
                    opacity: [0.6, 1, 0.6]
                  }}
                  transition={{ 
                    duration: 2 + Math.random(),
                    repeat: Infinity,
                    delay: i * 0.3
                  }}
                >
                  {note}
                </motion.span>
              ))}
            </motion.div>
          </div>
        </div>
      </section>
      <About/>

      

      {/* Additional Content Sections */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
        
        </div>
        <Classes/>
      </section>
      {/* Quote Carousel Section */}
      <section className="py-12 bg-gradient-to-r from-amber-50 to-amber-100">
        <MusicQuoteCarousel />
      </section>
      <section className="py-12 ">
       <FeatureSection/>
      </section>
    </div>
  );
}