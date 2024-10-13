// pages/login.js

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function Login() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const router = useRouter();

  // Request OTP
  const requestOtp = async () => {
    try {
      await axios.post('http://localhost:3000/api/auth/mlogin', { phone });
      setStep(2);
    } catch (error) {
      console.error('Error requesting OTP:', error);
      alert('Failed to request OTP. Please try again.');
    }
  };

  // Validate OTP
  const validateOtp = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/auth/otp/validate', {
        phone,
        otp,
      });

      const token = response.data.access_token;
      if (token) {
        localStorage.setItem('token', token);
        router.push('/rooms'); // Redirect to rooms page after successful login
      } else {
        alert('Invalid OTP or validation failed');
      }
    } catch (error) {
      console.error('Error validating OTP:', error);
      alert('OTP validation failed. Please ensure the OTP is correct.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Ludo Game Login</h1>
      {step === 1 ? (
        <>
          <input
            type="text"
            placeholder="Enter Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mb-4 p-2 border border-gray-300 rounded"
          />
          <button onClick={requestOtp} className="px-4 py-2 bg-blue-600 text-white rounded">
            Request OTP
          </button>
        </>
      ) : (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="mb-4 p-2 border border-gray-300 rounded"
          />
          <button onClick={validateOtp} className="px-4 py-2 bg-green-600 text-white rounded">
            Validate OTP
          </button>
        </>
      )}
    </div>
  );
}
