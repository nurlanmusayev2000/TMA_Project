import './App.css';
import {BrowserRouter,  Routes,Route} from "react-router-dom";
import Main from './components/cor_main';
import Filter from './components/cor_filter';
import { Login } from './components/login';
import { EmployeeMain } from './components/em_main';
import { RequstsLists } from './components/cor_requests';
import { RequestRows } from './components/cor_requestRows';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={ <Login /> }></Route>
          <Route path='/coordinator/requestlist' element={ <RequstsLists/> }/>
          <Route path='/coordinator/requestrows/:requestrowid' element={ <RequestRows/> }/>
          <Route path='/logged' element={<Main/>}/>
          <Route path='/filter' element={ <Filter /> }/>
          <Route path='/employee/logged'  element={<EmployeeMain/>} />
          <Route path='/coordinator/requestrows' element={<EmployeeMain/>} />
        </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;
