import React from 'react';
import { ExternalLink, Globe, Instagram, Music2, Pencil, Video } from 'lucide-react';
import type { UserProfile } from '../types/profile.ts';

type Props = { profile: UserProfile; onEdit: () => void };

const links = [
  { key: 'instagram', label: 'Instagram', Icon: Instagram },
  { key: 'spotify', label: 'Spotify', Icon: Music2 },
  { key: 'vimeo', label: 'Vimeo', Icon: Video },
  { key: 'website', label: 'Website', Icon: Globe },
] as const;

export const ArtistHero: React.FC<Props> = ({ profile, onEdit }) => {
  const initials = profile.full_name.split(' ').map((part) => part[0]).slice(0, 2).join('');
  return (
    <section className="artist-hero" aria-labelledby="artist-name">
      <div className="artist-hero-image" role="img" aria-label={`${profile.full_name} profile image`}>
        <span>{initials || 'AR'}</span>
      </div>
      <div className="artist-hero-content">
        <div className="artist-hero-heading">
          <div>
            <p className="artist-kicker">ARTIST PROFILE</p>
            <h1 id="artist-name">{profile.full_name}</h1>
          </div>
          <button type="button" className="artist-edit-button" onClick={onEdit} aria-label="Edit artist profile"><Pencil /></button>
        </div>
        <div className="artist-meta-row">
          <span className="artist-status"><i /> Available for bookings</span>
          <span>{profile.locations?.join(' · ') || 'International'}</span>
        </div>
        <div className="artist-socials" aria-label="Social links">
          {links.map(({ key, label, Icon }) => profile.social_links?.[key] && (
            <a key={key} href={profile.social_links[key]} target="_blank" rel="noreferrer" className={`social-link social-${key}`} aria-label={label}>
              <Icon /> <span>{label}</span><ExternalLink className="social-arrow" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
