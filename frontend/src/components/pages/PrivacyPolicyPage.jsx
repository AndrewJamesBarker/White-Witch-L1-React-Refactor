import React from 'react';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicyPage = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="max-w-4xl mx-auto px-6 py-12 privacy-policy-content">
        
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="modern-button mb-6 back-button"
          >
            ← Back
          </button>
          
          <h1 className="text-4xl font-bold text-white mb-2">Privacy Policy</h1>
          <p className="effective-date">
            <strong>Effective Date:</strong> {currentMonth} {currentYear}
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8">
          
          <section className="info-section">
            <h2 className="text-2xl font-bold text-blue-300 mb-4">Information We Collect</h2>
            <p className="mb-4">When you create an account with White Witch, we collect:</p>
            <ul className="list-disc list-inside space-y-2 text-white/90 ml-4">
              <li><strong>Email address</strong> - for account verification and communication</li>
              <li><strong>Username</strong> - for account identification</li>
              <li><strong>Password</strong> - securely encrypted and stored</li>
              <li><strong>Game progress data</strong> - your current chapter, completed levels, items, and lives</li>
              <li><strong>Game notes</strong> - any notes you choose to save during gameplay</li>
              <li><strong>Registration date</strong> - when you created your account</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-blue-300 mb-4">How We Use Your Information</h2>
            <p className="mb-4">We use your information solely to:</p>
            <ul className="list-disc list-inside space-y-2 text-white/90 ml-4">
              <li>Provide and maintain your game experience</li>
              <li>Save and sync your game progress across sessions</li>
              <li>Send account verification emails</li>
              <li>Authenticate your account access</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-blue-300 mb-4">Information We Don't Collect</h2>
            <p className="mb-4">We do <strong>NOT</strong> collect:</p>
            <ul className="list-disc list-inside space-y-2 text-white/90 ml-4">
              <li>Personal identification information beyond username and email</li>
              <li>Payment information (the game is free)</li>
              <li>Device information or tracking data</li>
              <li>Third-party social media data</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-blue-300 mb-4">Data Security</h2>
            <p className="mb-4">Your data is protected through multiple security measures:</p>
            <ul className="list-disc list-inside space-y-2 text-white/90 ml-4">
              <li>All passwords are encrypted using industry-standard bcrypt hashing</li>
              <li>Data is stored securely on protected servers</li>
              <li>We use reCAPTCHA to prevent automated abuse</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-blue-300 mb-4">Your Rights</h2>
            <p className="mb-4">You have the right to:</p>
            <ul className="list-disc list-inside space-y-2 text-white/90 ml-4">
              <li><strong>Update</strong> your username, email, or password through your account settings</li>
              <li><strong>Delete</strong> your account and all associated data permanently</li>
              <li><strong>Request information</strong> about what personal data we have stored (contact us via email)</li>
              <li><strong>Request data correction</strong> if any of your information is inaccurate</li>
            </ul>
            <p className="mt-4 text-white/80">
              For data access or correction requests, please contact us via email. We will respond within 30 days.
            </p>
          </section>

          <section className="warning-section">
            <h2 className="text-2xl font-bold text-red-300 mb-4">Account Deletion</h2>
            <p className="mb-4">You may delete your account at any time through your account settings. This action:</p>
            <ul className="list-disc list-inside space-y-2 text-red-100 ml-4">
              <li>Permanently removes all your personal data from our servers</li>
              <li>Cannot be undone</li>
              <li>Will result in loss of all game progress and notes</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-blue-300 mb-4">Data Retention</h2>
            <ul className="list-disc list-inside space-y-2 text-white/90 ml-4">
              <li><strong>Active accounts:</strong> Data retained indefinitely to maintain game progress</li>
              <li><strong>Deleted accounts:</strong> All data permanently removed within 30 days</li>
              <li><strong>Unverified accounts:</strong> Automatically deleted after 30 days of inactivity</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-blue-300 mb-4">Third-Party Services</h2>
            <p className="mb-4">We use:</p>
            <ul className="list-disc list-inside space-y-2 text-white/90 ml-4">
              <li><strong>Google reCAPTCHA</strong> - for security (subject to Google's Privacy Policy)</li>
              <li><strong>Email service</strong> - for account verification only</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-blue-300 mb-4">Changes to This Policy</h2>
            <p className="text-white/90">
              We may update this privacy policy occasionally. Users will be notified of significant changes via email.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-blue-300 mb-4">Contact</h2>
            <p className="text-white/90">
              For privacy-related questions, contact: <span className="email-contact">whitewitchgame [at] gmail [dot] com</span>
            </p>
          </section>

          <div className="compliance-footer">
            This policy complies with GDPR and CCPA privacy requirements.
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage; 