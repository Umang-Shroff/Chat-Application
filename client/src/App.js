import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SideBar from './components/sidebar/SideBar';
import ChatList from './components/chatList/ChatList';
import Dashboard from './components/dashboard/Dashboard';
import LoginPage from './pages/login/LoginPage';

const ProtectedRoute = ({ children, auth = false }) => {
  const isLoggedIn = localStorage.getItem('user:token') !== null || true;

  if(!isLoggedIn && auth){
    return <Navigate to={'/register'} />
  }else if(isLoggedIn && ['/register','/login'].includes(window.location.pathname)){
    return <Navigate to={'/'} />
  }

  return children
}

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={
            <ProtectedRoute auth={true}>
              <Dashboard/>
            </ProtectedRoute>
          }/>
          <Route path='/login' element={
            <ProtectedRoute>
              <LoginPage/>
            </ProtectedRoute>
          }/>
          <Route path='/register' element={
            <ProtectedRoute>
              <RegisterPage/>
            </ProtectedRoute>
          }/>
          <Route path='/chat' element={<SideBar/>}/>
          {/* <Route path='/list' element={}/> */}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
