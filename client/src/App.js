import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './page/HomePage';
import ProductListPage from './page/ProductListPage';
import ProductDetailsPage from './page/ProductDetailsPage';
import CartPage from './page/CartPage';
import RegisterPage from './page/RegisterPage';
import LoginPage from './page/LoginPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/product-list' element={<ProductListPage/>} />
        <Route path='/product-details' element={<ProductDetailsPage/>} />
        <Route path='/cart' element={<CartPage/>} />
        <Route path='/register' element={<RegisterPage/>} />
        <Route path='/login' element={<LoginPage/>} />
        {/* Login User  */}
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
