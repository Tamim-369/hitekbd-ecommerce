export default function HeroBanner() {
  return (
    <div className="p-2">
      <div className="relative w-full mx-auto ">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/90 to-indigo-600/70 rounded-lg" />
        <div className="relative h-auto  flex items-center rounded-md">
          <img
            src="/banner.JPG"
            alt="Hero Banner"
            className="w-full h-full object-contain md:object-cover rounded-md"
          />
        </div>
      </div>
    </div>
  );
}
