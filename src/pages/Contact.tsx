import { Card, CardHeader, CardContent } from "../components/ui/card";
import { Mail, Phone, MapPin } from "lucide-react";

const Contact = () => {
  return (
    <div className="min-h-screen bg-police-light py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-police-navy mb-3">Get in Touch</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Have questions? Reach out to us, and we'll assist you as soon as possible.
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {[
            { Icon: Phone, title: "Phone", content: ["911","Emergency Services: Always Available"] },
            { Icon: Mail, title: "Email", content: ["info@police.lk", "support@ecomplaint.gov"] },
            { Icon: MapPin, title: "Address", content: ["Police Headquarters,", "Church Street, Colombo 01"] }
          ].map(({ Icon, title, content }, index) => (
            <Card key={index} className="p-6 text-center transition-transform transform hover:scale-105 shadow-lg">
              <CardHeader className="space-y-2">
                <div className="flex justify-center">
                  <Icon className="h-10 w-10 text-police-navy animate-bounce" />
                </div>
                <h3 className="font-semibold text-xl">{title}</h3>
              </CardHeader>
              <CardContent>
                {content.map((line, i) => (
                  <p key={i} className="text-gray-600">{line}</p>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Google Map */}
        <div className="mt-12 flex justify-center">
          <iframe
            title="Google Map"
            className="w-full max-w-3xl h-64 rounded-lg shadow-lg"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3930.024499593657!2d79.84975771511857!3d6.929744695003759!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae2597b55555555%3A0x111f9e8af5d5d5d!2sPolice%20Headquarters!5e0!3m2!1sen!2slk!4v1660731234567!5m2!1sen!2slk"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Contact;
