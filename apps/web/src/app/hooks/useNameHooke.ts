import { useState, useEffect } from "react";

export const useNameHook = () => {
  const [name, setName] = useState<string>("");
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    const storedName = localStorage.getItem("name");
    const storedUsername = localStorage.getItem("username");

    if (storedName) {
      setName(storedName);
      if (storedUsername) {
        setUsername(storedUsername);
      } else {
        // Name exists but username was deleted/missing. Regenerate it.
        const randomSuffix = Math.floor(1000 + Math.random() * 9000);
        const newUsername = `${storedName}_${randomSuffix}`;
        setUsername(newUsername);
        localStorage.setItem("username", newUsername);
      }
    } else {
      // If name is deleted/missing, clear everything to simple "ask again" state
      setName("");
      setUsername("");
      localStorage.removeItem("username"); 
    }
  }, []);

  const saveName = (inputName: string) => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000); 
    const generatedUsername = `${inputName}_${randomSuffix}`;

    setName(inputName);
    setUsername(generatedUsername);

    localStorage.setItem("name", inputName);
    localStorage.setItem("username", generatedUsername);
  };

  return { name, username, saveName };
};
