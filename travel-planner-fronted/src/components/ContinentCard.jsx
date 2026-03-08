import { useState } from "react";

export const ContinentCard = ({
  name,
  countries,
  image,
  description,
  featured,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-500 hover:shadow-2xl ${
        featured ? "sm:col-span-2 sm:row-span-2" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Background */}
      <div className="relative h-full min-h-[280px] overflow-hidden">
        <img
          src={image}
          alt={name}
          className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ${
            isHovered ? "scale-110" : "scale-100"
          }`}
          loading="lazy"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        {/* Featured Badge */}
        {featured && (
          <div className="absolute top-4 right-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
            Popular
          </div>
        )}
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
        <div
          className={`transition-all duration-500 ${isHovered ? "translate-y-0 opacity-100" : "translate-y-2 opacity-90"}`}
        >
          <h3 className="text-2xl font-bold mb-2">{name}</h3>
          <p className="text-sm text-gray-200 mb-3">
            {countries > 0
              ? `${countries} Countries`
              : "Expedition Destination"}
          </p>
          <p
            className={`text-sm text-gray-300 transition-all duration-500 ${
              isHovered ? "opacity-100 max-h-20" : "opacity-0 max-h-0"
            }`}
          >
            {description}
          </p>
        </div>

        {/* Hover Arrow */}
        <div
          className={`mt-4 flex items-center gap-2 text-white transition-all duration-500 ${
            isHovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
          }`}
        >
          <span className="text-sm font-semibold">Explore {name}</span>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};
