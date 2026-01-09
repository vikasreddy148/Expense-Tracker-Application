import { Link } from 'react-router-dom';
import { FiDollarSign, FiTrendingUp, FiShield, FiSmartphone } from 'react-icons/fi';
import Button from '../components/common/Button';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const Landing = () => {
  const features = [
    {
      icon: FiDollarSign,
      title: 'Track Expenses & Income',
      description: 'Easily record and categorize your expenses and income sources.',
    },
    {
      icon: FiTrendingUp,
      title: 'Dashboard Analytics',
      description: 'View comprehensive P&L reports and financial insights.',
    },
    {
      icon: FiShield,
      title: 'Secure Authentication',
      description: 'Login with traditional credentials or OAuth2 (Google, GitHub).',
    },
    {
      icon: FiSmartphone,
      title: 'Responsive Design',
      description: 'Access your finances from any device, anywhere.',
    },
  ];

  const steps = [
    {
      number: '1',
      title: 'Sign Up / Login',
      description: 'Create an account or login with your existing credentials or OAuth2.',
    },
    {
      number: '2',
      title: 'Add Expenses & Income',
      description: 'Start tracking your financial transactions with ease.',
    },
    {
      number: '3',
      title: 'View Dashboard & Analytics',
      description: 'Monitor your financial health with detailed reports and charts.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Take Control of Your Finances</h1>
          <p className="text-xl mb-8 text-gray-100">
            Track expenses, monitor income, and gain insights into your financial health
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/signup">
              <Button variant="secondary" className="text-lg px-8 py-3">
                Get Started
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="outline" className="text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-primary">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
                  <Icon className="text-5xl text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-gray-100">
            Join thousands of users managing their finances effectively
          </p>
          <Link to="/signup">
            <Button variant="secondary" className="text-lg px-8 py-3">
              Sign Up Now
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;

