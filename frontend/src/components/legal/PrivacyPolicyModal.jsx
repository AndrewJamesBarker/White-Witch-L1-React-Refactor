import React from 'react';

const PrivacyPolicyModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900/95 border-2 border-white/20 rounded-xl max-w-4xl max-h-[90vh] overflow-y-auto backdrop-blur-xl">
        
        {/* Header */}
        <div className="sticky top-0 bg-gray-900/95 border-b border-white/20 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Privacy Policy</h2>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-all duration-200"
            aria-label="Close privacy policy"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 text-white space-y-6">
          
          <div className="text-white/70 text-sm">
            <strong>Effective Date:</strong> December 2024
          </div>

          <section>
            <h3 className="text-xl font-bold text-blue-300 mb-3">Information We Collect</h3>
            <p className="mb-3">When you create an account with White Witch, we collect:</p>
            <ul className="list-disc list-inside space-y-1 text-white/90 ml-4">
              <li><strong>Email address</strong> - for account verification and communication</li>
              <li><strong>Username</strong> - for account identification</li>
              <li><strong>Password</strong> - securely encrypted and stored</li>
              <li><strong>Game progress data</strong> - your current chapter, completed levels, items, and lives</li>
              <li><strong>Game notes</strong> - any notes you choose to save during gameplay</li>
              <li><strong>Registration date</strong> - when you created your account</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-bold text-blue-300 mb-3">How We Use Your Information</h3>
            <p className="mb-3">We use your information solely to:</p>
            <ul className="list-disc list-inside space-y-1 text-white/90 ml-4">
              <li>Provide and maintain your game experience</li>
              <li>Save and sync your game progress across sessions</li>
              <li>Send account verification emails</li>
              <li>Authenticate your account access</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-bold text-blue-300 mb-3">Information We Don't Collect</h3>
            <p className="mb-3">We do <strong>NOT</strong> collect:</p>
            <ul className="list-disc list-inside space-y-1 text-white/90 ml-4">
              <li>Personal identification information beyond username and email</li>
              <li>Payment information (the game is free)</li>
              <li>Device information or tracking data</li>
              <li>Third-party social media data</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-bold text-blue-300 mb-3">Data Security</h3>
            <ul className="list-disc list-inside space-y-1 text-white/90 ml-4">
              <li>All passwords are encrypted using industry-standard bcrypt hashing</li>
              <li>Data is stored securely on protected servers</li>
              <li>We use reCAPTCHA to prevent automated abuse</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-bold text-blue-300 mb-3">Your Rights</h3>
            <p className="mb-3">You have the right to:</p>
            <ul className="list-disc list-inside space-y-1 text-white/90 ml-4">
              <li><strong>Access</strong> your personal data at any time through your account</li>
              <li><strong>Update</strong> your username, email, or password in account settings</li>
              <li><strong>Delete</strong> your account and all associated data permanently</li>
              <li><strong>Export</strong> your game data upon request</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-bold text-red-300 mb-3">Account Deletion</h3>
            <div className="bg-red-900/20 border border-red-400/30 rounded-lg p-4">
              <p className="mb-3">You may delete your account at any time through your account settings. This action:</p>
              <ul className="list-disc list-inside space-y-1 text-red-100 ml-4">
                <li>Permanently removes all your personal data from our servers</li>
                <li>Cannot be undone</li>
                <li>Will result in loss of all game progress and notes</li>
              </ul>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-bold text-blue-300 mb-3">Data Retention</h3>
            <ul className="list-disc list-inside space-y-1 text-white/90 ml-4">
              <li><strong>Active accounts:</strong> Data retained indefinitely to maintain game progress</li>
              <li><strong>Deleted accounts:</strong> All data permanently removed within 30 days</li>
              <li><strong>Unverified accounts:</strong> Automatically deleted after 30 days of inactivity</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-bold text-blue-300 mb-3">Third-Party Services</h3>
            <p className="mb-3">We use:</p>
            <ul className="list-disc list-inside space-y-1 text-white/90 ml-4">
              <li><strong>Google reCAPTCHA</strong> - for security (subject to Google's Privacy Policy)</li>
              <li><strong>Email service</strong> - for account verification only</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-bold text-blue-300 mb-3">Contact</h3>
            <p className="text-white/90">
              For privacy-related questions, contact: <a href="mailto:contact@whitewitch.game" className="text-blue-300 underline hover:text-blue-200">contact@whitewitch.game</a>
            </p>
          </section>

          <div className="text-center text-white/60 text-sm pt-6 border-t border-white/20">
            This policy complies with GDPR and CCPA privacy requirements.
          </div>
        </div>

        {/* Footer buttons */}
        <div className="sticky bottom-0 bg-gray-900/95 border-t border-white/20 p-6 flex justify-center">
          <button
            onClick={onClose}
            className="modern-button"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyModal; 