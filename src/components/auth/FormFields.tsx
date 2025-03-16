import { Input } from "../../components/ui/input";

interface FormFieldsProps {
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    nicNumber: string;
  };
  onChange: (field: string, value: string) => void;
}

export const FormFields = ({ formData, onChange }: FormFieldsProps) => {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <Input
          placeholder="First Name"
          value={formData.firstName}
          onChange={(e) => onChange('firstName', e.target.value)}
          required
          className="auth-input"
          maxLength={50}
          aria-label="First Name"
        />
        <Input
          placeholder="Last Name"
          value={formData.lastName}
          onChange={(e) => onChange('lastName', e.target.value)}
          required
          className="auth-input"
          maxLength={50}
          aria-label="Last Name"
        />
      </div>
      
      <Input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => onChange('email', e.target.value)}
        required
        className="auth-input"
        aria-label="Email"
      />
      
      <Input
        type="password"
        placeholder="Password (min 16 characters)"
        value={formData.password}
        onChange={(e) => onChange('password', e.target.value)}
        required
        className="auth-input"
        minLength={16}
        aria-label="Password"
      />
      
      <Input
        placeholder="NIC Number"
        value={formData.nicNumber}
        onChange={(e) => onChange('nicNumber', e.target.value)}
        required
        className="auth-input"
        pattern="^\d{9}[vV]$|^\d{12}$"
        title="Please enter a valid NIC number"
        aria-label="NIC Number"
      />
    </>
  );
};