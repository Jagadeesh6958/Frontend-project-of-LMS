import React, { useState, useEffect, useContext } from 'react';
import { User, MapPin, Link as LinkIcon, Twitter, Mail, Calendar, Shield, Settings, Award, Clock } from 'lucide-react';
import { AuthContext, ToastContext } from '../context/Contexts';
import { Button, Input, Card, Badge } from '../components/UI';
import { api } from '../services/api';

const UserProfile = () => {
  const { user, updateProfile } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Enhanced state for profile fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    location: '',
    website: '',
    twitter: ''
  });

  // Mock stats
  const [stats, setStats] = useState({
    joinedDate: new Date().toLocaleDateString(),
    coursesCompleted: 0,
    hoursLearned: 12,
    certificates: 0
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || '',
        location: user.location || '',
        website: user.website || '',
        twitter: user.twitter || ''
      });
      // Simulate fetching user stats
      api.getStudentEnrollments(user.id).then(enrollments => {
        const completed = enrollments.filter(e => e.progress === 100).length;
        setStats(prev => ({
          ...prev,
          coursesCompleted: completed,
          certificates: completed
        }));
      });
    }
  }, [user]);

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateProfile(user.id, formData); // Assuming updateProfile accepts partial updates
      setIsEditing(false);
      addToast('Profile updated successfully!');
    } catch (error) {
      addToast('Failed to update profile.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const TabButton = ({ id, icon: Icon, label }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === id
          ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
        }`}
    >
      <Icon size={18} />
      {label}
    </button>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header Card */}
      <Card className="p-0 mb-8 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700 relative"></div>
        <div className="px-8 pb-8">
          <div className="relative flex justify-between items-end -mt-12 mb-6">
            <div className="flex items-end gap-6">
              <div className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 bg-white dark:bg-gray-900 flex items-center justify-center text-3xl font-bold text-blue-600 shadow-sm">
                {user.name[0]}
              </div>
              <div className="mb-1">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  {user.name}
                  {user.role === 'admin' && <Badge color="purple">Admin</Badge>}
                </h1>
                <p className="text-gray-500 text-sm flex items-center gap-2">
                  <Mail size={14} /> {user.email} • Joined {stats.joinedDate}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant={isEditing ? 'secondary' : 'primary'} onClick={() => setIsEditing(!isEditing)}>
                {isEditing ? 'Cancel Edit' : 'Edit Profile'}
              </Button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t dark:border-gray-700 pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded text-blue-600"><Award size={20} /></div>
              <div>
                <p className="text-sm text-gray-500">Courses</p>
                <p className="font-bold text-gray-900 dark:text-white">{stats.coursesCompleted} Completed</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded text-green-600"><Shield size={20} /></div>
              <div>
                <p className="text-sm text-gray-500">Certificates</p>
                <p className="font-bold text-gray-900 dark:text-white">{stats.certificates} Earned</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded text-purple-600"><Clock size={20} /></div>
              <div>
                <p className="text-sm text-gray-500">Learning Hours</p>
                <p className="font-bold text-gray-900 dark:text-white">{stats.hoursLearned} Hours</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded text-gray-600"><Calendar size={20} /></div>
              <div>
                <p className="text-sm text-gray-500">Streak</p>
                <p className="font-bold text-gray-900 dark:text-white">3 Days</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar Nav */}
        <div className="space-y-2">
          <TabButton id="overview" icon={User} label="Overview" />
          <TabButton id="security" icon={Shield} label="Security" />
          <TabButton id="settings" icon={Settings} label="Settings" />
        </div>

        {/* Main Content */}
        <div className="md:col-span-3">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="text-lg font-bold mb-4 border-b dark:border-gray-700 pb-2">Basic Info</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Full Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} disabled={!isEditing} />
                  <Input label="Location" placeholder="e.g. San Francisco, CA" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} disabled={!isEditing} />
                  <div className="col-span-1 md:col-span-2">
                    <Input multiline label="Bio" placeholder="Tell us a bit about yourself..." value={formData.bio} onChange={e => setFormData({ ...formData, bio: e.target.value })} disabled={!isEditing} />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-bold mb-4 border-b dark:border-gray-700 pb-2">Social Links</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><LinkIcon size={16} /></div>
                    <input
                      className="pl-10 w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-900"
                      placeholder="Website URL"
                      value={formData.website}
                      onChange={e => setFormData({ ...formData, website: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><Twitter size={16} /></div>
                    <input
                      className="pl-10 w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-900"
                      placeholder="Twitter Username"
                      value={formData.twitter}
                      onChange={e => setFormData({ ...formData, twitter: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </Card>

              {isEditing && (
                <div className="flex justify-end">
                  <Button onClick={handleSave} loading={loading}>Save All Changes</Button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'security' && (
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4">Security Settings</h3>
              <p className="text-gray-500 mb-6">Manage your password and security preferences.</p>
              <div className="space-y-4 max-w-md">
                <Input type="password" label="Current Password" placeholder="********" disabled />
                <Input type="password" label="New Password" placeholder="********" disabled={!isEditing} />
                <Input type="password" label="Confirm Password" placeholder="********" disabled={!isEditing} />
                <Button disabled={!isEditing}>Update Password</Button>
              </div>
            </Card>
          )}

          {activeTab === 'settings' && (
            <Card className="p-6 text-center text-gray-500">
              <Settings size={48} className="mx-auto mb-4 text-gray-300" />
              <p>Notification and privacy settings coming soon!</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;