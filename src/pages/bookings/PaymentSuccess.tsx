import  { useState, useEffect } from 'react';
import { CheckCircle, Home, Receipt, ArrowRight } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useNavigate } from 'react-router-dom';

export default function PaymentSuccess() {
  const [countdown, setCountdown] = useState(5);
  const [isAnimated, setIsAnimated] = useState(false);
  const navigate = useNavigate()

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => setIsAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      navigate("/")
    }
  }, [countdown]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Main Success Card */}
        <div className={`bg-white rounded-2xl shadow-xl border border-green-100 p-8 text-center transform transition-all duration-700 ease-out ${
          isAnimated ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'
        }`}>
          
          {/* Success Icon with Animation */}
          <div className="relative mb-6">
            <div className={`w-20 h-20 mx-auto bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center transform transition-all duration-500 delay-200 ${
              isAnimated ? 'scale-100 rotate-0' : 'scale-0 rotate-180'
            }`}>
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            
            {/* Ripple Effect */}
            <div className={`absolute inset-0 w-20 h-20 mx-auto rounded-full bg-green-400 opacity-20 transform transition-all duration-1000 delay-300 ${
              isAnimated ? 'scale-150 opacity-0' : 'scale-100 opacity-20'
            }`} />
          </div>

          {/* Success Message */}
          <div className={`transform transition-all duration-500 delay-400 ${
            isAnimated ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Pembayaran Berhasil!
            </h1>
            <p className="text-gray-600 mb-6">
              Terima kasih! Transaksi Anda telah diproses dengan sukses.
            </p>
          </div>

        </div>

        {/* Countdown Alert */}
        <div className={`mt-6 transform transition-all duration-500 delay-700 ${
          isAnimated ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          <Alert className="bg-blue-50 border-blue-200">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <AlertDescription className="text-blue-700 font-medium">
                Redirecting to home in {countdown} second{countdown !== 1 ? 's' : ''}
              </AlertDescription>
              <ArrowRight className="w-4 h-4 text-blue-500 ml-auto" />
            </div>
          </Alert>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 bg-gray-200 rounded-full h-1 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-1000 ease-linear"
            style={{ width: `${((5 - countdown) / 5) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}