import React from "react";
import { Route, Routes } from "react-router-dom";
import Hoc from "./hoc/hoc";

import Login from "./containers/Login";
import Signup from "./containers/Signup";
import HomepageLayout from "./containers/Home";
import ProductList from "./containers/Products";
import { OrderSummary } from "./containers/OrderSummary";


const BaseRouter = () => (
  
  <Hoc>
    <Routes>
      <Route exact path="/" element={< HomepageLayout />} />
      <Route exact path="/login" element={< Login />} />
      <Route exact path="/signup" element={< Signup />} />
      <Route exact path="/products" element={<ProductList/>}/>
      <Route exact path="/order-summary" element={<OrderSummary/>}/>
      
    </Routes>
  </Hoc>
);

export default BaseRouter;
