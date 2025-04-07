// pages/InvalidPage.tsx
import { Link } from 'react-router-dom';

const InvalidPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-lg mb-4">The page you're looking for doesn't exist.</p>
      <Link 
        to="/" 
        className="text-blue-600 hover:underline"
      >
        Go to Home Page
      </Link>
    </div>
  );
};

export default InvalidPage;