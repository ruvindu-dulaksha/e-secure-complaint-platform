import { Button } from "../../components/ui/button";
import { LoginFormFields } from "./LoginFormFields";
import { Input } from "../../components/ui/input"; // OTP input field
import { validateLoginForm } from "../../utils/loginValidation";
import { useState } from "react";

interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  onVerifyOTP: () => Promise<void>;
  showOTPField: boolean;
  loading: boolean;
  captchaComponent: React.ReactNode;
  otp: string;
  setOtp: (otp: string) => void;
  isCaptchaVerified: boolean; 
}

export const LoginForm = ({ onSubmit,captchaComponent, onVerifyOTP, showOTPField, loading, otp, setOtp ,  isCaptchaVerified}: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (showOTPField) {
      await onVerifyOTP(); // Handle OTP verification
    } else {
      const validationError = validateLoginForm(email, password);
      if (!validationError) {
        await onSubmit(email, password); // Submit the login form
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!showOTPField ? (
        <>
          <LoginFormFields email={email} password={password} setEmail={setEmail} setPassword={setPassword} />
          {captchaComponent}
          <Button type="submit" className="w-full bg-police-navy hover:bg-police-navy/90" disabled={loading || !isCaptchaVerified}>
            {loading ? "Signing in..." : "Sign in securely"}
          </Button>
        </>
      ) : (
        <>
          <Input 
            type="text" 
            placeholder="Enter OTP" 
            value={otp} 
            onChange={(e) => setOtp(e.target.value)} // Update OTP
            required 
            className="text-center"
          />
          <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={loading}>
            {loading ? "Verifying..." : "Verify OTP"}
          </Button>
        </>
      )}
    </form>
  );
};
