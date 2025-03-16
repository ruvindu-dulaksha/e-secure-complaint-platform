import { useNavigate } from "react-router-dom";
import { Button } from ".././components/ui/button";
import { Shield, MessageSquare, Upload, CheckCircle, User, List } from "lucide-react";
import FirebaseConnectionTest from ".././components/FirebaseConnectionTest";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-police-navy to-blue-900 text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-5xl mx-auto text-center space-y-8">
            <div className="flex justify-center mb-6">
              <Shield className="h-20 w-20 text-police-gold animate-pulse" />
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in">
              Secure Police E-Complaint Portal
            </h1>
            <p className="text-xl text-police-light/90 mb-12 max-w-2xl mx-auto leading-relaxed">
              Submit and track your complaints securely through our advanced digital platform. 
              Your voice matters, and we're here to ensure justice is served efficiently.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate("/login")}
                className="bg-police-gold hover:bg-police-gold/90 text-police-navy text-lg px-8 py-6 hover:scale-105 transition-transform"
              >
                <MessageSquare className="mr-2" />
                File a Complaint
              </Button>
              <Button
                onClick={() => navigate("/signup")}
                variant="outline"
                className="border-2 border-police-gold text-police-gold hover:bg-police-gold/10 text-lg px-8 py-6 hover:scale-105 transition-transform"
              >
                <User className="mr-2" />
                Register Now
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-police-navy text-center mb-16">
            Why Choose Our E-Complaint Portal?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <FeatureCard
              icon={Shield}
              title="Secure & Confidential"
              description="Your complaints are protected with enterprise-grade encryption and security measures"
            />
            <FeatureCard
              icon={Upload}
              title="Digital Evidence Upload"
              description="Easily upload photos, videos, and documents to support your complaint"
            />
            <FeatureCard
              icon={List}
              title="Track Progress"
              description="Monitor the status of your complaint in real-time with our advanced tracking system"
            />
            <FeatureCard
              icon={CheckCircle}
              title="Swift Resolution"
              description="Our streamlined process ensures quick response and resolution to your complaints"
            />
            <FeatureCard
              icon={MessageSquare}
              title="24/7 Support"
              description="Submit and track complaints anytime, with round-the-clock assistance"
            />
            <FeatureCard
              icon={User}
              title="User-Friendly Interface"
              description="Simple and intuitive platform designed for ease of use"
            />
          </div>
        </div>
      </div>

      {/* Process Section */}
      <div className="bg-gray-50 py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-police-navy text-center mb-16">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <ProcessCard
              number="1"
              title="Create Account"
              description="Register securely with your NIC number and basic information"
              icon={User}
            />
            <ProcessCard
              number="2"
              title="Submit Details"
              description="Provide complaint information and upload supporting evidence"
              icon={MessageSquare}
            />
            <ProcessCard
              number="3"
              title="Track Progress"
              description="Monitor status updates and receive notifications"
              icon={List}
            />
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="bg-police-navy text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
            <StatCard number="10k+" label="Resolved Cases" />
            <StatCard number="24/7" label="Support Available" />
            <StatCard number="98%" label="User Satisfaction" />
            <StatCard number="1hr" label="Avg. Response Time" />
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-police-navy to-blue-900 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to File a Complaint?
          </h2>
          <p className="text-xl text-police-light/90 mb-12 max-w-2xl mx-auto">
            Join thousands of citizens who have successfully used our platform to voice their concerns.
          </p>
          <Button
            onClick={() => navigate("/signup")}
            className="bg-police-gold hover:bg-police-gold/90 text-police-navy text-lg px-8 py-6 hover:scale-105 transition-transform"
          >
            Get Started Now
          </Button>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ 
  icon: Icon, 
  title, 
  description 
}: { 
  icon: any; 
  title: string; 
  description: string;
}) => (
  <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
    <div className="flex flex-col items-center text-center space-y-4">
      <div className="p-3 bg-police-navy rounded-full">
        <Icon className="w-8 h-8 text-police-gold" />
      </div>
      <h3 className="text-xl font-semibold text-police-navy">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  </div>
);

const ProcessCard = ({
  number,
  title,
  description,
  icon: Icon,
}: {
  number: string;
  title: string;
  description: string;
  icon: any;
}) => (
  <div className="text-center space-y-4">
    <div className="relative">
      <div className="w-16 h-16 bg-police-gold text-police-navy rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
        {number}
      </div>
      <div className="absolute -right-1/2 top-1/2 hidden md:block">
        {number !== "3" && (
          <div className="w-full border-t-2 border-dashed border-police-gold"></div>
        )}
      </div>
    </div>
    <div className="p-6">
      <Icon className="w-8 h-8 text-police-navy mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-police-navy mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  </div>
);

const StatCard = ({ number, label }: { number: string; label: string }) => (
  <div className="space-y-2">
    <div className="text-3xl md:text-4xl font-bold text-police-gold">{number}</div>
    <div className="text-sm text-police-light/90">{label}</div>
  </div>
);

export default Index;
