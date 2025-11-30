import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { getApiUrl } from "../utils/apiConfig";

interface Review {
  _id: string;
  name: string;
  comment: string;
  rating: number;
  image?: string;
  date: string;
}

// Fallback static testimonials
const staticTestimonials = [
  {
    id: 1,
    name: "Priya Sharma",
    feedback:
      "Absolutely loved the Photo Frame! It made my engagement day so much more special. The packaging and detailing were perfect.",
    location: "Mumbai, India",
    product: "Resin Photo Frame",
    image: "Review1.jpeg",
    rating: 5,
  },
  {
    id: 2,
    name: "Rohit Mehta",
    feedback:
      "I ordered a handmade gift hamper for my friend, and it was elegant and unique. She absolutely loved it.",
    location: "Delhi, India",
    product: "Luxury Gift Hamper",
    image: "Review2.jpeg",
    rating: 5,
  },
];

export default function TestimonialsSlider() {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const randomAvatar = (name: string) =>
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name
    )}&background=random&color=fff&bold=true&size=128&font-size=0.45`;

  // Fetch dynamic reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(getApiUrl("api/reviews/"));
        const data = res.data.reviews || res.data || [];

        const mappedDynamic: Review[] = data
          .slice(0, 6) // limit real-time visible reviews
          .map((r: any) => ({
            _id: r._id,
            name: r.name,
            comment: r.comment,
            rating: r.rating || 5,
            date: r.date,
            image: r.image || randomAvatar(r.name),
          }));

        setReviews([...mappedDynamic]); // Only real reviews here
      } catch (err) {
        console.warn("API Failed: Showing static data");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const mergedTestimonials = [
    ...reviews,
    ...staticTestimonials.map((s) => ({
      _id: String(s.id),
      name: s.name,
      comment: s.feedback,
      rating: s.rating,
      date: new Date().toISOString(),
      image: s.image,
    })),
  ];

  // Auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % mergedTestimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [mergedTestimonials.length]);

  // Scroll active card
  useEffect(() => {
    scrollRef.current?.scrollTo({
      left: scrollRef.current.clientWidth * currentIndex,
      behavior: "smooth",
    });
  }, [currentIndex]);

  const prevSlide = () =>
    setCurrentIndex((prev) =>
      prev === 0 ? mergedTestimonials.length - 1 : prev - 1
    );

  const nextSlide = () =>
    setCurrentIndex((prev) => (prev + 1) % mergedTestimonials.length);

  if (loading)
    return (
      <div className="text-center py-20 text-lg font-medium text-gray-600">
        Loading reviews...
      </div>
    );

  return (
    <section className="py-20 relative bg-[#FBF7F0]">
      <div className="text-center mb-16 px-4">
        <h2 className="text-4xl md:text-5xl font-serif text-[#603808] font-semibold">
          What Our Clients Say
        </h2>
        <p className="mt-4 text-lg text-[#6B3F28] max-w-xl mx-auto italic leading-relaxed">
          Hear from customers who trusted us to create something special.
        </p>
      </div>

      <div className="relative max-w-6xl mx-auto">
        <button
          onClick={prevSlide}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/90 rounded-full shadow"
        >
          <ChevronLeft className="w-6 h-6 text-[#8C5E3C]" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/90 rounded-full shadow"
        >
          <ChevronRight className="w-6 h-6 text-[#8C5E3C]" />
        </button>

        <div
          ref={scrollRef}
          className="flex overflow-x-hidden snap-x snap-mandatory gap-6 px-4"
        >
          {mergedTestimonials.map((t) => (
            <div
              key={t._id}
              className="flex-shrink-0 w-full sm:w-[320px] md:w-[360px] snap-center bg-white rounded-3xl shadow-md p-8 flex flex-col items-center text-center hover:shadow-xl hover:-translate-y-1 transition-transform duration-300"
            >
              <img
                src={t.image}
                className="w-28 h-28 rounded-full object-cover mb-5 border-4 border-[#D9A441]"
              />
              <h3 className="text-xl font-serif font-semibold text-gray-800">
                {t.name}
              </h3>

              <p className="text-gray-700 italic my-3">"{t.comment}"</p>

              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < t.rating
                        ? "text-[#D9A441] fill-[#D9A441]"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-8 gap-3">
          {mergedTestimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-3 h-3 rounded-full ${
                currentIndex === idx ? "bg-[#8C5E3C]" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
