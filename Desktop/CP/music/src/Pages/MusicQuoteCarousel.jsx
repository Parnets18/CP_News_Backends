"use client";
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function MusicQuoteCarousel() {
  const quotes = [
    {
      text: '"Music Is An Agreeable Harmony For The Honor Of God And The Permissible Delights Of The Soul."',
      author: 'Johann Sebastian Bach'
    },
    {
      text: '"Music can change the world because it can change people."',
      author: 'Bono'
    },
    {
      text: '"Where words fail, music speaks."',
      author: 'Hans Christian Andersen'
    },
    {
      text: '"Music is the divine way to tell beautiful, poetic things to the heart."',
      author: 'Pablo Casals'
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextQuote = () => {
    setCurrentIndex((prev) => (prev === quotes.length - 1 ? 0 : prev + 1));
  };

  const prevQuote = () => {
    setCurrentIndex((prev) => (prev === 0 ? quotes.length - 1 : prev - 1));
  };

  // Auto-rotate every 5 seconds
  useEffect(() => {
    const interval = setInterval(nextQuote, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative max-w-3xl mx-auto my-12 p-6 bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg shadow-lg">
      {/* Quote Content */}
      <div className="text-center min-h-[180px] flex flex-col justify-center">
        <blockquote className="text-2xl font-serif italic text-amber-900 mb-4">
          {quotes[currentIndex].text}
        </blockquote>
        <p className="text-lg text-amber-700 font-medium">
          — {quotes[currentIndex].author}
        </p>
      </div>

      {/* Navigation Dots */}
      <div className="flex justify-center space-x-2 mt-6">
        {quotes.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-3 w-3 rounded-full transition-colors ${index === currentIndex ? 'bg-amber-600' : 'bg-amber-300'}`}
            aria-label={`Go to quote ${index + 1}`}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        size="icon"
        onClick={prevQuote}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-700 hover:text-amber-900"
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={nextQuote}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-700 hover:text-amber-900"
      >
        <ChevronRight className="h-6 w-6" />
      </Button>
    </div>
  );
}