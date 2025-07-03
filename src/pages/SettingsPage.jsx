import React, { useState } from 'react';

const SettingsPage = () => {
  const [showReminderSaved, setShowReminderSaved] = useState(false);
  const [reminderEmail, setReminderEmail] = useState('');
  const [profileUpdated, setProfileUpdated] = useState(false);

  const handleEditProfile = () => {
    // Simulate profile save
    setProfileUpdated(true);
    setTimeout(() => setProfileUpdated(false), 2000);
  };

  const handleDownloadJournal = () => {
    const blob = new Blob(["This is a sample of your journal data."], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'My_Journal.pdf';
    link.click();
  };

  const handleSaveReminder = () => {
    setShowReminderSaved(true);
    setTimeout(() => setShowReminderSaved(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-green-700">Settings & Tools</h2>

      {/* Edit Profile & Skills */}
      <div className="bg-white shadow p-4 rounded-lg mb-6">
        <h3 className="text-xl font-semibold mb-2">Edit Profile & Skills</h3>
        <button
          onClick={handleEditProfile}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Save Changes
        </button>
        {profileUpdated && (
          <p className="text-green-600 mt-2">✅ Profile information updated!</p>
        )}
      </div>

      {/* Download Journal */}
      <div className="bg-white shadow p-4 rounded-lg mb-6">
        <h3 className="text-xl font-semibold mb-2">Download Journal as PDF</h3>
        <button
          onClick={handleDownloadJournal}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Download PDF
        </button>
      </div>

      {/* Weekly Email Reminders */}
      <div className="bg-white shadow p-4 rounded-lg">
        <h3 className="text-xl font-semibold mb-2">Set Weekly Reminder Emails</h3>
        <input
          type="email"
          placeholder="Enter your email"
          value={reminderEmail}
          onChange={(e) => setReminderEmail(e.target.value)}
          className="w-full border px-3 py-2 rounded mb-2"
        />
        <button
          onClick={handleSaveReminder}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          Save Reminder
        </button>
        {showReminderSaved && (
          <p className="text-green-600 mt-2">✅ Reminder email saved!</p>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;
