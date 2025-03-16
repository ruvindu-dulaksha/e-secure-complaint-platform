import { Link } from "react-router-dom";
import { Card, CardHeader, CardContent, CardFooter } from "../components/ui/card";
import { Shield } from "lucide-react";
import { LoginFormContainer } from "../components/auth/LoginFormContainer";

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-police-light px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <Shield className="h-12 w-12 text-police-navy" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-police-navy">Secure Login</h1>
          <p className="text-sm text-gray-600">Enter your credentials to access your account</p>
        </CardHeader>
        <CardContent>
          <LoginFormContainer />
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Link 
            to="/forgot-password"
            className="text-sm text-police-navy hover:underline"
          >
            Forgot your password?
          </Link>
          <div className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/signup" className="text-police-navy hover:underline">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;