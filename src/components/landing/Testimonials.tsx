import React from 'react';

const testimonials = [
  {
    quote: "The AI food recognition is spot on! I take a quick photo and it identifies everything correctly, making tracking so much easier.",
    name: "Sarah M.",
    title: "Lost 15kg in 6 months",
    avatar: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    quote: "As a fitness enthusiast, I love how this app gives me detailed macro breakdowns. It's helped me optimize my nutrition for muscle gain.",
    name: "Alex T.",
    title: "Fitness Trainer",
    avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    quote: "The personalized calorie recommendations are spot on. It adjusts based on my activity level and has made maintaining my weight so much easier.",
    name: "Michael D.",
    title: "Maintained weight for 1 year",
    avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
];

const Testimonials: React.FC = () => {
  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Thousands of people have transformed their relationship with food and achieved their goals with our smart calorie tracker.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-md transition duration-300 hover:shadow-lg"
            >
              <div className="flex items-center mb-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">{testimonial.name}</h3>
                  <p className="text-sm text-emerald-600">{testimonial.title}</p>
                </div>
              </div>
              <p className="text-gray-600 italic">"{testimonial.quote}"</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;