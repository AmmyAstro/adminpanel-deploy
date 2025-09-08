"use client";

import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

export default function ApiDocsPage() {
  return (
    <div className="w-full h-screen bg-white">
      <SwaggerUI url="/api/docs" />
    </div>
  );
}
