import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Dashboard = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to main page immediately
    console.log("🔄 Redirecting from /dashboard to /");
    router.replace('/');
  }, [router]);

  // Show loading while redirecting
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      fontSize: '18px'
    }}>
      <div>
        <div>🔄 Redirecting to ICOS Ecosystem...</div>
        <div style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
          If you are not redirected automatically, <a href="/">click here</a>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;