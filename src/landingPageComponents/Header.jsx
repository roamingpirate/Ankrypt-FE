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
      className={`w-full flex items-end justify-between pt-[10px] h-16 px-[8%] transition-all duration-300 text-white ${
        isSticky ? "fixed top-0 bg-[#16222A] shadow-lg z-50 py-3" : ""
      }`}
    >
      <div>
        <p className="font-bold font-mono text-3xl">Ancript</p>
      </div>

      <div className="flex-grow flex justify-center gap-5">
        <p className="font-karma font-medium hover:cursor-pointer">Features</p>
        <p className="font-karma font-medium hover:cursor-pointer">Examples</p>
        <p className="font-karma font-medium hover:cursor-pointer">Pricing</p>
      </div>

      <div
        className="rounded-lg hover:cursor-pointer text-center items-center px-3"
        onClick={() => navigate("/studio")}
      >
          <div class="p-[2px] rounded-3xl bg-gradient-to-r from-[#2b5876] to-[#4e4376] flex justify-center items-center">
          <div className="text-center">
            <button className="bg-gray-900 hover:bg-gray-800 text-white text-sm font-bold m-[1px] py-2 px-4 rounded-3xl ">
              Go To App
            </button>
          </div>
          </div>
      </div>
    </div>
  );
};

export default Header;
