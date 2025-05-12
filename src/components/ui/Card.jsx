import React from "react";

export function Card({ children }) {
  return <div className="border rounded p-4 mb-2 shadow">{children}</div>;
}

export function CardContent({ children }) {
  return <div>{children}</div>;
}
