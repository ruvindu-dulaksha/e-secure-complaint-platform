import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../hooks/use-toast";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { LoginForm } from "./LoginForm";
import { loginUser } from "../../services/authService";
import { rateLimit } from "../../utils/rateLimit";
import ReCAPTCHA from "react-google-recaptcha";

export const LoginFormContainer = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (email: string, password: string) => {
    if (!captchaVerified) {
      setError("Please verify that you are not a robot.");
      return;
    }

    setLoading(true);
    setError("");
  
    try {
     
      
      if (await rateLimit(email)) {
        setError("Too many login attempts. Please try again later.");
        return;
      }
  
      const userData = await loginUser(email, password);
      
  
      // Check if the userData contains an OTP message
      if (userData && userData.message === 'OTP sent to email, please verify') {
        // Save email to localStorage for OTP verification
        localStorage.setItem("email", email);
        
        setError(userData.message);
        toast({
          variant: "destructive",
          title: "OTP Verification",
          description: userData.message,
        });
  
        // Navigate to OTP verification page
        navigate("/enter-otp");
        return;  // Return early if OTP verification is required
      }
  
      // Ensure userData and userData.user are defined before accessing the role
      if (userData && userData.user) {
        const role = userData.user.role;
        
  
        toast({
          title: "Login successful",
          description: `Welcome back, ${userData.user.firstName}!`,
        });
  
        // Redirect based on role
        if (role === 'admin') {
          navigate('/admin');
        } else if (role === 'manager') {
          navigate('/manager');
        } else {
          navigate('/dashboard');
        }
      } else {
        setError("User data is missing or malformed");
        toast({
          variant: "destructive",
          title: "Login failed",
          description: "User data is missing or malformed.",
        });
      }
    } catch (error: any) {
      
      let errorMessage = "Invalid email or password";
      
      const attempts = Number(localStorage.getItem(`loginAttempts_${email}`)) || 0;
      localStorage.setItem(`loginAttempts_${email}`, String(attempts + 1));
  
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Login failed",
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  }; 

  const handleCaptchaChange = (token: string | null) => {
    setCaptchaVerified(!!token);
    setError("");
  };


  return (
    <>
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <LoginForm onSubmit={handleLogin} loading={loading}  captchaComponent={
          <ReCAPTCHA
          sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}  
            onChange={handleCaptchaChange}
          />
        }  
        
        onVerifyOTP={function (): Promise<void> {
        throw new Error("Function not implemented.");
      } } showOTPField={false} otp={""} setOtp={function (_otp: string): void {
        throw new Error("Function not implemented.");
        } 
      } 
      isCaptchaVerified={captchaVerified}
      
      
      />
    </>
  );
};