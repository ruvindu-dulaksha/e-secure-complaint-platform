import { Shield } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      {/* Header Section */}
      <div className="text-center mb-10">
        <div className="flex items-center justify-center mb-4">
          <Shield className="h-14 w-14 text-police-navy animate-pulse" />
        </div>
        <h1 className="text-4xl font-bold text-police-navy mb-2">Privacy Policy</h1>
        <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
      </div>

      {/* Privacy Sections */}
      <div className="space-y-10 text-gray-700">
        {[
          {
            title: "1. Information We Collect",
            content: [
              "We collect information that you provide directly to us when using the E-Complaint Portal, including:",
              "Personal identification information (Name, NIC number)",
              "Contact information (Email address, phone number)",
              "Complaint details and related evidence",
              "Location information related to incidents",
              "Any additional information you choose to provide"
            ],
          },
          {
            title: "2. How We Use Your Information",
            content: [
              "We use the information we collect to:",
              "Process and investigate your complaints",
              "Communicate with you about your complaints",
              "Improve our services and maintain security",
              "Generate anonymous statistical data",
              "Comply with legal obligations"
            ],
          },
          {
            title: "3. Data Security",
            content: [
              "We implement appropriate security measures to protect your personal information, including:",
              "Encryption of sensitive data in transit and at rest",
              "Secure authentication methods and access controls",
              "Regular security audits and assessments",
              "Employee training on data protection",
              "Incident response procedures"
            ],
          },
          {
            title: "4. Your Rights",
            content: [
              "Under applicable data protection laws, you have the right to:",
              "Access your personal information",
              "Correct inaccurate or incomplete data",
              "Request deletion of your data",
              "Object to processing of your data",
              "Request data portability"
            ],
          }
        ].map((section, index) => (
          <section key={index} className="bg-gray-50 p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
            <h2 className="text-2xl font-semibold text-police-navy mb-4">{section.title}</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              {section.content.map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
          </section>
        ))}

        {/* Contact Section */}
        <section className="bg-gray-100 p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
          <h2 className="text-2xl font-semibold text-police-navy mb-4">5. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy or our data practices, please contact us at:
          </p>
          <div className="mt-4 p-4 bg-white rounded-lg border border-gray-300">
            <p className="font-medium">E-Complaint Portal Data Protection Officer</p>
            <p>Email: <span className="text-police-navy font-medium">privacy@ecomplaint.gov</span></p>
            <p>Phone: <span className="text-police-navy font-medium">+1 (555) 123-4567</span></p>
            <p>Address: Police Headquarters, Data Protection Unit</p>
          </div>
        </section>
      </div>

      {/* Footer */}
      <div className="mt-12 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} E-Complaint Portal. All rights reserved.</p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
