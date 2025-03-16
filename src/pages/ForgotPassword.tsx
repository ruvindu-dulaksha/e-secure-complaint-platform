import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from ".././components/ui/button";
import { Input } from "../components/ui/input";
import { useToast } from "..//hooks/use-toast";
import { Alert, AlertDescription } from ".././components/ui/alert";
import { Card, CardHeader, CardContent, CardFooter } from ".././components/ui/card";
import { Mail } from "lucide-react";
import { auth } from ".././services/auth";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!email) {
      setError("Email is required");
      return;
    }

    setLoading(true);
    try {
      // Send password reset email
      await auth.resetPassword(email);
      setSuccess(true);
      toast({
        title: "Reset link sent",
        description: "Check your email for password reset instructions",
      });
    } catch (err: any) {
      
      let errorMessage = "Failed to send reset link";
      
      if (err.code === 'auth/invalid-email') {
        errorMessage = "Invalid email address";
      } else if (err.code === 'auth/user-not-found') {
        errorMessage = "No account found with this email address";
      }
      
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-police-light px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-police-navy">Reset Password</h1>
          <p className="text-sm text-gray-600">
            Enter your email address and we'll send you a link to reset your password
          </p>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert className="mb-4">
              <AlertDescription>
                If an account exists with this email, you will receive password reset instructions.
              </AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-police-navy hover:bg-police-navy/90"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send reset link"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link to="/login" className="text-sm text-police-navy hover:underline">
            Back to login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ForgotPassword;
