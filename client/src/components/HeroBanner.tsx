export default function HeroBanner() {
  return (
    <div className="relative w-full">
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/90 to-indigo-600/70" />
      <div className="relative h-auto  flex items-center">
        <img
          src="/banner.JPG"
          alt="Hero Banner"
          className="w-full h-full object-contain md:object-cover"
        />
      </div>
    </div>
  );
}
