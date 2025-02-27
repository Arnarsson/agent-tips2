"use client";

import { useEffect } from "react";
import { checkPortMismatch } from "./network-error-handler";

interface ClientPortCheckProps {
  expectedPort?: number;
}

export function ClientPortCheck({ expectedPort = 3000 }: ClientPortCheckProps) {
  useEffect(() => {
    // Check for port mismatch with the expected port
    checkPortMismatch(expectedPort);
  }, [expectedPort]);
  
  // This component doesn't render anything
  return null;
} 