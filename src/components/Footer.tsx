import React from 'react';
import { Shield, Heart, Github, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Shield className="h-8 w-8 text-blue-400" />
              <span className="font-bold text-xl">FHE Crowdfunding</span>
            </div>
            <p className="text-gray-400 text-sm max-w-md">
              The first truly anonymous crowdfunding platform powered by Fully Homomorphic Encryption. 
              Donate privately, fund publicly.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase mb-4">
              Platform
            </h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white text-sm">How it works</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm">Privacy features</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm">Security</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm">FAQ</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase mb-4">
              Community
            </h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white text-sm">Discord</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm">Telegram</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm">Documentation</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm">Support</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex items-center justify-between">
            <p className="text-gray-400 text-sm">
              © 2024 FHE Crowdfunding. Built with privacy in mind.
            </p>
            <div className="flex space-x-4">
              <Github className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
              <Twitter className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}