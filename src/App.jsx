
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css'
import Layout from './Layout';
import Login from './components/Login';
import { Provider } from 'react-redux';
import { store } from './utils/appStore';
import Home from './components/Home';
import EditProfile from './components/EditProfile';

function App() {

  return (
    <>
    <Provider store={store}>
      <BrowserRouter>
      <Routes>

        {/* Layout wrapper */}
        <Route path="/" element={<Layout />}>

          {/* Nested pages rendered inside <Outlet/> */}
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="editProfile" element={<EditProfile />} />
          {/* <Route path="profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} /> */}

        </Route>

      </Routes>
    </BrowserRouter>
    </Provider>
    </>
  );
}

export default App
