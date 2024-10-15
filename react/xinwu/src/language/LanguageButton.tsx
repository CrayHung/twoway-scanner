import React, { useContext, useMemo, useState } from "react";
import {
    Menu,
    MenuItem,
    Button
} from "@mui/material";
import { LocaleContext, localeTypes, localeOptions } from "./useNavigatorLanguage";

import languageSVG from './global.svg';

export default function LanguageButton() {
    const [locale, setLocale] = useContext(LocaleContext);

    //select的option value
    const optionsfindIndex = useMemo((): number => localeOptions.findIndex((option): boolean => option.language === locale), [locale]);

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [selectedIndex, setSelectedIndex] = useState(optionsfindIndex);


    function handleClick(event: React.MouseEvent<HTMLElement>): void {
        setAnchorEl(event.currentTarget);
    };

    function handleMenuItemClick(index: number, language: localeTypes): void {
        setSelectedIndex(index);
        setAnchorEl(null);
        if (setLocale) {
            setLocale(language);
        }
    }

    const handleClose = (): void => {
        setAnchorEl(null);
    };


    return (
        <>

            <Button
                aria-controls="simple-menu"
                aria-haspopup="true"
                onClick={handleClick}
            >
                <img src={languageSVG} alt="" height="18" width="18" style={{ marginRight: '10px' }}/>
                {localeOptions[selectedIndex] ? localeOptions[selectedIndex].label : ''}
            </Button>

            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                {localeOptions.map((option, index) => (
                    <MenuItem
                        key={option.language}
                        selected={index === selectedIndex}
                        onClick={() => handleMenuItemClick(index, option.language)}>
                        {option.label}
                    </MenuItem>
                ))}

            </Menu>
        </>

    );
}