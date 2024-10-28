

const Intro = () => {
    return (
        <div className="container mx-auto h-screen flex flex-col justify-center items-center py-16 px-4" >
          <h1 className="text-4xl font-karma font-bold text-center mb-6">
            Welcome to Ancript
          </h1>
          <p className="text-lg font-karma text-center mb-3">
            Your gateway to creating engaging and interactive videos effortlessly!
          </p>
          <div className="text-center mb-6">
            <p className="text-gray-500 font-karma">
              Whether you're looking to educate, entertain, or inform,
            </p>
            <p className="text-gray-500 font-karma">
              our platform empowers you to bring your ideas to life
            </p>
            <p className="text-gray-500 font-karma">
              with customizable avatars, AI-generated scripts, and stunning animated videos.
            </p>
            <p className="text-gray-500 font-karma">
              Join us in revolutionizing the way you share stories!
            </p>
          </div>
          <div className="text-center">
            <button className="bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded">
              Get Started
            </button>
          </div>
        </div>
      );      
}

export default Intro