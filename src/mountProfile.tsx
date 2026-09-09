import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import './index.css';
import { UserProfileRadar } from './components/UserProfileRadar';

let profileRoot: Root | null = null;

export function mountReactProfile(containerId = 'view-profile') {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (!profileRoot) {
    profileRoot = createRoot(container);
  }
  profileRoot.render(<UserProfileRadar />);
}
