import { useEffect, useState } from "react";
import { api } from "../utils/api";
import { ImageURL } from "../data/baseApi";

export default function HeroBanner() {
  const [banner, setBanner] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    (async () => {
      const allBanners: any = await api.banners.getAll();
      setBanner(allBanners);
    })();
  }, []);

  useEffect(() => {
    if (banner.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % banner.length);
      }, 5000); // Change slide every 5 seconds

      return () => clearInterval(interval); // Cleanup interval on component unmount
    }
  }, [banner.length]);

  return (
    <div className="p-2 sm:p-4 max-w-[2000px] mx-auto">
      <div className="relative w-full overflow-hidden rounded-2xl shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-r from-[#37c3fa]/80 to-[#c937fb]/80 
          mix-blend-multiply transition-opacity duration-300 hover:opacity-75" />

        <div className="relative flex items-center justify-center">
          {banner.map((banner: any, index: number) => (
            <img
              key={index}
              src={`${ImageURL}/${banner.image}`}
              alt="Hero Banner"
              className={`w-full h-[150px] min-[400px]:h-[180px] sm:h-[300px] md:h-[400px] lg:h-[500px] 
                object-cover sm:object-cover transition-transform duration-700 hover:scale-105 
                ${index === currentIndex ? "block" : "hidden"}`}
              style={{
                transform: `translateX(${(index - currentIndex) * 100}%)`,
                transition: "transform 0.7s ease-in-out",
              }}
            />
          ))}
        </div>

        {/* Optional: Add a subtle bottom gradient overlay for text readability */}
        <div className="absolute bottom-0 left-0 right-0 h-24 
          bg-gradient-to-t from-black/50 to-transparent" />
      </div>
    </div>
  );
}