import axios from "axios";
import { CheckCircle } from "lucide-react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

function VerificationForm() {
  const navigate = useNavigate();
  const { token } = useParams();

  const handleVerification = async () => {
    try {
      await axios.post("http://localhost:3000/api/user/verify-email", { token });
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 2000); 
    } catch (err) {
      console.log(err);
    }
  };
  
  useEffect(() => {
    handleVerification()
  }, []);

  return (
    <div className="flex flex-col gap-6 items-center text-center">
      <CheckCircle className="h-16 w-16 text-green-500" />
      <div>
        <h2 className="text-2xl font-bold text-green-700">Verification Successful!</h2>
        <p className="text-muted-foreground mt-2">Welcome User1! Redirecting to Login Page...</p>
      </div>
    </div>
  );
}

export default VerificationForm;
