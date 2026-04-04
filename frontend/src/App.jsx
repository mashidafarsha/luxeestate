import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AgentDashboard from './pages/AgentDashboard';
import MyProperties from './pages/MyProperties';
import AgentMessages from './pages/AgentMessages';
import Favorites from './pages/Favorites';
import { AuthProvider } from './context/AuthContext';
import { ChatProvider } from './context/ChatContext';
import { CurrencyProvider } from './context/CurrencyContext';
import AgentRoute from './components/AgentRoute';
import AgentLayout from './components/AgentLayout';

function App() {
  return (
    <AuthProvider>
      <CurrencyProvider>
        <ChatProvider>
          <Router>
          <div className="min-h-screen bg-slate-dark text-ghost-white font-sans">
            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/favorites" element={<Favorites />} />
              
              {/* Agent Modular Workspace */}
              <Route element={<AgentRoute><AgentLayout /></AgentRoute>}>
                <Route path="/agent/dashboard" element={<AgentDashboard />} />
                <Route path="/agent/properties" element={<MyProperties />} />
                <Route path="/agent/messages" element={<AgentMessages />} />
              </Route>
            </Routes>
          </div>
        </Router>
      </ChatProvider>
      </CurrencyProvider>
    </AuthProvider>
  );
}

export default App;
