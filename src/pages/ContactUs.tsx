import { useState } from 'react';
import { db } from '../services/auth';
import { Button } from '.././components/ui/button';
import { Input } from '.././components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { useToast } from '../hooks/use-toast';
import { Alert, AlertDescription } from '.././components/ui/alert';
import { Card, CardHeader, CardContent, CardFooter } from '../components/ui/card';

const ContactUs = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !message) {
      setError('All fields are required');
      return;
    }

    setLoading(true);
    try {
      await db.createContactMessage({ name, email, message });
      toast({
        title: 'Message sent',
        description: 'Thank you for contacting us!',
      });
      setName('');
      setEmail('');
      setMessage('');
    } catch (err: any) {
      
      setError('Failed to send message');
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to send message. Please try again later.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-police-light px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-police-navy">Contact Us</h1>
          <p className="text-sm text-gray-600">We'd love to hear from you!</p>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="auth-input"
            />
            <Input
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="auth-input"
            />
            <Textarea
              placeholder="Your Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              className="auth-input"
            />
            <Button 
              type="submit" 
              className="w-full bg-police-navy hover:bg-police-navy/90"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Message'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">We will get back to you as soon as possible.</p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ContactUs;
