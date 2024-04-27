//@ts-nocheck
// Components
import NewSidebar from '../NewSidebar/NewSidebar';
import Sidebar from '../NewSidebar/SidebarWithoutLogin' 
//User context import
import { useAuth } from '../../contexts/UserContext';
// Store


const Header = () => {
   const { currentUser } = useAuth();
   console.log(currentUser)
   return (
      <>
         {(currentUser && currentUser.userID) && <NewSidebar style={{ position: 'relative' }} />}
         {!(currentUser && currentUser.userID) && <Sidebar />}
      </>
   )
};

export default Header;