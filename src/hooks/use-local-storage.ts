
'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';

function useStableValue<T>(value: T) {
    const valueRef = React.useRef(value);
    useMemo(() => {
        valueRef.current = value;
    }, [value]);
    return valueRef.current;
}


export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const stableInitialValue = useStableValue(initialValue);

  useEffect(() => {
    // This effect runs only on the client, after hydration
    let item;
    try {
      item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      } else {
        window.localStorage.setItem(key, JSON.stringify(stableInitialValue));
        setStoredValue(stableInitialValue);
      }
    } catch (error) {
        if (!item) {
            setStoredValue(stableInitialValue);
        }
      console.warn(`Error reading or setting localStorage key "${key}":`, error);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        // Allow value to be a function so we have same API as useState
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        // Save state
        setStoredValue(valueToStore);
        // Save to local storage
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        // A more advanced implementation would handle the error case
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue];
}
