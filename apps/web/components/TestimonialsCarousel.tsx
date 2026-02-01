'use client';

import { useState, useEffect } from 'react';

const TESTIMONIALS = [
  {
    text: "This saved me 8 hours of research before my factory visit!",
    author: "Sarah M.",
    role: "Operations Manager",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?img=5"
  },
  {
    text: "Worth way more than $5. Saved me hours of Googling.",
    author: "Alex T.",
    role: "Software Engineer",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?img=8"
  },
  {
    text: "Better than a $2000 online course. No fluff, just what I needed.",
    author: "Mike R.",
    role: "Product Manager",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?img=12"
  },
  {
    text: "Aced my interview thanks to this course. Best $5 I ever spent.",
    author: "Jessica L.",
    role: "Data Analyst",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?img=9"
  },
  {
    text: "Crystal clear explanations. Felt like having an expert mentor.",
    author: "David K.",
    role: "Business Consultant",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?img=14"
  }
];

export default function TestimonialsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000); // Rotate every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const current = TESTIMONIALS[currentIndex];

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-100">
      <div className="flex items-center gap-3 mb-4">
        <img 
          src={current.avatar} 
          alt={current.author}
          className="w-16 h-16 rounded-full border-2 border-white shadow-lg"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <div className="text-yellow-400">
              {[...Array(current.rating)].map((_, i) => (
                <span key={i}>⭐</span>
              ))}
            </div>
          </div>
          <p className="font-semibold text-gray-900">{current.author}</p>
          <p className="text-sm text-gray-600">{current.role}</p>
        </div>
      </div>
      
      <p className="text-lg text-gray-700 italic leading-relaxed">
        "{current.text}"
      </p>

      {/* Indicator dots */}
      <div className="flex justify-center gap-2 mt-6">
        {TESTIMONIALS.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-2 h-2 rounded-full transition-all ${
              idx === currentIndex 
                ? 'bg-indigo-600 w-8' 
                : 'bg-indigo-200 hover:bg-indigo-300'
            }`}
            aria-label={`Go to testimonial ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
