import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const Contact = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (data) => {
    setSubmitting(true);
    // In a real application, you would send this to a backend API
    // For now, we'll just show a success message
    setTimeout(() => {
      toast.success('Thank you for your message! We will get back to you soon.');
      reset();
      setSubmitting(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold mb-4 text-center">Get in Touch</h1>
          <p className="text-gray-600 text-center mb-8">
            Have questions or feedback? We'd love to hear from you!
          </p>

          <div className="bg-white rounded-lg shadow-md p-8">
            <form onSubmit={handleSubmit(onSubmit)}>
              <Input
                label="Name"
                {...register('name', { required: 'Name is required' })}
                error={errors.name?.message}
                placeholder="Your name"
              />

              <Input
                label="Email"
                type="email"
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                error={errors.email?.message}
                placeholder="your.email@example.com"
              />

              <Input
                label="Subject"
                {...register('subject', { required: 'Subject is required' })}
                error={errors.subject?.message}
                placeholder="What is this regarding?"
              />

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                  <span className="text-danger ml-1">*</span>
                </label>
                <textarea
                  {...register('message', { required: 'Message is required' })}
                  rows={6}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.message ? 'border-danger' : 'border-gray-300'
                  }`}
                  placeholder="Your message..."
                />
                {errors.message && (
                  <p className="mt-1 text-sm text-danger">{errors.message.message}</p>
                )}
              </div>

              <Button 
                type="submit" 
                variant="primary" 
                disabled={submitting}
                className="w-full"
              >
                {submitting ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </div>

          <div className="mt-8 text-center">
            <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
            <p className="text-gray-600 mb-2">
              <strong>Email:</strong> support@expensetracker.com
            </p>
            <p className="text-gray-600">
              <strong>Response Time:</strong> We typically respond within 24-48 hours
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;

