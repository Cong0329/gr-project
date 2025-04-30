import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { RootState } from '../../../../redux/store';
import { vefifyEmailAPI } from '../../../../redux/userAsyncThunk';
import { vefify } from '../../../../redux/authSlice';

interface VerifyCodeProps {
  email?: string;
}

export const VerifyCodePage = ({ email }: VerifyCodeProps) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { status, isAuthenticated, verify } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();


  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes countdown
  const [isResending, setIsResending] = useState(false);
  const { message, mail } = useSelector((state: RootState) => state.auth);

  // useEffect(()=> {
  //   if(isAuthenticated && !verify) {
  //     navigate("/admin");
  //   }
  // },[isAuthenticated, navigate, verify]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const codeParam = params.get('code');
    if (codeParam && codeParam.length === 6) {
      setVerificationCode(codeParam.split(''));
    }
  }, [location.search]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  // Handle input change
  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);
    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  // Handle key down (for backspace navigation)
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  // Handle code submission
  const handleSubmit = async () => {
    setError('');
    const code = verificationCode.join('');

    if (code.length !== 6) {
      setError('Please enter the complete 6-digit verification code');
      return;
    }

    setIsSubmitting(true);

    try {
      await dispatch(vefifyEmailAPI({ email: mail, verifyCode: code }));
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle code resend
  const handleResendCode = async () => {
    if (timeLeft > 0) return;

    setIsResending(true);
    setError('');

    try {
      // Replace with your actual resend API call
      const response = await fetch(`${import.meta.env.VITE_NODEJS_BACKEND_URL}/auth/resend-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email || ''
        }),
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to resend code');
      }

      // Reset timer
      setTimeLeft(120);
      // Reset input fields
      setVerificationCode(['', '', '', '', '', '']);
    } catch (err: any) {
      setError(err.message || 'Failed to resend verification code');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-blue-600 p-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-center mb-6">Verification Code</h2>

          <p className="text-gray-600 text-center mb-8">
            Please enter the 6-digit verification code sent to{' '}
            <span className="font-medium">{email || 'your email'}</span>
          </p>

          <div className="flex justify-center space-x-2 mb-6">
            {verificationCode.map((digit, index) => (
              <input
                key={index}
                id={`code-${index}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-xl font-bold border rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
              />
            ))}
          </div>

          {error || message && (
            <div className="text-red-500 text-center mb-4">
              {error} {message}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={isSubmitting || verificationCode.join('').length !== 6}
            className={`w-full py-3 rounded-full font-semibold ${isSubmitting || verificationCode.join('').length !== 6
              ? 'bg-gray-300 text-gray-500'
              : 'bg-blue-600 text-white hover:bg-blue-700'
              } transition-colors duration-200 mb-4`}
          >
            {isSubmitting ? 'Verifying...' : 'Verify Code'}
          </button>

          <div className="text-center">
            <p className="text-gray-600 mb-2">
              Didn't receive the code? {timeLeft > 0 && `(${formatTime(timeLeft)})`}
            </p>
            <button
              onClick={handleResendCode}
              disabled={timeLeft > 0 || isResending}
              className={`font-semibold ${timeLeft > 0 || isResending
                ? 'text-gray-400'
                : 'text-blue-600 hover:text-blue-800'
                } transition-colors duration-200`}
            >
              {isResending ? 'Sending...' : 'Resend Code'}
            </button>
          </div>
        </div>
      </div>
      {status === "loading" &&
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-white text-sm">Đang tải...</p>
        </div>
      </div>
    }
    </>
 
  );
};