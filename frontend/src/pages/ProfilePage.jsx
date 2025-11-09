import DashboardNavbar from '../components/Dashboard/Navbar';
import { ProfileInfo, ChangePassword } from '../components/Profile';

/**
 * Profile Page Component
 * Displays user profile information and account settings
 * Requirements: 18.1, 18.2, 18.3
 */
export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Navbar */}
      <DashboardNavbar showSearch={false} />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Account Settings
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage your profile information and security settings
          </p>
        </div>

        {/* Profile Sections */}
        <div className="space-y-6">
          {/* Profile Information */}
          <ProfileInfo />

          {/* Change Password */}
          <ChangePassword />

          {/* Account Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Account Actions
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    Download Your Data
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Export all your notes and data
                  </p>
                </div>
                <button
                  className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                  aria-label="Download data"
                >
                  Download
                </button>
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <h3 className="text-sm font-medium text-red-600 dark:text-red-400">
                    Delete Account
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Permanently delete your account and all data
                  </p>
                </div>
                <button
                  className="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  aria-label="Delete account"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
