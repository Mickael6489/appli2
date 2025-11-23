import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // Assuming you have tailwind directives here

// --- Import all individual Apps ---
import EduBrainApp from './apps/EduBrainApp';
import MoneyBrainApp from './apps/MoneyBrainApp';
import BlastBrainApp from './apps/BlastBrainApp';
import MineBrainApp from './apps/MineBrainApp';
// ... import other apps here as needed

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// CONFIGURATION: Change this string to build a specific standalone app.
// Options: 'FULL_SUITE', 'EDU', 'MONEY', 'BLAST', 'MINE'
type BuildTarget = 'FULL_SUITE' | 'EDU' | 'MONEY' | 'BLAST' | 'MINE';
const BUILD_TARGET: BuildTarget = 'FULL_SUITE'; 

const root = ReactDOM.createRoot(rootElement);

// We need a dummy back function since standalone apps won't navigate back to a launcher
const noOp = () => { console.log("Exiting app..."); };

let ComponentToRender;

switch (BUILD_TARGET) {
  case 'EDU':
    ComponentToRender = <EduBrainApp onBack={noOp} />;
    break;
  case 'MONEY':
    ComponentToRender = <MoneyBrainApp onBack={noOp} />;
    break;
  case 'BLAST':
    ComponentToRender = <BlastBrainApp onBack={noOp} />;
    break;
  case 'MINE':
    ComponentToRender = <MineBrainApp onBack={noOp} />;
    break;
  default:
    ComponentToRender = <App />; // The full launcher
    break;
}

root.render(
  <React.StrictMode>
    {/* You might need to wrap individual apps in Theme/User contexts here if they rely on it */}
    <div className={BUILD_TARGET !== 'FULL_SUITE' ? "standalone-mode" : ""}>
      {ComponentToRender}
    </div>
  </React.StrictMode>
);