import React from "react";
import { Link } from "react-router-dom";

export default function PaymentDone() {
  return (
    <div>
      <h1>Payment Done</h1>
      <Link to="/">Go to Home</Link>
    </div>
  );
}
