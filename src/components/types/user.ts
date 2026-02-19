import type { ReactNode } from "react";

export interface SurveillanceImage {
  id: string;
  url: string;
  timestamp: string;
  location: string;
  cameraId: string;
}

export interface User {
  location: ReactNode;
  id: string;
  name: string;
  role: string;
  profileImage: string;
  captureCount: number;
  lastSeenTime?: string;

  // STEP-2 additions
  status?: string;
  lastSeenSnapshot?: string;
}

