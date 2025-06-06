import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/landing/Footer';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-orange-100 via-white to-orange-200 relative overflow-x-hidden">
      {/* Decorative blurred background shapes for depth */}
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-orange-200/40 rounded-full blur-3xl z-0" />
      <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-orange-400/30 rounded-full blur-2xl z-0" />
      <header className="bg-white/80 backdrop-blur-md py-4 shadow-lg sticky top-0 z-20 border-b border-orange-100">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 drop-shadow-lg">
                <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="18" cy="18" r="18" fill="url(#paint0_linear)" />
                  <ellipse cx="18" cy="15" rx="9" ry="9" fill="white" />
                  <ellipse cx="18" cy="15" rx="4.5" ry="4.5" fill="url(#paint1_linear)" />
                  <defs>
                    <linearGradient id="paint0_linear" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#F97316" />
                      <stop offset="1" stopColor="#EA580C" />
                    </linearGradient>
                    <linearGradient id="paint1_linear" x1="13.5" y1="10.5" x2="22.5" y2="19.5" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#F97316" />
                      <stop offset="1" stopColor="#EA580C" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <span className="text-2xl font-extrabold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent tracking-tight">
                Nutri.io
              </span>
            </Link>
            <Link 
              to="/login"
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-2.5 rounded-full shadow-lg hover:shadow-orange-400/40 transition-all duration-300 hover:-translate-y-0.5 font-semibold text-base border-2 border-orange-400/30"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center px-0 py-0 w-full relative z-10">
        <section className="w-full max-w-6xl mx-auto flex flex-col items-center justify-center py-20 md:py-28 px-2 md:px-0">
          <div className="w-full rounded-3xl bg-white/80 shadow-2xl border border-orange-200/60 p-10 md:p-20 flex flex-col items-center backdrop-blur-xl relative overflow-hidden">
            {/* Glow effect behind title */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-96 h-32 bg-orange-400/30 blur-2xl rounded-full z-0" />
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-4 bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent text-center drop-shadow-lg z-10">
              About Nutri.io
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-10 text-center z-10">Nutrition Made Simple. Health Made Possible.</h2>
            <p className="text-2xl text-gray-700 mb-10 leading-relaxed text-center max-w-3xl z-10">
              At Nutri.io, we believe nutrition shouldn't be complicated or overwhelming. Whether you're looking to eat healthier, manage your weight, boost your energy, or simply feel better in your body—Nutri.io gives you the tools to take control of your health through food.
            </p>
            <div className="w-full flex flex-col md:flex-row gap-12 md:gap-20 justify-center items-start mb-12 z-10">
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-orange-600 mb-4">What You Can Do With Nutri.io</h3>
                <ul className="text-lg text-gray-700 space-y-3">
                  <li className="flex items-center"><span className="mr-3 text-2xl">🍽️</span>Track your meals easily with smart food recognition</li>
                  <li className="flex items-center"><span className="mr-3 text-2xl">📊</span>Get personalized recommendations based on your habits and goals</li>
                  <li className="flex items-center"><span className="mr-3 text-2xl">🧠</span>Learn what works for your body with clear, data-driven feedback</li>
                  <li className="flex items-center"><span className="mr-3 text-2xl">🥑</span>Stay motivated with progress tracking and goal reminders</li>
                  <li className="flex items-center"><span className="mr-3 text-2xl">🔄</span>Build better habits without restrictive diets</li>
                </ul>
                <p className="text-lg text-gray-700 mt-6">Whether you're a beginner or a health enthusiast, Nutri.io grows with you.</p>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-orange-600 mb-4">Why Nutri.io?</h3>
                <p className="text-lg text-gray-700 mb-4">
                  Most nutrition apps throw numbers at you—calories, macros, charts—without helping you understand what your body truly needs. Nutri.io is different. Powered by smart tracking and personalized insights, Nutri.io adapts to your lifestyle, your goals, and your preferences.
                </p>
                <p className="text-lg text-gray-700 font-semibold">We’re here to make healthy eating easier, not harder.</p>
              </div>
            </div>
            <div className="w-full bg-gradient-to-r from-orange-400/30 to-orange-200/60 rounded-2xl p-10 flex flex-col items-center mt-4 shadow-xl border border-orange-300/40 relative z-10">
              {/* Glow effect behind button */}
              <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-72 h-16 bg-orange-400/40 blur-2xl rounded-full z-0" />
              <h3 className="text-2xl font-bold text-orange-600 mb-2 z-10">Ready to Feel Better Every Day?</h3>
              <p className="text-lg text-gray-700 mb-4 text-center z-10">Join thousands who are transforming their nutrition—one meal at a time.</p>
              <Link to="/login" className="inline-block bg-gradient-to-r from-orange-500 to-orange-600 text-white px-10 py-4 rounded-full font-semibold shadow-xl hover:shadow-orange-400/50 transition-all duration-300 hover:-translate-y-1 text-xl border-2 border-orange-400/40 ring-2 ring-orange-200/40 z-10">
                👉 Start Your Free Trial Today
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;