import React from 'react';
import { useNavigate } from 'react-router-dom';

const AboutPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="max-w-4xl mx-auto px-6 py-12 privacy-policy-content">
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="modern-button mb-6 back-button"
          >
            ← Back
          </button>

          <h1 className="text-4xl font-bold text-white mb-2">About White Witch</h1>
          <p className="effective-date">
            White Witch is an original story-world and creative work by Andrew James Barker.
          </p>
        </div>

        <div className="space-y-8">
          <section className="info-section">
            <h2 className="text-2xl font-bold text-blue-300 mb-4">Intellectual Property</h2>
            <p>
              White Witch is the original intellectual property of Andrew James Barker. This
              includes the story, writing, characters, music, and overall creative work connected
              to the project. White Witch is part of a larger original body of work and may not be
              reproduced, redistributed, or adapted without permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-blue-300 mb-4">Companion Album</h2>
            <p>
              White Witch also has an accompanying album by Andrew James Barker based on the same
              story and world as the game.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-blue-300 mb-4">Music Credits</h2>
            <p>
              All music featured in the game was written by Andrew James Barker.
            </p>
            <ul>
              <li>Additional vocals by Denise Anderson</li>
              <li>Drums by Dennis Song</li>
              <li>Keys by Peter Kauffman</li>
              <li>All other performances by Andrew James Barker</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-blue-300 mb-4">Creator Note</h2>
            <p>
              White Witch was built as a story-driven interactive experience where narrative,
              gameplay, and music are closely linked. Every part of the project is meant to support
              the same fictional universe and artistic direction.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;