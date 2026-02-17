import { useState, useEffect } from "react";
import axios from "axios";

export const useNameHook = () => {
  const [name, setName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    const storedName = localStorage.getItem("name");
    const storedUsername = localStorage.getItem("username");
    const storedEmail = localStorage.getItem("email");

    if (storedName) {
      setName(storedName);
      if (storedUsername) {
        setUsername(storedUsername);
      } else {
        const randomSuffix = Math.floor(1000 + Math.random() * 9000);
        const newUsername = `${storedName}_${randomSuffix}`;
        setUsername(newUsername);
        localStorage.setItem("username", newUsername);
      }

      if (storedEmail) {
          setEmail(storedEmail);
      }
    } else {
      setName("");
      setUsername("");
      setEmail("");
      localStorage.removeItem("username"); 
      localStorage.removeItem("email"); 
    }
  }, []);

  const saveName = async (inputName: string, inputEmail : string) => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000); 
    const generatedUsername = `${inputName}_${randomSuffix}`;

    setName(inputName);
    setUsername(generatedUsername);
    setEmail(inputEmail)

    localStorage.setItem("name", inputName);
    localStorage.setItem("username", generatedUsername);
    localStorage.setItem("email", inputEmail);

    try {
        const res = await axios.post("http://localhost:3001/api/v1/user/create", {
            name: inputName,
            username: generatedUsername,
            email : inputEmail
        });
        console.log("User created on backend:", res.data);
    } catch (error) {
        console.error("Failed to create user backend:", error);
    }
  };

  return { name, username, email, saveName };
};
