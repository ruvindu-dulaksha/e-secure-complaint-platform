import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from ".././components/ui/accordion";
import { Card, CardHeader, CardContent } from "../components/ui/card";

const FAQs = () => {
  const faqs = [
    {
      question: "What is the E-Complaint Portal?",
      answer: "The E-Complaint Portal is a digital platform that allows citizens to file and track complaints online. It provides a secure and efficient way to communicate with law enforcement authorities.",
    },
    {
      question: "How do I file a complaint?",
      answer: "To file a complaint, you need to create an account or log in if you already have one. Then, click on the 'New Complaint' button and fill out the complaint form with all relevant details.",
    },
    {
      question: "What information do I need to provide when filing a complaint?",
      answer: "You'll need to provide your personal details, a description of the incident, the location where it occurred, and any supporting evidence such as photos or documents.",
    },
    {
      question: "How can I track my complaint?",
      answer: "Once logged in, you can view all your complaints in the dashboard. Each complaint will show its current status and any updates from the authorities.",
    },
    {
      question: "Is my information secure?",
      answer: "Yes, we take security seriously. All data is encrypted, and we follow strict privacy policies. Only authorized personnel can access your information.",
    },
    {
      question: "How long does it take to process a complaint?",
      answer: "Processing times vary depending on the nature and complexity of the complaint. You will receive updates on your dashboard as your complaint progresses.",
    },
    {
      question: "Can I update my complaint after submission?",
      answer: "Yes, you can update your complaint with additional information as long as it's still in 'pending' status. Once it's under investigation, you'll need to contact the assigned officer.",
    },
    {
      question: "What should I do if I forgot my password?",
      answer: "Click on the 'Forgot Password' link on the login page. You'll receive instructions to reset your password via email.",
    },
  ];

  return (
    <div className="min-h-screen bg-police-light py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <h1 className="text-3xl font-bold text-police-navy">Frequently Asked Questions</h1>
            <p className="text-gray-600 mt-2">
              Find answers to common questions about the E-Complaint Portal
            </p>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FAQs;