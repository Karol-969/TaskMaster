import { Link } from 'wouter';
import { Mail, MapPin, Phone, Clock, Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-primary text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Logo and Description */}
          <div>
            <Link href="/" className="flex items-center space-x-2 mb-6">
              <span className="text-2xl font-bold text-accent">Reart</span>
              <span className="text-xl font-medium">Events</span>
            </Link>
            <p className="text-gray-400 mb-6">
              Premium event management and booking platform for artists, influencers, sound systems, venues, and tickets.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-all">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-all">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-all">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-all">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link href="/" className="text-gray-400 hover:text-white transition-all">Home</Link></li>
              <li><Link href="/artists" className="text-gray-400 hover:text-white transition-all">Artists</Link></li>
              <li><Link href="/about" className="text-gray-400 hover:text-white transition-all">About Us</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white transition-all">Contact</Link></li>
              <li><Link href="/login" className="text-gray-400 hover:text-white transition-all">Login</Link></li>
              <li><Link href="/register" className="text-gray-400 hover:text-white transition-all">Register</Link></li>
            </ul>
          </div>
          
          {/* Services */}
          <div>
            <h4 className="text-lg font-bold mb-6">Services</h4>
            <ul className="space-y-3">
              <li><Link href="/artists" className="text-gray-400 hover:text-white transition-all">Artist Booking</Link></li>
              <li><Link href="/influencers" className="text-gray-400 hover:text-white transition-all">Influencer Booking</Link></li>
              <li><Link href="/sound-systems" className="text-gray-400 hover:text-white transition-all">Sound System Rental</Link></li>
              <li><Link href="/venues" className="text-gray-400 hover:text-white transition-all">Venue Booking</Link></li>
              <li><Link href="/tickets" className="text-gray-400 hover:text-white transition-all">Event Tickets</Link></li>
            </ul>
          </div>
          
          {/* Contact Us */}
          <div>
            <h4 className="text-lg font-bold mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-accent mr-3 mt-0.5" />
                <span className="text-gray-400">Chagal, Kathmandu, Nepal</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-accent mr-3" />
                <span className="text-gray-400">+977-9860673425 / 9865139809</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-accent mr-3" />
                <span className="text-gray-400">reart.nepal@gmail.com</span>
              </li>
              <li className="flex items-center">
                <Clock className="h-5 w-5 text-accent mr-3" />
                <span className="text-gray-400">Mon-Fri: 9AM-6PM</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Newsletter */}
        <div className="py-8 border-t border-gray-800 mb-8">
          <div className="max-w-xl mx-auto text-center">
            <h3 className="text-xl font-bold mb-4">Subscribe to Our Newsletter</h3>
            <p className="text-gray-400 mb-4">Stay updated with our latest events and offers</p>
            <form className="flex flex-wrap justify-center gap-4">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="px-4 py-2 w-full sm:w-auto sm:flex-1 max-w-sm rounded-md focus:outline-none text-gray-800"
              />
              <button 
                type="button" 
                className="px-6 py-2 bg-accent text-white rounded-md hover:bg-opacity-90 transition-all font-medium"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Reart Events Pvt. Ltd. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
