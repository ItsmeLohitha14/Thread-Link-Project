import React from "react";
import donateImage from "/src/assets/donate.png";
import { Users, Shirt, Heart, UsersRound } from "lucide-react";
import { motion } from "framer-motion";

const Home = () => {
  return (
    <>
      {/* Hero Section */}
      <section id="home" className="flex flex-col md:flex-row items-center justify-between px-6 py-16 bg-gradient-to-b from-white to-[#fffbea] relative">
        {/* Left Text */}
        <div className="md:w-1/2 space-y-6 z-10">
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
            Connect Threads, Make an Impact
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
            Give Your Clothes a <br />
            <span className="text-green-600">Second Life</span>
          </h1>
          <p className="text-gray-600 text-lg">
            Join our sustainable fashion community that connects donors with those in need.
            Reduce waste, help others, and make a positive impact on our planet.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-md font-semibold flex items-center gap-2">
              Donate Now <Shirt className="w-5 h-5" />
            </button>
            <button className="border border-green-600 text-green-600 px-5 py-3 rounded-md font-semibold">
              Browse Clothes →
            </button>
          </div>
        </div>

        {/* Right Image */}
        <div className="md:w-1/2 mt-10 md:mt-0 relative flex justify-center items-center">
          <motion.img
            src={donateImage}
            alt="Donation Bags"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            whileHover={{ scale: 1.05, rotate: 1 }}
            className="rounded-xl shadow-lg w-full max-w-md object-cover cursor-pointer"
          />



          {/* Items Donated */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: [20, -5, 0], opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }}
            className="absolute bottom-4 left-7 bg-white shadow-md rounded-md px-4 py-2 flex items-center gap-2 cursor-pointer"
          >
            <Shirt className="text-green-500" />
            <div>
              <p className="text-xs text-gray-500">Items Donated</p>
              <p className="text-lg font-bold">1,234</p>
            </div>
          </motion.div>


          {/* People Helped */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: [-20, 5, 0], opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 }}
            whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }}
            className="absolute top-4 right-4 bg-white shadow-md rounded-md px-4 py-2 flex items-center gap-2 cursor-pointer"
          >
            <Users className="text-orange-500" />
            <div>
              <p className="text-xs text-gray-500">People Helped</p>
              <p className="text-lg font-bold">567</p>
            </div>
          </motion.div>


        </div>
      </section>

      {/* Feature Section */}
      <section className="py-8 px-6 bg-gradient-to-b from-[#fffbea] to-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          {/* Simple Donations */}
          <div className="flex flex-col items-center space-y-4">
            <div className="bg-green-100 p-4 rounded-full">
              <Shirt className="text-green-700 w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Simple Donations</h3>
            <p className="text-gray-600">
              Easily upload photos and details of your pre-loved clothing items to share.
            </p>
          </div>

          {/* Direct Impact */}
          <div className="flex flex-col items-center space-y-4">
            <div className="bg-yellow-100 p-4 rounded-full">
              <UsersRound className="text-yellow-700 w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Direct Impact</h3>
            <p className="text-gray-600">
              Your donations go directly to individuals and organizations in need.
            </p>
          </div>

          {/* Sustainable Fashion */}
          <div className="flex flex-col items-center space-y-4">
            <div className="bg-red-100 p-4 rounded-full">
              <Heart className="text-red-500 w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Sustainable Fashion</h3>
            <p className="text-gray-600">
              Reduce textile waste and environmental impact while helping others.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
