import './App.css';
import WebFont from 'webfontloader';
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route  } from 'react-router-dom';
import Header from "./component/layout/Header/Header.jsx"; 
import Footer from './component/layout/Footer/Footer.jsx';
import Home from './component/layout/Home/Home.jsx';
import ProductDetails from './component/Product/ProductDetails.jsx'
import Products from './component/Product/Products.jsx'
import Search from './component/Product/Search.jsx'
import LoginSignUp from './component/User/LoginSignUp.jsx';
import store from './store';
import { loadUser } from './actions/userAction';
import UserOptions from './component/layout/Header/UserOptions';
import { useSelector } from 'react-redux';
import Profile from './component/User/Profile';
import ProtectedRoute from './component/Route/ProtectedRoute';
import UpdateProfile from './component/User/UpdateProfile.jsx'
import  UpdatePassword  from './component/User/UpdatePassword.jsx';
import  ForgotPassword  from './component/User/ForgotPassword.jsx';
import ResetPassword from './component/User/ResetPassword.jsx'
import Cart from './component/Cart/Cart.jsx'
import Shipping from './component/Cart/Shipping.jsx'
import ConfirmOrder from "./component/Cart/ConfirmOrder.jsx"
import axios from "axios"
import Payment from "./component/Cart/Payment.jsx"
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import OrderSuccess from './component/Cart/OrderSuccess.jsx'
import MyOrders from './component/Order/MyOrder.jsx'
import OrderDetails from './component/Order/OrderDetails.jsx'
import Dashboard from './component/admin/Dashboard.jsx'
import ProductList from './component/admin/ProductList.jsx'
import NewProduct from './component/admin/NewProduct.jsx';
import UpdateProduct from './component/admin/UpdateProduct.jsx'
import OrderList from './component/admin/OrdeList.jsx';
import ProcessOrder from './component/admin/ProcessOrder.jsx';
import UsersList from './component/admin/UsersList.jsx'
import UpdateUser from './component/admin/UpdateUser.jsx'
import ProductReviews from './component/admin/ProductReviews.jsx'
import About from './component/layout/About/About.jsx';
import Contact from './component/layout/Contact/Contact.jsx';


function App() {
  const { isAuthenticated, user } = useSelector((state) => state.user);

  const [stripeApikey, setStripeApikey] = useState("")

  async function getStripeApiKey() {
    const {data} = await axios.get("/api/v1/stripeapikey");
    console.log(data)
    const use = data.stripeApiKey
    console.log(use)
    setStripeApikey(data.stripeApiKey);
    console.log(stripeApikey)
  }

  React.useEffect(() => {
    WebFont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"]
      }
    });
    store.dispatch(loadUser());
    getStripeApiKey();
  }, []);

  return (
    <Router>
      <Header />
      {isAuthenticated && <UserOptions user={user} />}
      <Routes>
        <Route path="/about" element={<About/>}/>
        <Route path="/contact" element={<Contact/>}/>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:keyword" element={<Products />} />
        <Route path="/search" element={<Search />} />
        {/* <Route path="/account" element={
          <ProtectedRoute isAdmin={false}>
            <Profile />
          </ProtectedRoute>
        } /> */}
        <Route  path="/account" element={<Profile />}/>

           {/* <Route path="/me/update" element={
          <ProtectedRoute isAdmin={false}>
            <UpdateProfile />
          </ProtectedRoute>
        } /> */}

<Route  path="/me/update" element={<UpdateProfile />}/>



        {/* <Route path="/password/update" element={<ProtectedRoute isAdmin={false}>
          <UpdatePassword/>
          </ProtectedRoute>}/> */}
          <Route  path="/password/update" element={<UpdatePassword />}/>

          <Route  path="/password/forgot" element={<ForgotPassword />}/>

          <Route  path="/password/reset/:token" element={<ResetPassword />}/>

        <Route path="/login" element={<LoginSignUp />} />

        <Route path="/cart" element={<Cart />} />

         <Route path='/login/shipping' element={<Shipping/>}/>

         

         <Route
          path="/process/payment"
          element={
            <Elements stripe={loadStripe(stripeApikey)}>
              <Payment />
            </Elements>
          }
        />


        <Route path='/success' element={<OrderSuccess/>}/>

        <Route path='/orders' element={<MyOrders/>}/>

        {/* <Routes> */}
        <Route path='/orders/:id' element={<OrderDetails />} />
        <Route path='/order/confirm' element={<ConfirmOrder />} />
      {/* </Routes> */}

      <Route path='/admin/dashboard' element={<Dashboard/>}/>

      <Route path='/admin/products' element={<ProductList/>}/>

      <Route path='/admin/product' element={<NewProduct/>}/>

      <Route path='/admin/product/:id' element={<UpdateProduct/>}/>


      <Route path='/admin/orders' element={<OrderList/>}/>

      <Route path='/admin/order/:id' element={<ProcessOrder/>}/>

      <Route path="/admin/users" element={<UsersList/>}/>

      <Route path="/admin/user/:id" element={<UpdateUser/>}/>

      <Route path='/admin/reviews' element={<ProductReviews/>}></Route>
      

      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
