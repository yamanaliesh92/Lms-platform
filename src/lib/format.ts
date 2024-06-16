import React from "react";

export default function formatPrice(price: number) {
  return new Intl.NumberFormat("en-Us", {
    style: "currency",
    currency: "USD",
  }).format(price);
}
