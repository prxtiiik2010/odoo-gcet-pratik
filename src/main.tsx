import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from "./App.tsx";
import "./index.css";
import { DEMO_GOOGLE_CLIENT_ID } from './lib/google-auth';

createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId={DEMO_GOOGLE_CLIENT_ID}>
    <App />
  </GoogleOAuthProvider>
);
