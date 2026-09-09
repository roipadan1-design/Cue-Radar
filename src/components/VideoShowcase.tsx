import React from 'react';
import { ExternalLink, Play, Video } from 'lucide-react';

export const VideoShowcase: React.FC<{ url?: string }> = ({ url }) => (
  <section className="showreel-card" aria-label="Artist showreel">
    <div className="showreel-label"><Video /> <span>SHOWREEL / 2026</span></div>
    <div className="showreel-frame">
      <div className="showreel-play"><Play fill="currentColor" /></div>
      <div className="showreel-caption"><strong>Selected works & performances</strong><span>4K · 04:30</span></div>
    </div>
    {url && <a className="showreel-link" href={url} target="_blank" rel="noreferrer">Open showreel <ExternalLink /></a>}
  </section>
);
