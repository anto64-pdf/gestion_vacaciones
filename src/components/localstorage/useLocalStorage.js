import { useState, useEffect } from "react";

function getStorageValue(key, defaultValue) {
  // getting stored value
  const saved = JSON.parse(localStorage.getItem(key));
  const devuelto=localStorage.getItem("user");
    console.log();
  const initial = JSON.parse(saved);
  return initial || defaultValue;
}

export const useLocalStorage = (key, defaultValue) => {
  const [value, setValue] = useState(() => {
    return getStorageValue(key, defaultValue);
  });

  useEffect(() => {
    // storing input name
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};