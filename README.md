# Expense Tracker Application

A full-stack web application for tracking personal expenses and income, built with React and Spring Boot. This application helps users manage their finances by providing an intuitive interface to record, view, and analyze their financial transactions.

## 🚀 Features

### Authentication & Security
- **Traditional Authentication**: Email/username and password-based registration and login
- **OAuth2 Integration**: Sign in with Google or GitHub
- **JWT Token-based Authentication**: Secure API access with JSON Web Tokens
- **Role-based Access Control**: User roles and permissions
- **Protected Routes**: Frontend route protection for authenticated users

### Expense Management
- Add, edit, and delete expenses
- Categorize expenses (Personal, Survival/Livelihood, Investment)
- Filter expenses by:
  - Category
  - Date range
  - Amount range
- Sort expenses by category or amount
- Color-coded category badges for easy identification

### Income Management
- Add, edit, and delete income entries
- Categorize income sources (Salary, From Investment, From Trading)
- Filter income by:
  - Source
  - Date range
  - Amount range
- Sort income by source or amount
- Visual source indicators

### Dashboard & Analytics
- **Profit & Loss (P&L) Overview**: Real-time calculation of total income, expenses, and net profit/loss
- **Date Range Analysis**: View P&L for specific time periods
- **Recent Transactions**: Quick view of latest expenses and income
- **Visual Indicators**: Color-coded financial status (positive/negative)

### User Interface
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- **Modern UI**: Built with Tailwind CSS for a clean, modern look
- **Toast Notifications**: User-friendly feedback for all actions
- **Loading States**: Smooth loading indicators
- **Error Handling**: Comprehensive error messages and handling

## 🛠️ Tech Stack

### Backend
- **Framework**: Spring Boot 4.0.1
- **Language**: Java 17
- **Security**: Spring Security with JWT
- **OAuth2**: Spring OAuth2 Client (Google & GitHub)
- **Database**: MySQL 
- **ORM**: Spring Data JPA / Hibernate
- **Build Tool**: Maven
- **Validation**: Jakarta Validation
- **Utilities**: Lombok

### Frontend
- **Framework**: React 18.2.0
- **Build Tool**: Vite 5.0.8
- **Routing**: React Router DOM 6.20.0
- **HTTP Client**: Axios 1.6.2
- **Styling**: Tailwind CSS 3.3.6
- **Charts**: Recharts 2.10.3
- **Icons**: React Icons 4.12.0
- **Forms**: React Hook Form 7.48.2
- **Date Handling**: date-fns 2.30.0
- **Notifications**: React Toastify 9.1.3

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Java Development Kit (JDK)**: Version 17 or higher
- **Maven**: Version 3.6+ (or use the included Maven Wrapper)
- **Node.js**: Version 18 or higher
- **npm**: Comes with Node.js
- **MySQL**: Version 8.0+ (or PostgreSQL for production)
- **Git**: For version control

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Expense-Tracker-Application
```

### 2. Backend Setup

#### Navigate to Backend Directory
```bash
cd Expense-Tracker-Backend/ExpenseTracker
```

#### Configure Database

1. Create a MySQL database:
```sql
CREATE DATABASE expensetracker;
```

2. Update `src/main/resources/application.properties` with your database credentials:
```properties
spring.datasource.username=your_username
spring.datasource.password=your_password
```

#### Configure OAuth2 (Optional but Recommended)

Update OAuth2 credentials in `application.properties`:

**Google OAuth2:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:8080/login/oauth2/code/google`
6. Update `application.properties`:
```properties
spring.security.oauth2.client.registration.google.client-id=your_google_client_id
spring.security.oauth2.client.registration.google.client-secret=your_google_client_secret
```

**GitHub OAuth2:**
1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Create a new OAuth App
3. Set Authorization callback URL: `http://localhost:8080/login/oauth2/code/github`
4. Update `application.properties`:
```properties
spring.security.oauth2.client.registration.github.client-id=your_github_client_id
spring.security.oauth2.client.registration.github.client-secret=your_github_client_secret
```

#### Configure JWT Secret

Generate a secure JWT secret and update in `application.properties`:
```properties
jwt.secret=your_secure_random_secret_key_here
jwt.expiration=86400000  # 24 hours in milliseconds
```

#### Build and Run Backend

Using Maven Wrapper (recommended):
```bash
# Windows
./mvnw.cmd clean install

# Linux/Mac
./mvnw clean install

# Run the application
./mvnw spring-boot:run
```

Or using Maven directly:
```bash
mvn clean install
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### 3. Frontend Setup

#### Navigate to Frontend Directory
```bash
cd ../../Expense-Tracker-Frontend
```

#### Install Dependencies
```bash
npm install
```

#### Configure Environment Variables

Create a `.env` file in the frontend root directory (if not exists):
```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_OAUTH2_REDIRECT_URI=http://localhost:5173/auth/callback
```

#### Run Development Server
```bash
npm run dev
```

The frontend will start on `http://localhost:5173`

## 🏃 Running the Application

### Development Mode

1. **Start Backend** (Terminal 1):
```bash
cd Expense-Tracker-Backend/ExpenseTracker
./mvnw spring-boot:run
```

2. **Start Frontend** (Terminal 2):
```bash
cd Expense-Tracker-Frontend
npm run dev
```

3. **Access Application**:
   - Open your browser and navigate to `http://localhost:5173`
   - The backend API is available at `http://localhost:8080/api`

### Production Build

#### Backend
```bash
cd Expense-Tracker-Backend/ExpenseTracker
./mvnw clean package
java -jar target/ExpenseTracker-0.0.1-SNAPSHOT.jar
```

#### Frontend
```bash
cd Expense-Tracker-Frontend
npm run build
# Serve the dist folder using a web server (nginx, Apache, etc.)
```

## 📁 Project Structure

### Backend Structure
```
Expense-Tracker-Backend/ExpenseTracker/
├── src/
│   ├── main/
│   │   ├── java/com/expensetracker/expensetracker/
│   │   │   ├── config/              # Security & CORS configuration
│   │   │   ├── controller/          # REST API controllers
│   │   │   ├── dto/                 # Data Transfer Objects
│   │   │   │   ├── request/        # Request DTOs
│   │   │   │   └── response/       # Response DTOs
│   │   │   ├── entity/             # JPA entities (User, Expense, Income)
│   │   │   ├── enums/              # Enumerations (Category, Source, Role)
│   │   │   ├── exception/          # Custom exceptions & handlers
│   │   │   ├── repository/         # JPA repositories
│   │   │   └── service/            # Business logic services
│   │   └── resources/
│   │       └── application.properties
│   └── test/                       # Test files
└── pom.xml
```

### Frontend Structure
```
Expense-Tracker-Frontend/
├── src/
│   ├── components/
│   │   ├── common/          # Reusable UI components
│   │   └── layout/          # Layout components
│   ├── pages/               # Page components
│   ├── services/            # API service layer
│   ├── context/             # React Context (AuthContext)
│   ├── hooks/               # Custom React hooks
│   ├── utils/               # Utility functions
│   ├── App.jsx              # Main app component
│   └── main.jsx             # Entry point
├── public/
└── package.json
```

## 🔌 API Endpoints

### Authentication Endpoints
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user information
- `POST /api/auth/logout` - Logout user
- `GET /oauth2/authorization/{provider}` - Initiate OAuth2 login (google/github)

### Expense Endpoints
- `GET /api/expenses` - Get all expenses for current user
- `GET /api/expenses/{id}` - Get expense by ID
- `POST /api/expenses` - Create a new expense
- `PUT /api/expenses/{id}` - Update an expense
- `DELETE /api/expenses/{id}` - Delete an expense
- `GET /api/expenses/filter` - Filter expenses (category, date range, amount)
- `GET /api/expenses/sort` - Sort expenses (by category or amount)

### Income Endpoints
- `GET /api/incomes` - Get all incomes for current user
- `GET /api/incomes/{id}` - Get income by ID
- `POST /api/incomes` - Create a new income entry
- `PUT /api/incomes/{id}` - Update an income entry
- `DELETE /api/incomes/{id}` - Delete an income entry
- `GET /api/incomes/filter` - Filter incomes (source, date range, amount)
- `GET /api/incomes/sort` - Sort incomes (by source or amount)

### Dashboard Endpoints
- `GET /api/dashboard/pnl` - Get total Profit & Loss
- `GET /api/dashboard/pnl/range?startDate={date}&endDate={date}` - Get P&L for date range

## 🔐 Authentication

### Traditional Authentication
1. Register a new account at `/signup`
2. Login with credentials at `/login`
3. JWT token is stored in localStorage
4. Token is automatically included in API requests

### OAuth2 Authentication
1. Click "Login with Google" or "Login with GitHub"
2. Redirected to provider's authentication page
3. After successful authentication, redirected back to application
4. JWT token is automatically stored and user is logged in

### Token Management
- Tokens are stored in browser's localStorage
- Tokens expire after 24 hours (configurable)
- Automatic token refresh on API calls
- Protected routes redirect to login if token is invalid

## 🗄️ Database Schema

### Users Table
- `id` (Primary Key)
- `username` (Unique)
- `email` (Unique)
- `password` (Nullable for OAuth2 users)
- `provider` (LOCAL, GOOGLE, GITHUB)
- `provider_id` (OAuth2 provider user ID)
- `enabled` (Boolean)
- `created_at`, `updated_at` (Timestamps)

### Expenses Table
- `id` (Primary Key)
- `user_id` (Foreign Key to Users)
- `description` (Text)
- `category` (Enum: PERSONAL, SURVIVAL_LIVELIHOOD, INVESTMENT)
- `amount` (Decimal)
- `date_of_expense` (Date)
- `created_at`, `updated_at` (Timestamps)

### Incomes Table
- `id` (Primary Key)
- `user_id` (Foreign Key to Users)
- `description` (Text)
- `source` (Enum: SALARY, FROM_INVESTMENT, FROM_TRADING)
- `amount` (Decimal)
- `date_of_income` (Date)
- `created_at`, `updated_at` (Timestamps)

## 🧪 Testing

### Backend Tests
```bash
cd Expense-Tracker-Backend/ExpenseTracker
./mvnw test
```

### Frontend Tests
```bash
cd Expense-Tracker-Frontend
npm test
```

## 🐛 Troubleshooting

### Common Issues

**CORS Errors:**
- Ensure backend CORS configuration allows `http://localhost:5173`
- Check `CorsFilter.java` and `SecurityConfig.java`

**Database Connection Issues:**
- Verify MySQL is running
- Check database credentials in `application.properties`
- Ensure database exists: `CREATE DATABASE expensetracker;`

**OAuth2 Not Working:**
- Verify OAuth2 credentials are correct in `application.properties`
- Check redirect URIs match in provider settings
- Ensure callback route `/auth/callback` is accessible

**Port Already in Use:**
- Backend: Change `server.port` in `application.properties`
- Frontend: Change port in `vite.config.js` or use `npm run dev -- --port 3000`

**JWT Token Issues:**
- Verify JWT secret is set in `application.properties`
- Check token expiration settings
- Clear browser localStorage and login again

## 📝 Environment Variables

### Backend (`application.properties`)
- Database configuration
- JWT secret and expiration
- OAuth2 client IDs and secrets
- Server port

### Frontend (`.env`)
- `VITE_API_BASE_URL` - Backend API base URL
- `VITE_OAUTH2_REDIRECT_URI` - OAuth2 callback URL

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Vikas Reddy**

## 🙏 Acknowledgments

- Spring Boot team for the excellent framework
- React team for the amazing library
- All open-source contributors whose packages made this project possible

## 📞 Support

For support, email [kathulavikasr@example.com] or open an issue in the repository.

---

**Happy Expense Tracking! 💰**

