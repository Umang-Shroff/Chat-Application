import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SideBar from './components/sidebar/SideBar';
import ChatList from './components/chatList/ChatList';
import Dashboard from './components/dashboard/Dashboard';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* <Route path='/' element={<HomePage/>}/>
          <Route path='/login' element={<LoginPage/>}/>
          <Route path='/register' element={<RegisterPage/>}/> */}
          <Route path='/chat' element={<SideBar/>}/>
          <Route path='/list' element={<Dashboard/>}/>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
