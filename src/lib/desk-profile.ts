/**
 * Local desk profile (avatar + display name). Not a brokerage identity.
 */

export const PROFILE_KEY = 'agents61_profile';
export const PROFILE_EVENT = 'agents61-profile';

export type DeskProfile = {
  displayName: string;
  avatarDataUrl: string;
};

export function emptyProfile(): DeskProfile {
  return { displayName: '', avatarDataUrl: '' };
}

export function readDeskProfile(): DeskProfile {
  if (typeof window === 'undefined') return emptyProfile();
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return emptyProfile();
    const parsed = JSON.parse(raw) as Partial<DeskProfile>;
    return {
      displayName: typeof parsed.displayName === 'string' ? parsed.displayName.slice(0, 40) : '',
      avatarDataUrl:
        typeof parsed.avatarDataUrl === 'string' && parsed.avatarDataUrl.startsWith('data:image/')
          ? parsed.avatarDataUrl
          : '',
    };
  } catch {
    return emptyProfile();
  }
}

export function persistDeskProfile(profile: DeskProfile): void {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch {
    /* private mode / quota */
  }
  window.dispatchEvent(new Event(PROFILE_EVENT));
}

export function initialsFrom(email: string, displayName: string): string {
  const name = displayName.trim();
  if (name) {
    const parts = name.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) return `${parts[0][0] ?? ''}${parts[1][0] ?? ''}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  }
  const local = email.split('@')[0] ?? 'A';
  return local.slice(0, 2).toUpperCase();
}
