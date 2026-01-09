import { FiDollarSign, FiTrendingUp, FiFilter, FiShield, FiCode } from 'react-icons/fi';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { EXPENSE_CATEGORIES, INCOME_SOURCES } from '../utils/constants';

const About = () => {
  const expenseCategories = Object.values(EXPENSE_CATEGORIES);
  const incomeSources = Object.values(INCOME_SOURCES);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">About Expense Tracker</h1>
          
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Mission Statement</h2>
            <p className="text-gray-700 leading-relaxed">
              Expense Tracker is designed to help individuals take control of their financial lives. 
              Our mission is to provide a simple, secure, and powerful tool for tracking expenses and income, 
              enabling users to make informed financial decisions and achieve their financial goals.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Key Features</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <FiDollarSign className="text-3xl text-primary mt-1" />
                <div>
                  <h3 className="text-xl font-semibold mb-2">Expense Tracking</h3>
                  <p className="text-gray-700 mb-2">
                    Track your expenses across multiple categories:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    {expenseCategories.map((cat) => (
                      <li key={cat}>{cat.replace('_', ' ')}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <FiTrendingUp className="text-3xl text-primary mt-1" />
                <div>
                  <h3 className="text-xl font-semibold mb-2">Income Tracking</h3>
                  <p className="text-gray-700 mb-2">
                    Monitor your income from various sources:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    {incomeSources.map((source) => (
                      <li key={source}>{source.replace('_', ' ')}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <FiTrendingUp className="text-3xl text-primary mt-1" />
                <div>
                  <h3 className="text-xl font-semibold mb-2">Dashboard with P&L Calculations</h3>
                  <p className="text-gray-700">
                    Get comprehensive profit and loss reports with visual charts and analytics 
                    to understand your financial health at a glance.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <FiFilter className="text-3xl text-primary mt-1" />
                <div>
                  <h3 className="text-xl font-semibold mb-2">Filtering and Sorting</h3>
                  <p className="text-gray-700">
                    Filter expenses and income by category, date range, and amount. 
                    Sort by various criteria to find exactly what you're looking for.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <FiShield className="text-3xl text-primary mt-1" />
                <div>
                  <h3 className="text-xl font-semibold mb-2">OAuth2 Authentication</h3>
                  <p className="text-gray-700">
                    Secure authentication with support for Google and GitHub OAuth2, 
                    in addition to traditional username/password login.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Technology Stack</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <FiCode className="text-3xl text-primary mt-1" />
                <div>
                  <h3 className="text-xl font-semibold mb-2">Backend</h3>
                  <p className="text-gray-700">
                    Built with Spring Boot, providing a robust RESTful API with JWT authentication 
                    and OAuth2 integration.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <FiCode className="text-3xl text-primary mt-1" />
                <div>
                  <h3 className="text-xl font-semibold mb-2">Frontend</h3>
                  <p className="text-gray-700">
                    Modern React application with Vite, Tailwind CSS, and React Router 
                    for a responsive and intuitive user experience.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <FiShield className="text-3xl text-primary mt-1" />
                <div>
                  <h3 className="text-xl font-semibold mb-2">Security</h3>
                  <p className="text-gray-700">
                    JWT-based authentication with secure token storage and OAuth2 support 
                    for seamless third-party authentication.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;

