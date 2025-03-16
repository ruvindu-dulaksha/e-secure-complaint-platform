import { useState } from "react";
import { Input } from "../../components/ui/input";
import { Lock, Mail, Eye, EyeOff } from "lucide-react";

interface LoginFormFieldsProps {
  email: string;
  password: string;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
}

export const LoginFormFields = ({ 
  email, 
  password, 
  setEmail, 
  setPassword 
}: LoginFormFieldsProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      {/* Email Input */}
      <div className="relative">
        <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="pl-10"
          required
          autoComplete="email"
        />
      </div>

      {/* Password Input with Visibility Toggle */}
      <div className="relative">
        <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        <Input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="pl-10 pr-10"
          required
          minLength={16}
          autoComplete="current-password"
        />
        <button
          type="button"
          className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>
    </>
  );
};
