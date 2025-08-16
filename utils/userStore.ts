'use client';

import { Store } from '@tanstack/react-store';

type UserState = {
  username: string | null;
  email: string | null;
  profilePicture: string | null;
  isHydrated: boolean; 
};

const initialState: UserState = {
  username: null,
  email: null,
  profilePicture: null,
  isHydrated: false,
};

export const userStore = new Store<UserState>(initialState);

export const setUserWithExpiry = (
  username: string,
  email: string,
  profilePicture?: string | null
) => {
  const expiresAt = Date.now() + 2 * 60 * 60 * 1000; // 2 hours in ms
  userStore.setState({
    username,
    email,
    profilePicture: profilePicture || null,
    isHydrated: true,
  });

  if (typeof window !== 'undefined') {
    const payload = {
      username,
      email,
      profilePicture: profilePicture || null,
      expiresAt,
    };
    localStorage.setItem('cineverse-user', JSON.stringify(payload));
  }
};

export const updateUserProfilePicture = (profilePicture: string | null) => {
  userStore.setState(prev => ({
    ...prev,
    profilePicture: profilePicture || null,
  }));

  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('cineverse-user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const { username, email, expiresAt } = parsed;
        const payload = {
          username,
          email,
          profilePicture: profilePicture || null,
          expiresAt,
        };
        localStorage.setItem('cineverse-user', JSON.stringify(payload));
      } catch (error) {
        // fallback: just update profilePicture
        localStorage.setItem(
          'cineverse-user',
          JSON.stringify({ profilePicture: profilePicture || null })
        );
      }
    }
  }
};

export const clearUser = () => {
  userStore.setState({
    username: null,
    email: null,
    profilePicture: null,
    isHydrated: true,
  });

  if (typeof window !== 'undefined') {
    localStorage.removeItem('cineverse-user');
  }
};

/**
 * Production debugging helper - logs to console and localStorage
 */
export const debugLog = (message: string, data?: any) => {
  if (typeof window !== 'undefined') {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message}${data ? `: ${JSON.stringify(data)}` : ''}`;
    
    // Log to console
    console.log(`🔍 CineVerse Debug: ${logEntry}`);
    
    // Store in localStorage for persistence (keep last 50 entries)
    try {
      const existingLogs = JSON.parse(localStorage.getItem('cineverse-debug-logs') || '[]');
      existingLogs.push(logEntry);
      
      // Keep only last 50 logs
      if (existingLogs.length > 50) {
        existingLogs.splice(0, existingLogs.length - 50);
      }
      
      localStorage.setItem('cineverse-debug-logs', JSON.stringify(existingLogs));
    } catch (error) {
      console.error('Failed to store debug log:', error);
    }
  }
};

/**
 * Function to call in browser console to get debug information
 * Usage: window.getCineVerseDebugInfo()
 */
export const getCineVerseDebugInfo = () => {
  if (typeof window !== 'undefined') {
    const userState = userStore.state;
    const debugLogs = localStorage.getItem('cineverse-debug-logs');
    const userLocalStorage = localStorage.getItem('cineverse-user');
    
    const info = {
      currentPath: window.location.pathname,
      userState,
      cookies: document.cookie,
      localStorage: {
        user: userLocalStorage,
        debugLogs: debugLogs ? JSON.parse(debugLogs) : []
      },
      timestamp: new Date().toISOString()
    };
    
    console.log('🔍 CineVerse Debug Info:', info);
    console.log('📋 Copy this information to share with developers:', JSON.stringify(info, null, 2));
    
    return info;
  }
};

// Make debug function available globally in production
if (typeof window !== 'undefined') {
  (window as any).getCineVerseDebugInfo = getCineVerseDebugInfo;
}

if (typeof window !== 'undefined') {
  const saved = localStorage.getItem('cineverse-user');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      const { username, email, profilePicture, expiresAt } = parsed;
      if (expiresAt && Date.now() < expiresAt) {
        userStore.setState({
          username,
          email,
          profilePicture: profilePicture || null,
          isHydrated: true, 
        });
      } else {
        localStorage.removeItem('cineverse-user');
        userStore.setState(prev => ({ ...prev, isHydrated: true }));
      }
    } catch (error) {
      localStorage.removeItem('cineverse-user');
      userStore.setState(prev => ({ ...prev, isHydrated: true }));
    }
  } else {
    userStore.setState(prev => ({ ...prev, isHydrated: true }));
  }
} else {
  userStore.setState(prev => ({ ...prev, isHydrated: true }));
}
