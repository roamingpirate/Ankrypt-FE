import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const triggerHeight = window.innerHeight / 2;
      setIsSticky(window.scrollY > triggerHeight);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`w-full flex items-end justify-between p-4 h-16 transition-all duration-300 ${
        isSticky ? "fixed top-0 bg-white shadow-lg z-50" : ""
      }`}
    >
      <div>
        <p className="font-ks text-3xl">Ancript</p>
      </div>

      <div className="flex-grow flex justify-center gap-5">
        <p className="font-karma font-medium hover:cursor-pointer">Features</p>
        <p className="font-karma font-medium hover:cursor-pointer">Examples</p>
        <p className="font-karma font-medium hover:cursor-pointer">Pricing</p>
      </div>

      <div
        className="rounded-lg hover:cursor-pointer bg-black text-center items-center px-3 py-2"
        onClick={() => navigate("/app")}
      >
        <p className="font-karma text-white text-sm">Go To App</p>
      </div>
    </div>
  );
};

export default Header;
