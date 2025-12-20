import { useState, useEffect } from 'react';
import { User, Mail, Calendar, MessageSquare, Edit2 } from 'lucide-react';
import axios from 'axios';
import { BASE_URL } from '@/utils/constants';
import { Link } from 'react-router-dom';

/**
 * ProfilePage component displays user profile information
 * Fetches user data from /profile endpoint
 */
const Profile = () => {

    const [user, setUser] = useState(null);
    const [userRoomsCount, setUserRoomsCount] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const response = await axios.get(BASE_URL+'/profile', { withCredentials: true });
            setUser(response.data.user);
            const userRooms=await axios.get(BASE_URL+"/user/groupChats", {withCredentials:true});
            setUserRoomsCount(userRooms.data.count);
        } catch (error) {
            console.error('Error fetching profile:', error);
            setError('Failed to load profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading profile...</p>
                </div>
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <User className="w-8 h-8 text-red-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Profile</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={fetchProfile}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Profile Header Card */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                    {/* Cover Image */}
                    <div className="h-32 bg-gradient-to-r from-[#003366] to-[#2C7A7B]"></div>

                    {/* Profile Info */}
                    <div className="px-6 pb-6">
                        <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-16 sm:-mt-12">
                            {/* Profile Photo */}
                            <div className="relative">
                                <img
                                    src={user.photoUrl.url}
                                    alt={user.username}
                                    className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                                />
                            </div>

                            {/* User Info */}
                            <div className="mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left flex-1">
                                <h1 className="text-2xl font-bold text-gray-900">{user.username}</h1>
                                <div className="flex items-center justify-center sm:justify-start mt-1 text-gray-600">
                                    <Mail className="w-4 h-4 mr-2" />
                                    <span className="text-sm">{user.emailId}</span>
                                </div>
                            </div>

                            {/* Edit Button */}
                            <Link to="/editProfile">
                            <button className="mt-4 sm:mt-0 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
                                <Edit2 className="w-4 h-4" />
                                <span>Edit Profile</span>
                            </button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* About Section */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">About</h2>
                    <p className="text-gray-700">{user.about || 'No bio available'}</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    {/* Rooms Count */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Rooms Joined</p>
                                <p className="text-3xl font-bold text-blue-600">{userRoomsCount || 0}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <MessageSquare className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    {/* Skills Count */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Skills</p>
                                <p className="text-3xl font-bold text-purple-600">{user.skills?.length || 0}</p>
                            </div>
                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                                <User className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                    </div>

                    {/* Member Since */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Member Since</p>
                                <p className="text-lg font-semibold text-gray-900">
                                    {new Date(user.createdAt).toLocaleDateString('en-US', {
                                        month: 'short',
                                        year: 'numeric'
                                    })}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <Calendar className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Skills Section */}
                {user.skills && user.skills.length > 0 && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Skills</h2>
                        <div className="flex flex-wrap gap-2">
                            {user.skills.map((skill, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Account Details */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Details</h2>
                    <div className="space-y-3">
                        <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">User ID</span>
                            <span className="text-gray-900 font-mono text-sm">{user._id}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Account Created</span>
                            <span className="text-gray-900">
                                {new Date(user.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </span>
                        </div>
                        <div className="flex justify-between py-2">
                            <span className="text-gray-600">Last Updated</span>
                            <span className="text-gray-900">
                                {new Date(user.updatedAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </span>
                        </div>
                    </div>
                </div>
            </div>


<div className="mt-8 text-center">
  <p className="text-sm text-gray-500">
    Crafted with{' '}
    <span className="inline-block animate-pulse text-red-500">♥</span>
    {' '}by{' '}
    <a 
      href="https://x.com/pratyu_sh_arma"
      target="_blank"
      rel="noopener noreferrer"
      className="text-cyan-500 hover:text-cyan-400 font-medium transition-colors duration-200 relative group"
    >
      Pratyush
      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300"></span>
    </a>
  </p>
</div>


        </div>
    );
};

export default Profile;
