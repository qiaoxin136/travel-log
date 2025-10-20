import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import '@aws-amplify/ui-react/styles.css';
import outputs from "../amplify_outputs.json";
import { Amplify } from 'aws-amplify';

Amplify.configure(outputs);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
