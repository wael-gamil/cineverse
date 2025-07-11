'use client';

import { useEffect } from 'react';
import { userStore } from './userStore';

type Props = {
  username: string;
  email: string;
};

export default function SetUserStore({ username, email }: Props) {
  useEffect(() => {
    userStore.setState({ username, email });
  }, [username, email]);

  return null;
}
