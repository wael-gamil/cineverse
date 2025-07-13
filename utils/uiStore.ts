'use client';

import { Store } from '@tanstack/react-store';

type UIState = {
  trailerFocusMode: boolean;
};

export const uiStore = new Store<UIState>({
  trailerFocusMode: false,
});
