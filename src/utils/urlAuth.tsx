// @ts-nocheck 
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuth } from '../contexts/UserContext';
const withAuth = (WrappedComponent, allowedRoles) => {
    // eslint-disable-next-line react/display-name
    return (props) => {
      const router = useRouter();
      const { currentUser } = useAuth()

      console.log(currentUser)
      console.log(allowedRoles)
      const userRole = currentUser?.userRole;
      // if(!currentUser){
        
      //   return null;
      // }
      useEffect(() => {
        if (!allowedRoles.includes(userRole)) {
          router.push('/unauthorized'); 
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);
  
      return <WrappedComponent {...props} />;
    };
  };

export default withAuth;
