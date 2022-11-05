import Welcome from 'pages/Welcome';
import Cadastro from 'pages/Welcome/cadastro';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from 'pages/Welcome/login';
import { Test } from 'components/Test';
import Profile from 'pages/profile';
import DefaultPage from 'components/DefaultPage';
import { useState } from 'react';


export default function AppRouter() {
  
  const [selectedMenu, setSelectedMenu] = useState<number>(1)

  return (
    
    <main className="container">
      <Router>
        
        <Routes>

          <Route path='/' element={<DefaultPage selectedMenu={selectedMenu}/>}>
            <Route path='home' />
            <Route path='profile' element={<Profile selectedMenu={selectedMenu} setSelectedMenu={setSelectedMenu}/>} />
            <Route path='teste' element={<Test/>} />
          </Route>

          <Route path='/login' element={<Welcome children={<Login/>}/>} />
          <Route path='/register' element={<Welcome children={<Cadastro />}/>} />
          
        </Routes>   

      </Router>
    </main>

  );
}

/*
<Route path="/private" element={<RequireAuth><PaginaPrivada /></RequireAuth>} />
<Route path='/private' element={<RequireAuth> <PaginaPrivada /></RequireAuth>} />

loucura kkkk
isso aqui são coisas diferentes, não faz sentido kkkk
*/