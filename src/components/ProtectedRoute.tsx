import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import { refreshAccessToken } from '../api';
import { useAuthStore } from '../store/authStore';
import { Loader } from 'lucide-react';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { accessToken, setAccessToken } = useAuthStore();
  const [loading, setLoading] = useState(true);
  // const navigate = useNavigate();




  useEffect(() => {
    const check = async () => {
      setLoading(true);
        if (!accessToken) {
          refreshAccessToken().then((r) => {
            setAccessToken(r.accessToken);
          }).catch(() => {
            setLoading(false);
          }).finally(() => {
            setLoading(false);
          })
          // if (token) {
              // setLoading(false);
          //   setAccessToken(token);
          // } else {
              // setLoading(false);
  
          //   return navigate('/connect');
          // }
        }
  
      //   setLoading(false);
    };

      check();
  }, [accessToken, setAccessToken]);

  // if (loading) return <Loader />;

  return <>{children}</>;
};

export default ProtectedRoute;