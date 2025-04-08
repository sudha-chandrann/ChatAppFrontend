
// App.jsx
import { useState, useEffect } from 'react';

const App = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [activeSection, setActiveSection] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    // Simulate typing effect for the chat demo
    const messages = [
      "Hey there! How can I help you today?",
      "I'd like to know more about your chat application",
      "Of course! Our chat app is completely free and offers real-time messaging, file sharing, and more.",
      "That sounds awesome! How secure is it?",
      "We use end-to-end encryption for all messages and never store your sensitive data.",
    ];
    
    let i = 0;
    const interval = setInterval(() => {
      if (i < messages.length) {
        setMessageText(messages[i]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  const scrollToSection = (section) => {
    document.getElementById(section).scrollIntoView({ behavior: 'smooth' });
    setActiveSection(section);
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <header className="fixed w-full bg-gray-900 bg-opacity-90 backdrop-blur-sm z-50 px-6 py-4 border-b border-gray-800 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">ChatterBox</h1>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex space-x-8">
            <li 
              className={`cursor-pointer hover:text-purple-400 transition-colors duration-300 ${activeSection === 'home' ? 'text-purple-500 font-medium' : ''}`} 
              onClick={() => scrollToSection('home')}
            >
              Home
            </li>
            <li 
              className={`cursor-pointer hover:text-purple-400 transition-colors duration-300 ${activeSection === 'features' ? 'text-purple-500 font-medium' : ''}`} 
              onClick={() => scrollToSection('features')}
            >
              Features
            </li>
            <li 
              className={`cursor-pointer hover:text-purple-400 transition-colors duration-300 ${activeSection === 'about' ? 'text-purple-500 font-medium' : ''}`} 
              onClick={() => scrollToSection('about')}
            >
              About
            </li>
            <li 
              className={`cursor-pointer hover:text-purple-400 transition-colors duration-300 ${activeSection === 'download' ? 'text-purple-500 font-medium' : ''}`} 
              onClick={() => scrollToSection('download')}
            >
              Download
            </li>
          </ul>
        </nav>

        <div className='hidden md:flex items-center justify-center gap-2'>
            <button className="bg-white hover:bg-white/80 text-black font-bold py-2 px-4 rounded">
              Sign Up
            </button>
            <button
            className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
              Log In
            </button>
        </div>
        
        {/* Mobile Menu Icon */}
        <div className="md:hidden">
          <button 
            className="flex flex-col justify-center items-center w-8 h-8 space-y-1.5"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className={`block w-6 h-0.5 bg-gray-300 transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-gray-300 transition-opacity duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-gray-300 transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>
        </div>
      </header>
      
      {/* Mobile Navigation */}
      <div 
        className={`fixed inset-0 bg-gray-900 z-40 transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} md:hidden`}
        style={{ top: '4rem' }}
      >
        <nav className="flex flex-col p-6">
          <ul className="flex flex-col space-y-6 text-xl">
            <li onClick={() => scrollToSection('home')} className="hover:text-purple-400 cursor-pointer transition-colors">Home</li>
            <li onClick={() => scrollToSection('features')} className="hover:text-purple-400 cursor-pointer transition-colors">Features</li>
            <li onClick={() => scrollToSection('about')} className="hover:text-purple-400 cursor-pointer transition-colors">About</li>
            <li onClick={() => scrollToSection('download')} className="hover:text-purple-400 cursor-pointer transition-colors">Download</li>
          </ul>
        </nav>
      </div>

      {/* Hero Section */}
      <section 
        id="home" 
        className={`pt-24 pb-16 px-6 md:px-12 lg:px-24 min-h-screen flex flex-col md:flex-row items-center justify-center`}
      >
        <div className={`w-full md:w-1/2 transform text-center md:text-left transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'}`}>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight ">
            Connect with <span className="text-purple-500">Anyone</span>, <span className="text-blue-500">Anywhere</span>
          </h1>
          <p className="text-lg text-gray-400 mb-8">
            A secure, free, and powerful chat platform for personal and professional use
          </p>
          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-medium hover:opacity-90 transform transition hover:-translate-y-1 shadow-lg shadow-purple-900/20">
              Get Started
            </button>
            <button className="px-8 py-3 bg-gray-800 border border-gray-700 rounded-lg font-medium hover:bg-gray-700 transform transition hover:-translate-y-1">
              Learn More
            </button>
          </div>
        </div>
        
        <div className={`w-full md:w-1/2 mt-12 md:mt-0 transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'}`}>
          <div className="bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-700 max-w-md mx-auto">
            <div className="bg-gray-800 p-4 border-b border-gray-700 flex items-center">
              <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">C</div>
              <div className="ml-3">
                <p className="font-medium">ChatFree Assistant</p>
                <p className="text-xs text-green-400">Online</p>
              </div>
            </div>
            
            <div className="p-4 h-80 overflow-y-auto bg-gray-900 flex flex-col space-y-4">
              <div className="bg-gray-800 p-3 rounded-lg rounded-tl-none max-w-xs animate-fade-in">
                <p>{messageText || "Hey there! How can I help you today?"}</p>
              </div>
              
              <div className="bg-purple-600 p-3 rounded-lg rounded-tr-none max-w-xs self-end">
                <p>I'd like to know more about your chat application</p>
              </div>
              
              <div className="bg-gray-800 p-3 rounded-lg rounded-tl-none max-w-xs">
                <p>Our chat app is completely free and offers real-time messaging, file sharing, and more.</p>
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-700 flex">
              <input 
                type="text" 
                placeholder="Type a message..." 
                className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-200"
              />
              <button className="ml-2 bg-purple-600 p-2 rounded-lg hover:bg-purple-700 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-800 px-6 md:px-12 lg:px-24">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Why Choose ChatFree?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

            <div className="bg-gray-900 p-6 rounded-xl border border-gray-700 transform transition hover:-translate-y-2 hover:shadow-xl hover:shadow-purple-900/10 duration-300">
              <div className="w-14 h-14 bg-purple-900 rounded-lg flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">100% Secure & Private</h3>
              <p className="text-gray-400">End-to-end encryption ensures your conversations remain private and secure from prying eyes.</p>
            </div>
          
            <div className="bg-gray-900 p-6 rounded-xl border border-gray-700 transform transition hover:-translate-y-2 hover:shadow-xl hover:shadow-purple-900/10 duration-300">
              <div className="w-14 h-14 bg-green-900 rounded-lg flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Cloud Storage</h3>
              <p className="text-gray-400">Access your conversations and shared files from any device, anytime with our secure cloud storage.</p>
            </div>
            
            <div className="bg-gray-900 p-6 rounded-xl border border-gray-700 transform transition hover:-translate-y-2 hover:shadow-xl hover:shadow-purple-900/10 duration-300">
              <div className="w-14 h-14 bg-red-900 rounded-lg flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Real-Time Messaging</h3>
              <p className="text-gray-400">Send and receive messages instantly with typing indicators and read receipts.</p>
            </div>
            
            <div className="bg-gray-900 p-6 rounded-xl border border-gray-700 transform transition hover:-translate-y-2 hover:shadow-xl hover:shadow-purple-900/10 duration-300">
              <div className="w-14 h-14 bg-yellow-900 rounded-lg flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Cross-Platform</h3>
              <p className="text-gray-400">Available on iOS, Android, Windows, Mac, and the web. Your conversations follow you everywhere.</p>
            </div>
            
            <div className="bg-gray-900 p-6 rounded-xl border border-gray-700 transform transition hover:-translate-y-2 hover:shadow-xl hover:shadow-purple-900/10 duration-300">
              <div className="w-14 h-14 bg-indigo-900 rounded-lg flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Completely Free</h3>
              <p className="text-gray-400">No subscription fees, hidden costs, or premium features. Everything is free, forever.</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-6 md:px-12 lg:px-24">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">About ChatterBox</h2>
          <p className="text-lg text-gray-400 mb-10">
            We believe communication should be free, secure, and accessible to everyone. That's why we built ChatterBox - a powerful chat application that brings people together without barriers.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center mb-12">
            <div>
              <h3 className="text-4xl font-bold text-purple-500 mb-2">10M+</h3>
              <p className="text-gray-400">Active Users</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-blue-500 mb-2">150+</h3>
              <p className="text-gray-400">Countries</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-green-500 mb-2">4.9/5</h3>
              <p className="text-gray-400">User Rating</p>
            </div>
          </div>
          
          <div className="bg-gray-800 p-8 rounded-xl border border-gray-700">
            <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
            <p className="text-gray-400">
              To create a world where distance is no longer a barrier to human connection. We're committed to building technology that brings people closer together while respecting their privacy and security.
            </p>
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="bg-gray-900 py-12 border-t border-gray-800 px-6 md:px-12 lg:px-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent mb-4">ChatterBox</h3>
              <p className="text-gray-400 mb-4">Connect with anyone, anywhere. Free and secure messaging for everyone.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">GitHub</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"></path>
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Security</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Enterprise</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Guides</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">API Reference</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">© 2025 ChatterBox. All rights reserved.</p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-500 hover:text-white text-sm transition-colors">Terms</a>
              <a href="#" className="text-gray-500 hover:text-white text-sm transition-colors">Privacy</a>
              <a href="#" className="text-gray-500 hover:text-white text-sm transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Animation for chat demo typing effect */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;