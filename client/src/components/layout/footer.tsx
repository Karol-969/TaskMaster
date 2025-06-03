import { Link } from 'wouter';
import { Mail, MapPin, Phone, Clock, Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-black text-white border-t border-purple-500/20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Logo and Description */}
          <div>
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <span className="text-2xl font-bold text-purple-500">Reart</span>
              <span className="text-xl font-medium text-white">Events</span>
            </Link>
            <p className="text-gray-300 mb-4 text-sm leading-relaxed">
              Premium event management and booking platform for artists, influencers, sound systems, venues, and tickets.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                <Facebook className="h-4 w-4" />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                <Instagram className="h-4 w-4" />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                <Twitter className="h-4 w-4" />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                <Linkedin className="h-4 w-4" />
                <span className="sr-only">LinkedIn</span>
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-300 hover:text-purple-400 transition-colors text-sm">Home</Link></li>
              <li><Link href="/artists" className="text-gray-300 hover:text-purple-400 transition-colors text-sm">Artists</Link></li>
              <li><Link href="/sound" className="text-gray-300 hover:text-purple-400 transition-colors text-sm">Sound</Link></li>
              <li><Link href="/services" className="text-gray-300 hover:text-purple-400 transition-colors text-sm">Services</Link></li>
              <li><Link href="/events" className="text-gray-300 hover:text-purple-400 transition-colors text-sm">Events</Link></li>
              <li><Link href="/contact" className="text-gray-300 hover:text-purple-400 transition-colors text-sm">Contact</Link></li>
            </ul>
          </div>
          
          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Services</h4>
            <ul className="space-y-2">
              <li><Link href="/services/weekly-music" className="text-gray-300 hover:text-purple-400 transition-colors text-sm">Weekly Live Music</Link></li>
              <li><Link href="/services/monthly-artists" className="text-gray-300 hover:text-purple-400 transition-colors text-sm">Monthly Artist Arrangements</Link></li>
              <li><Link href="/services/event-concepts" className="text-gray-300 hover:text-purple-400 transition-colors text-sm">Event Concepts</Link></li>
              <li><Link href="/services/promotion-sponsorships" className="text-gray-300 hover:text-purple-400 transition-colors text-sm">Promotion & Sponsorships</Link></li>
            </ul>
          </div>
          
          {/* Contact Us */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-4 w-4 text-purple-400 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300 text-sm">Chagal, Kathmandu, Nepal</span>
              </li>
              <li className="flex items-start">
                <Phone className="h-4 w-4 text-purple-400 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300 text-sm">+977-9860673425 / 9865139809</span>
              </li>
              <li className="flex items-start">
                <Mail className="h-4 w-4 text-purple-400 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300 text-sm">reart.nepal@gmail.com</span>
              </li>
              <li className="flex items-start">
                <Clock className="h-4 w-4 text-purple-400 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300 text-sm">Mon-Fri: 9AM-6PM</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="pt-6 border-t border-gray-800 text-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Reart Events Pvt. Ltd. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
