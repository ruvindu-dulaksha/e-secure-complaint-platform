import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./../components/ui/button";
import { Input } from "./../components/ui/input"; // OTP input field
import { verifyOTP } from "./../services/authService"; // Service to verify OTP
import { useToast } from "./../hooks/use-toast"; // Custom toast hook
import { Spinner } from "./../components/ui/Spinner";

export const OTPEntenter = () => {
  const [otp, setOtp] = useState(""); // State to hold OTP
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>(""); // Error state
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Reset previous error

    // Basic OTP validation (assuming OTP should be 6 digits)
    if (otp.length !== 6) {
      setError("OTP must be 6 digits.");
      setLoading(false);
      return;
    }

    try {
      const email = localStorage.getItem("email"); // Get email from localStorage
      if (!email) throw new Error("Email is missing. Please try again.");

      const response = await verifyOTP(email, otp); // Verify OTP using service
      localStorage.setItem("token", response.token); // Store token
      localStorage.setItem("userRole", btoa(response.user.role)); // Store user role

      toast({ title: "Login successful", description: `Welcome back, ${response.user.firstName}!` });
      navigate(response.user.role === "admin" ? "/admin" : response.user.role === "manager" ? "/manager" : "/dashboard"); // Navigate to role-based dashboard
    } catch (error: any) {
      if (error.message === "Invalid OTP") {
        setError("The OTP you entered is incorrect. Please check and try again.");
      } else {
        setError("Something went wrong. Please try again later.");
      }

      toast({ variant: "destructive", title: "Verification failed", description: error.message || "Unable to verify OTP" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-white rounded-lg shadow-md max-w-sm mx-auto">
      {error && <div className="alert alert-error text-red-600 font-semibold">{error}</div>}

      <Input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        required
        className="text-center border-2 p-4 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-green-600"
        maxLength={6} // Assuming the OTP should be 6 digits
        aria-label="OTP Input"
      />

      <Button
        type="submit"
        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-md"
        disabled={loading}
      >
        {loading ? <Spinner /> : "Verify OTP"}
      </Button>
    </form>
  );
};
