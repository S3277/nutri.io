import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/landing/Footer';

const FAQPage: React.FC = () => {
  const faqs = [
    {
      question: 'How accurate is the AI food recognition?',
      answer: 'Our AI food recognition system is highly accurate, trained on millions of food images. It can identify most common foods and their portions with over 90% accuracy. However, for best results, we recommend taking clear photos in good lighting.',
    },
    {
      question: 'Can I track my macronutrients?',
      answer: 'Yes! Our app automatically calculates and tracks your protein, carbohydrates, and fats for each meal. You can set custom macro goals and monitor your progress through detailed charts and analytics.',
    },
    {
      question: 'How are calorie targets calculated?',
      answer: 'We use the Mifflin-St Jeor equation, considered the most accurate for calculating basal metabolic rate (BMR). This is then adjusted based on your activity level, goals, and other factors for a personalized calorie target.',
    },
    {
      question: 'Can I use the app offline?',
      answer: 'While most features require an internet connection for AI analysis and data syncing, you can still log foods manually offline. Your data will sync automatically when you\'re back online.',
    },
    {
      question: 'Is my data secure?',
      answer: 'Yes, we take data security seriously. All your personal information and food logs are encrypted and stored securely. We never share your data with third parties without your explicit consent.',
    },
    {
      question: 'Can I export my data?',
      answer: 'Yes, you can export your nutrition data and progress reports in various formats (CSV, PDF) for personal analysis or to share with your healthcare provider.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white py-4 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10">
                <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 36C27.9411 36 36 27.9411 36 18C36 8.05887 27.9411 0 18 0C8.05887 0 0 8.05887 0 18C0 27.9411 8.05887 36 18 36Z" fill="url(#paint0_linear)"/>
                  <path d="M27 15C27 19.9706 22.9706 24 18 24C13.0294 24 9 19.9706 9 15C9 10.0294 13.0294 6 18 6C22.9706 6 27 10.0294 27 15Z" fill="white"/>
                  <path d="M22.5 15C22.5 17.4853 20.4853 19.5 18 19.5C15.5147 19.5 13.5 17.4853 13.5 15C13.5 12.5147 15.5147 10.5 18 10.5C20.4853 10.5 22.5 12.5147 22.5 15Z" fill="url(#paint1_linear)"/>
                  <defs>
                    <linearGradient id="paint0_linear" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#F97316"/>
                      <stop offset="1" stopColor="#EA580C"/>
                    </linearGradient>
                    <linearGradient id="paint1_linear" x1="13.5" y1="10.5" x2="22.5" y2="19.5" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#F97316"/>
                      <stop offset="1" stopColor="#EA580C"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                Nutri.io
              </span>
            </Link>
            <Link 
              to="/login"
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-2.5 rounded-full hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 font-medium"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <div className="py-16 bg-gradient-to-b from-orange-50 to-white">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold text-gray-900 text-center mb-8">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto mb-16">
              Find answers to common questions about our AI-powered nutrition tracking app.
            
            </p>

            <div className="max-w-3xl mx-auto space-y-6">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FAQPage;