import { useNavigate } from "react-router-dom";


const Intro = () => {

    const navigate = useNavigate();

    return (
        <div className="container mx-auto h-screen flex flex-col justify-center items-center py-16 px-4 text-white" >
          <h1 className="text-[36px] md:text-[50px] font-karma font-semibold text-center mb-0">
          Welcome to Ancript
          </h1>
          <p className="text-[18px] md:text-[28px] max-w-[700px] font-mono text-center mb-3">
            Your gateway to creating  <span className="bg-gradient-to-r from-[#FC354C] to-[#0ABFBC] bg-clip-text text-transparent"> engaging </span> and <span className="bg-gradient-to-r from-[#FC354C] to-[#0ABFBC] bg-clip-text text-transparent"> interactive </span>  videos  <span className="bg-gradient-to-r from-[#FC354C] to-[#0ABFBC] bg-clip-text text-transparent"> effortlessly! </span>  
          </p>
          <div className="text-center mb-6 font-mono">
  <p className="md:max-w-[500px] text-gray-200">
    Whether you're looking to educate, entertain, or inform, our platform empowers you to bring your ideas to life with customizable avatars, AI-generated scripts, and stunning animated videos. Join us in revolutionizing the way you share stories!
  </p>
</div>

          <div class="p-[2px] rounded-3xl bg-gradient-to-r from-[#2b5876] to-[#4e4376] hover:cursor-pointer flex justify-center items-center">
          <div className="text-center" onClick={() => navigate("/studio")}>
            <button className="bg-gray-900 hover:bg-gray-800 text-white text-lg font-bold m-[1px] py-2 px-4 rounded-3xl " >
              Get Started
            </button>
          </div>
          </div>
        </div>
      );      
}

export default Intro