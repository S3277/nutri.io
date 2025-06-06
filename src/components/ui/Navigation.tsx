import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

interface NavigationProps {
  onSectionNavigate?: (section: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ onSectionNavigate }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleNavClick = (e: React.MouseEvent, section: string) => {
    e.preventDefault();
    if (onSectionNavigate && section !== 'faq') {
      onSectionNavigate(section);
    } else if (section === 'faq') {
      navigate('/faq');
    }
  };

  const navLinks = [
    { path: '/features', label: 'Features', section: 'features' },
    { path: '/pricing', label: 'Pricing', section: 'pricing' },
    { path: '/faq', label: 'FAQ', section: 'faq' },
    { path: '/testimonials', label: 'Testimonials', section: 'testimonials' },
    { path: '/about', label: 'About', section: 'footer' },
  ];

  return (
    <nav className="hidden md:flex items-center space-x-8">
      {navLinks.map((link) => (
        <a
          key={link.path}
          href={link.path}
          className={`text-sm font-medium transition-colors duration-200 ${
            isActive(link.path)
              ? 'text-orange-600'
              : 'text-gray-600 hover:text-orange-600'
          }`}
          onClick={e => handleNavClick(e, link.section)}
        >
          {link.label}
        </a>
      ))}
    </nav>
  );
};

export default Navigation;