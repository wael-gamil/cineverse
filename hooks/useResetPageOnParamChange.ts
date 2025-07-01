'use client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';

export function useResetPageOnParamChange(paramKeys: string[]) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const prevParamsRef = useRef<string | null>(null);

  useEffect(() => {
    const currentParams = new URLSearchParams(searchParams);
    const previous = prevParamsRef.current;

    const hasChanged = paramKeys.some(key => {
      return (
        previous &&
        new URLSearchParams(previous).get(key) !== currentParams.get(key)
      );
    });

    if (hasChanged) {
      currentParams.delete('page'); // reset page
      router.push(`${pathname}?${currentParams.toString()}`);
    }

    prevParamsRef.current = currentParams.toString();
  }, [searchParams, paramKeys, pathname, router]);
}
