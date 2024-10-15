import {
    createContext,useState,Dispatch,SetStateAction,
} from "react";

//定義localeTypes可以使用的語系
export type localeTypes = 'zh-TW' | 'en-US';

//下拉選單用 , 定義localeOptions內含language , label兩個屬性
export const localeOptions:{language : localeTypes; label:string }[]=[
    { language:'zh-TW',label:'中文'},
    { language:'en-US',label:'English'},
];

//全域共用
export const LocaleContext = createContext<[null,null] |
[localeTypes , Dispatch<SetStateAction<localeTypes>>]
>([null,null]);

//for root use
export default function useNavigatorLanguage():
[localeTypes,Dispatch<SetStateAction<localeTypes>>]{
    const [locale , setLocale] = useState<localeTypes>(navigator.language as localeTypes);

    return [locale,setLocale];
}