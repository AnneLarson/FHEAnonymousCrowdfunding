import React from 'react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">About FHE Crowdfunding</h1>
          <div className="prose max-w-none text-gray-600">
            <p className="mb-4">
              FHE Crowdfunding is the world's first truly anonymous crowdfunding platform powered by 
              Fully Homomorphic Encryption (FHE) technology.
            </p>
            <p className="mb-4">
              Our platform allows donors to contribute to causes they believe in while maintaining 
              complete privacy and anonymity.
            </p>
            <p>
              Built with cutting-edge blockchain technology and privacy-preserving cryptography.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}