/*
用以產生barcode , 需傳入字串
*/
// GenerateBarCode.tsx
import React from 'react';
import JsBarcode from 'jsbarcode';
import { saveAs } from 'file-saver';


export const generateBarcodeImage = (text: string): HTMLCanvasElement => {
    const canvas = document.createElement('canvas');
    JsBarcode(canvas, text, {
        width: 2,
        height: 50,
        fontSize: 12,
        displayValue: false,
        margin: 0,
        textAlign: "center",
    });
    return canvas;
};


export const downloadBarcode = (text: string) => {
    const canvas = generateBarcodeImage(text);
    canvas.toBlob((blob) => {
        if (blob) {
            saveAs(blob, `${text}.png`);
        }
    });
};


const GenerateBarCode = () => {
    return <div>Generate Barcode Component</div>;
};

export default GenerateBarCode;
