import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import { refreshAccessToken } from '../api';
import { useAuthStore } from '../store/authStore';
import { Loader } from 'lucide-react';
import { LoadingScreen } from './LoadingScreen';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { accessToken, setAccessToken } = useAuthStore();
  const [loading, setLoading] = useState(true);
  // const navigate = useNavigate();


  const check = async () => {
    setLoading(true);
      if (!accessToken) {
        refreshAccessToken().then((r) => {
          setAccessToken(r.accessToken);
        }).catch((err) => {

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


  useEffect(() => {
      check();
  }, [accessToken]);

  // if (loading) return <LoadingScreen />;

  return <>{children}</>;
};

export default ProtectedRoute;