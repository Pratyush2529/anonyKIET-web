import { BASE_URL } from '@/utils/constants';
import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Calendar, Users, Image, FileText, Tag, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addUser } from '@/utils/userSlice';
import toast from 'react-hot-toast';

const EditProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);


  const [formData, setFormData] = useState({
    username: user?.username || '',
    age: user?.age || '',
    gender: user?.gender || '',
    // photoUrl: user?.photoUrl || '',
    about: user?.about || '',
    skills: user?.skills || []
  });

  const [profilePicFile, setProfilePicFile] = useState(null);

  const [currentSkill, setCurrentSkill] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (currentSkill.trim() && !formData.skills.includes(currentSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, currentSkill.trim()]
      }));
      setCurrentSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.username.trim()) {
      setError('Username is required');
      return;
    }
    if (!formData.age || formData.age < 1 || formData.age > 150) {
      setError('Please enter a valid age');
      return;
    }
    if (!formData.gender) {
      setError('Please select a gender');
      return;
    }

    try {
      setLoading(true);
      //--------------------------------


      const payload = new FormData();

payload.append("username", formData.username);
payload.append("age", parseInt(formData.age));
payload.append("gender", formData.gender);
payload.append("about", formData.about);
payload.append("skills", JSON.stringify(formData.skills));

if (profilePicFile) {
  payload.append("profilePic", profilePicFile);
}

const response = await axios.patch(
  BASE_URL + "/profile/edit",
  payload,
  {
    withCredentials: true,
  }
);





      //--------------------------------
      
      dispatch(addUser(response.data.data));
      toast.success('Profile Updated Successfully!');
      
      navigate('/');
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(
        error.response?.data?.message ||
        'Failed to update profile. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    
    <div className="min-h-screen bg-gradient-to-br from-[#F7FAFC] via-white to-[#E6F2F5] flex items-center justify-center p-4 pt-24">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-[#003366] to-[#2C7A7B] rounded-2xl shadow-lg mb-3 sm:mb-4">
            <User className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-[#003366] to-[#FF6B35] bg-clip-text text-transparent mb-2 px-4">
            Complete Your Profile
          </h1>
          <p className="text-sm sm:text-base text-gray-600">Tell us more about yourself</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Choose a unique username"
                  className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                  disabled={loading}
                  required
                />
              </div>
            </div>

            {/* Age and Gender Row */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {/* Age */}
              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
                  Age *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    placeholder="18"
                    min="1"
                    max="150"
                    className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              {/* Gender */}
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                  Gender *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Users className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  </div>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent appearance-none bg-white"
                    disabled={loading}
                    required
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="others">Others</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Profile Picture */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Profile Picture
  </label>

  <input
    type="file"
    accept="image/*"
    onChange={(e) => setProfilePicFile(e.target.files[0])}
    disabled={loading}
    className="block w-full text-xs sm:text-sm text-gray-700
      file:mr-3 sm:file:mr-4 file:py-1.5 sm:file:py-2 file:px-3 sm:file:px-4
      file:rounded-lg file:border-0
      file:text-xs sm:file:text-sm file:font-medium
      file:bg-[#E6F2F5] file:text-[#003366]
      hover:file:bg-[#D1E7EA]"
  />

  {/* Image Preview */}
  {profilePicFile && (
    <img
      src={URL.createObjectURL(profilePicFile)}
      alt="preview"
      className="mt-3 h-20 w-20 sm:h-24 sm:w-24 rounded-full object-cover border"
    />
  )}
</div>


            {/* About */}
            <div>
              <label htmlFor="about" className="block text-sm font-medium text-gray-700 mb-2">
                About
              </label>
              <div className="relative">
                <div className="absolute top-3 left-3 pointer-events-none">
                  <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                </div>
                <textarea
                  id="about"
                  name="about"
                  value={formData.about}
                  onChange={handleInputChange}
                  placeholder="Tell us about yourself..."
                  rows="4"
                  className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent resize-none"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Skills */}
            <div>
              <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-2">
                Skills
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Tag className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="skills"
                    value={currentSkill}
                    onChange={(e) => setCurrentSkill(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleAddSkill(e);
                      }
                    }}
                    placeholder="Add a skill and press Enter"
                    className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                    disabled={loading}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-[#003366] to-[#2C7A7B] text-white rounded-lg font-medium hover:from-[#002244] hover:to-[#1F5A5A] transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 whitespace-nowrap"
                  disabled={loading}
                >
                  Add
                </button>
              </div>

              {/* Skills Display */}
              {formData.skills.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {formData.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1 text-xs sm:text-sm bg-gradient-to-r from-[#E6F2F5] to-[#D1E7EA] text-[#003366] rounded-full font-medium"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="ml-1 hover:text-red-600 transition-colors"
                        disabled={loading}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] text-white py-2.5 sm:py-3 text-sm sm:text-base rounded-lg font-medium hover:from-[#FF5722] hover:to-[#FF6B35] transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Saving Profile...
                </span>
              ) : (
                'Save Profile'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          Fields marked with * are required
        </p>
      </div>
      
    </div>
  );
};

export default EditProfile;