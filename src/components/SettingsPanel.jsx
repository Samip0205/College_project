import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pencil, Download, Bell, Youtube, Instagram } from 'lucide-react';

const SettingsPanel = () => {
  const [showReminderSettings, setShowReminderSettings] = useState(false);
  const [reminderEmail, setReminderEmail] = useState('');
  const [profileModal, setProfileModal] = useState(false);

  const handlePDFDownload = () => {
    alert('📄 Journal PDF downloaded!');
  };

  const toggleReminder = () => {
    setShowReminderSettings(!showReminderSettings);
  };

  const handleConnect = (platform) => {
    alert(`🔗 Connected to ${platform}`);
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-xl space-y-5">
      <h2 className="text-2xl font-bold text-center">⚙️ Settings & Tools</h2>

      {/* Edit Profile & Skills */}
      <button
        onClick={() => setProfileModal(true)}
        className="flex items-center gap-2 px-4 py-2 w-full bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition"
      >
        <Pencil className="w-5 h-5" />
        Edit Profile & Skills
      </button>

      {/* Download Journal as PDF */}
      <button
        onClick={handlePDFDownload}
        className="flex items-center gap-2 px-4 py-2 w-full bg-green-500 text-white rounded-xl hover:bg-green-600 transition"
      >
        <Download className="w-5 h-5" />
        Download Journal as PDF
      </button>

      {/* Set Weekly Reminder */}
      <button
        onClick={toggleReminder}
        className="flex items-center gap-2 px-4 py-2 w-full bg-yellow-500 text-white rounded-xl hover:bg-yellow-600 transition"
      >
        <Bell className="w-5 h-5" />
        Set Weekly Reminder Emails
      </button>

      <AnimatePresence>
        {showReminderSettings && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-yellow-50 p-4 rounded-xl mt-2"
          >
            <label className="block mb-2 font-medium">Your Email:</label>
            <input
              type="email"
              value={reminderEmail}
              onChange={(e) => setReminderEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring"
              placeholder="Enter your email"
            />
            <button
              onClick={() => alert(`✅ Reminder set for ${reminderEmail}`)}
              className="mt-3 bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
            >
              Save Reminder
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Connect Instagram or YouTube */}
      <div className="flex gap-4 mt-4 justify-center">
        <button
          onClick={() => handleConnect('Instagram')}
          className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 flex items-center gap-2"
        >
          <Instagram className="w-5 h-5" />
          Instagram
        </button>
        <button
          onClick={() => handleConnect('YouTube')}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 flex items-center gap-2"
        >
          <Youtube className="w-5 h-5" />
          YouTube
        </button>
      </div>

      {/* Profile Edit Modal */}
      <AnimatePresence>
        {profileModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setProfileModal(false)}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 w-[90%] max-w-md shadow-xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h3 className="text-xl font-bold mb-4">Edit Profile & Skills</h3>
              <input
                type="text"
                className="w-full mb-3 p-2 border rounded-md"
                placeholder="Display Name"
              />
              <input
                type="text"
                className="w-full mb-3 p-2 border rounded-md"
                placeholder="Skills (comma-separated)"
              />
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={() => {
                  alert('✅ Profile Updated!');
                  setProfileModal(false);
                }}
              >
                Save Changes
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SettingsPanel;
