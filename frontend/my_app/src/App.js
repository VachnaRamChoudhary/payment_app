import "./App.css";
import Home from "./components/home";
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";
import Update from "./components/Update";
import Payment from "./components/Payment";
import PaymentDone from "./components/PaymentDone";
import { Routes, Route, BrowserRouter } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route exact path="/signin" element={<SignIn />} />
        <Route exact path="/update" element={<Update />} />
        <Route exact path="/payment" element={<Payment />} />
        <Route exact path="/paymentdone" element={<PaymentDone />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
