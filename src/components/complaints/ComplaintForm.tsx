import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Checkbox } from "../../components/ui/checkbox";
import { useToast } from "../../components/ui/use-toast";

import { Alert, AlertDescription } from "../../components/ui/alert";
import { Loader2 } from "lucide-react";

interface ComplaintFormProps {
  onClose: () => void;
}


export const ComplaintForm = ({ onClose }: ComplaintFormProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      setError(null);
  
      // Create form data for file upload
      const formData = new FormData();
      formData.append("title", data.name);
      formData.append("description", data.description || "");
      formData.append("location", data.location);
      if (data.evidence && data.evidence[0]) {
        formData.append("evidence", data.evidence[0]);
      }
      
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication required. Please log in.");
      }
      const API_URL = import.meta.env.VITE_API_URL;

      const response = await fetch(`${API_URL}/complaints/comp`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // Include the token here
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json(); // Parse error response
        throw new Error(errorData.message || "Failed to submit the complaint. Please try again.");
      }
  
      // Handle success
      toast({
        title: "Complaint Submitted",
        description: "Your complaint has been successfully submitted.",
      });
      onClose();
    } catch (error: any) {
      

      // Handle different error types
      if (error.message.includes("Failed to fetch")) {
        setError("Cannot connect to the server. Please check your internet connection.");
      } else if (error.message.includes("Authentication required")) {
        setError("Session expired. Please log in again.");
      } else if (error.message.includes("Invalid file type")) {
        setError("Unsupported file format. Please upload images, videos, PDFs, or Word documents.");
      } else if (error.message.includes("File too large")) {
        setError("The uploaded file is too large. Maximum allowed size is 5MB.");
      } else {
        setError(error.message || "Something went wrong. Please try again.");
      }

      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to submit complaint.",
      });
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-lg shadow">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div>
        <Input
          placeholder="Complaint Title"
          {...register("name", { required: "Title is required" })}
          className="w-full"
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message as string}</p>
        )}
      </div>

      <div>
        <Input
          placeholder="Location"
          {...register("location", { required: "Location is required" })}
          className="w-full"
        />
        {errors.location && (
          <p className="text-red-500 text-sm mt-1">{errors.location.message as string}</p>
        )}
      </div>

      <div>
        <Input
          type="file"
          accept="image/*,video/*,.pdf,.doc,.docx"
          {...register("evidence")}
          className="w-full"
        />
        <p className="text-sm text-gray-500 mt-1">
          Supported formats: Images, Videos, PDF, DOC, DOCX (Max 5MB)
        </p>
      </div>

      <div>
        <Input
          placeholder="Description"
          {...register("description")}
          className="w-full"
        />
      </div>

      <div className="flex items-center space-x-2">
      <Checkbox 
                id="validity" 
  {...register("validity", { required: "You must confirm the information is true" })} 
/>
<label htmlFor="validity" className="text-sm text-gray-600">
  I confirm that all information provided is true and accurate
</label>
{errors.validity && (
  <p className="text-red-500 text-sm mt-1">{errors.validity.message as string}</p>
)}

        
      </div>
      {errors.validity && (
        <p className="text-red-500 text-sm">{errors.validity.message as string}</p>
      )}

      <div className="flex justify-end space-x-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          className="bg-police-navy text-white"
          disabled={loading || !!errors.validity} 
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Complaint"
          )}
        </Button>
      </div>
    </form>
  );
};
