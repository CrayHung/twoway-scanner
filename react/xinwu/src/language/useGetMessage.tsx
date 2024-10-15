import { useState } from "react";
import mess from './language.json';


export default function useGetMessage():any{
    const [messages , setMessages] = useState(mess)
        return messages;
}