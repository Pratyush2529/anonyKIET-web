import { BASE_URL } from '@/utils/constants';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Lock } from "lucide-react";
import { useDispatch, useSelector } from 'react-redux';
import { addUser } from '@/utils/userSlice';
import logo from "../assets/anonyKIET.png"


const Login = () => {
const navigate = useNavigate();
    const dispatch = useDispatch();

    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
  const user = useSelector((state) => state.user);

useEffect(() => {
  if (user) {
    navigate("/", { replace: true });
  }
}, [user, navigate]);



    const handleSendOtp = async (e) => {
        e.preventDefault();
        setError('');

        const trimmedEmail = email.trim().toLowerCase();

        if (!trimmedEmail || !trimmedEmail.includes('@')) {
            setError('Please enter a valid email address');
            return;
        }

        // Validate KIET email domain
        if (!/^[a-z0-9._%+-]+@kiet\.edu$/.test(trimmedEmail)) {
            setError('Only KIET email addresses are allowed');
            return;
        }

        try {
            setLoading(true);
            await axios.post(BASE_URL+'/sendOtp', { emailId: trimmedEmail }, { withCredentials: true });
            setOtpSent(true);
        } catch (error) {
            console.error('Error sending OTP:', error);
            setError(
                error.response?.data?.message ||
                'Failed to send OTP. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError('');

        if (!otp.trim()) {
            setError('Please enter the OTP');
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post(BASE_URL+'/verifyOtp', {
                emailId: email.trim(),
                otp: otp.trim(),
            }, { withCredentials: true });
            const {isNewUser, user}=response.data;
            dispatch(addUser(user));
            if(isNewUser) navigate("/editProfile");
            else navigate('/');
        } catch (error) {
            console.error('Error verifying OTP:', error);
            setError(
                error.response?.data?.message ||
                'Invalid OTP. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setOtp('');
        setError('');
        await handleSendOtp({ preventDefault: () => { } });
    };

  return (
        <div className="min-h-screen bg-gradient-to-br from-[#F7FAFC] via-white to-[#E6F2F5] flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Logo and Title */}
                <div className="text-center mb-8">
                        <img src={logo} alt="" />
                    <p className="text-gray-600">Anonymous chat for KIET students</p>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                        {otpSent ? 'Verify OTP' : 'Welcome Back'}
                    </h2>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {!otpSent ? (
                        // Step 1: Email Input
                        <form onSubmit={handleSendOtp} className="space-y-4">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        {/* <Mail className="h-5 w-5 text-gray-400" /> */}
                                    </div>
                                    <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="<name>.<libId>@kiet.edu"
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        disabled={loading}
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] text-white py-3 rounded-lg font-medium hover:from-[#FF5722] hover:to-[#FF6B35] transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={loading}
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Sending OTP...
                                    </span>
                                ) : (
                                    'Request OTP'
                                )}
                            </button>
                        </form>
                    ) : (
                        // Step 2: OTP Input
                        <form onSubmit={handleVerifyOtp} className="space-y-4">
                            <div>
                                <label htmlFor="email-display" className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        {/* <Mail className="h-5 w-5 text-gray-400" /> */}
                                    </div>
                                    <input
                                        type="email"
                                        id="email-display"
                                        value={email}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                                        disabled
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                                    One-Time Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        id="otp"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        placeholder="Enter 6-digit OTP"
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        disabled={loading}
                                        maxLength={6}
                                        required
                                    />
                                </div>
                                <p className="mt-2 text-sm text-gray-600">
                                    Check your email for the OTP code
                                </p>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] text-white py-3 rounded-lg font-medium hover:from-[#FF5722] hover:to-[#FF6B35] transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={loading}
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Verifying...
                                    </span>
                                ) : (
                                    'Verify & Login'
                                )}
                            </button>

                            <div className="text-center">
                                <button
                                    type="button"
                                    onClick={handleResendOtp}
                                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                                    disabled={loading}
                                >
                                    Resend OTP
                                </button>
                                <span className="mx-2 text-gray-400">|</span>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setOtpSent(false);
                                        setOtp('');
                                        setError('');
                                    }}
                                    className="text-sm text-gray-600 hover:text-gray-700 font-medium"
                                    disabled={loading}
                                >
                                    Change Email
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                <p className="text-center text-sm text-gray-600 mt-6">
                    Secure authentication powered by OTP
                </p>
            </div>
        </div>

    );
}

export default Login