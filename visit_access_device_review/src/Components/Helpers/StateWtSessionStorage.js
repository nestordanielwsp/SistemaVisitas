import { useState, useEffect } from "react";

export default function useStateWithSessionStorage(sessionStorageKey){
    const [value, setValue] = useState(
        sessionStorage.getItem(sessionStorageKey) || ""
      );

    useEffect(() => {
        sessionStorage.setItem(sessionStorageKey, value);
    }, [value,sessionStorageKey]);

    return [value, setValue];
}