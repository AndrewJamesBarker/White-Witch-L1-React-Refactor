import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth(); // Access user data from context

  return (
    <div>
      <h1>Welcome, {user ? user.username : 'Guest'}!</h1>
      {/* Other dashboard content */}
    </div>
  );
};

export default Dashboard;
