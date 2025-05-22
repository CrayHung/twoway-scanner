import React from 'react';
import { useLocation } from 'react-router-dom';

const ACIAddCarton = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const palletName = queryParams.get("palletName");


    console.log("palletName :" + palletName);

    return (
        <div>
            <h2>Pallet Name: {palletName}</h2>
        </div>
    );
};

export default ACIAddCarton;
