export const PasswordRequirements = () => {
  return (
    <div className="text-sm text-gray-600 space-y-1">
      <p>Password must:</p>
      <ul className="list-disc pl-4">
        <li>Be at least 16 characters long</li>
        <li>Contain at least one uppercase letter</li>
        <li>Contain at least one lowercase letter</li>
        <li>Contain at least one number</li>
        <li>Contain at least one special character (@$!%*?&)</li>
      </ul>
    </div>
  );
};