import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AgentRoute = ({ children }) => {
  const { userInfo } = useAuth();

  if (!userInfo) {
    return <Navigate to="/login" replace />;
  }

  if (userInfo.role !== 'agent') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default AgentRoute;
