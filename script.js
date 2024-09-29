const colorPicker = document.getElementById('colorPicker');
const colorDisplay = document.getElementById('colorDisplay');


function limitValue(inputElement, max) {
    inputElement.addEventListener('input', () => {
        if (inputElement.value > max) {
            inputElement.value = max;
        }
    });
}

function checkInput(inputElement) {
    inputElement.addEventListener('input', () => {
        const value = inputElement.value;
        if (/[+-]/.test(value)) {
            inputElement.value = value.replace(/[+-]/g, ''); 
        }
    });
}

checkInput(document.getElementById('R'));
checkInput(document.getElementById('G'));
checkInput(document.getElementById('B'));
checkInput(document.getElementById('X'));
checkInput(document.getElementById('Y'));
checkInput(document.getElementById('Z'));
checkInput(document.getElementById('H'));
checkInput(document.getElementById('S'));
checkInput(document.getElementById('V'));


limitValue(document.getElementById('R'), 255);
limitValue(document.getElementById('G'), 255);
limitValue(document.getElementById('B'), 255);

limitValue(document.getElementById('X'), 100);
limitValue(document.getElementById('Y'), 100); 
limitValue(document.getElementById('Z'), 100); 

limitValue(document.getElementById('H'), 360);
limitValue(document.getElementById('S'), 100);
limitValue(document.getElementById('V'), 100);


function updateColorsFromRGB() {
    const r = parseInt(document.getElementById('R').value) || 0;
    const g = parseInt(document.getElementById('G').value) || 0;
    const b = parseInt(document.getElementById('B').value) || 0;

    const xyz = rgbToXyz(r, g, b);
    const hsv = rgbToHsv(r, g, b);

    updateXYZInputs(xyz);
    updateHSVInputs(hsv);
    updateColorDisplay(r, g, b);
    updateRangeInputs();
}

function updateColorsFromXYZ() {
    const X = parseFloat(document.getElementById('X').value) || 0;
    const Y = parseFloat(document.getElementById('Y').value) || 0;
    const Z = parseFloat(document.getElementById('Z').value) || 0;

    const rgb = xyzToRgb(X / 100, Y / 100, Z / 100);
    const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);

    document.getElementById('R').value = rgb.r;
    document.getElementById('G').value = rgb.g;
    document.getElementById('B').value = rgb.b;

    updateHSVInputs(hsv);
    updateColorDisplay(rgb.r, rgb.g, rgb.b);
    updateRangeInputs();
}

// function updateColorsFromXYZ() {
//     const X = parseFloat(document.getElementById('X').value) || 0;
//     const Y = parseFloat(document.getElementById('Y').value) || 0;
//     const Z = parseFloat(document.getElementById('Z').value) || 0;

//     const hsv = xyzToHsv(X, Y, Z);
//     const rgb = xyzToRgb(X / 100, Y / 100, Z / 100);

//     document.getElementById('R').value = rgb.r;
//     document.getElementById('G').value = rgb.g;
//     document.getElementById('B').value = rgb.b;

//     updateHSVInputs(hsv);
//     updateColorDisplay(rgb.r, rgb.g, rgb.b);
//     updateRangeInputs();
// }

function updateColorsFromHSV() {
    let H = parseFloat(document.getElementById('H').value) || 0;
    const S = parseFloat(document.getElementById('S').value) / 100 || 0;
    const V = parseFloat(document.getElementById('V').value) / 100 || 0;

    if (H >= 360) {
        H = 0;
    }

    const rgb = hsvToRgb(H, S, V);
    const xyz = rgbToXyz(rgb.r, rgb.g, rgb.b);

    document.getElementById('R').value = rgb.r;
    document.getElementById('G').value = rgb.g;
    document.getElementById('B').value = rgb.b;

    updateXYZInputs(xyz);
    updateColorDisplay(rgb.r, rgb.g, rgb.b);
    updateRangeInputs();
}

function updateXYZInputs(xyz) {
    document.getElementById('X').value = xyz.X.toFixed(2);
    document.getElementById('Y').value = xyz.Y.toFixed(2);
    document.getElementById('Z').value = xyz.Z.toFixed(2);
}

function updateHSVInputs(hsv) {
    document.getElementById('H').value = hsv.H.toFixed(2);
    document.getElementById('S').value = (hsv.S * 100).toFixed(2);
    document.getElementById('V').value = (hsv.V * 100).toFixed(2);
}

function updateColorDisplay(r, g, b) {
    const rgbColor = `rgb(${r}, ${g}, ${b})`;
    colorDisplay.style.backgroundColor = rgbColor;
    document.body.style.backgroundColor = rgbColor;
}

function updateRangeInputs() {
    document.getElementById('rRange').value = document.getElementById('R').value;
    document.getElementById('gRange').value = document.getElementById('G').value;
    document.getElementById('bRange').value = document.getElementById('B').value;

    document.getElementById('XRange').value = document.getElementById('X').value;
    document.getElementById('YRange').value = document.getElementById('Y').value;
    document.getElementById('ZRange').value = document.getElementById('Z').value;

    document.getElementById('HRange').value = document.getElementById('H').value;
    document.getElementById('SRange').value = document.getElementById('S').value;
    document.getElementById('VRange').value = document.getElementById('V').value;
}

function syncRangeInput(numberInput, rangeInput, updateFunction) {
    rangeInput.value = numberInput.value;

    rangeInput.addEventListener('input', () => {
        numberInput.value = rangeInput.value;
        updateFunction();
        updateRangeInputs(); 
    });

    numberInput.addEventListener('input', () => {
        rangeInput.value = numberInput.value;
        updateFunction();
        updateRangeInputs(); 
    });
}

syncRangeInput(document.getElementById('R'), document.getElementById('rRange'), updateColorsFromRGB);
syncRangeInput(document.getElementById('G'), document.getElementById('gRange'), updateColorsFromRGB);
syncRangeInput(document.getElementById('B'), document.getElementById('bRange'), updateColorsFromRGB);

syncRangeInput(document.getElementById('X'), document.getElementById('XRange'), updateColorsFromXYZ);
syncRangeInput(document.getElementById('Y'), document.getElementById('YRange'), updateColorsFromXYZ);
syncRangeInput(document.getElementById('Z'), document.getElementById('ZRange'), updateColorsFromXYZ);

syncRangeInput(document.getElementById('H'), document.getElementById('HRange'), updateColorsFromHSV);
syncRangeInput(document.getElementById('S'), document.getElementById('SRange'), updateColorsFromHSV);
syncRangeInput(document.getElementById('V'), document.getElementById('VRange'), updateColorsFromHSV);

// Обновляем RGB при выборе цвета
colorPicker.addEventListener('input', (event) => {
    const color = event.target.value;
    const rgb = hexToRgb(color);
    document.getElementById('R').value = rgb.r;
    document.getElementById('G').value = rgb.g;
    document.getElementById('B').value = rgb.b;
    updateColorsFromRGB();
});

function hexToRgb(hex) {
    const bigint = parseInt(hex.slice(1), 16);
    return {
        r: (bigint >> 16) & 255,
        g: (bigint >> 8) & 255,
        b: bigint & 255
    };
}

function rgbToXyz(r, g, b) {
    const R = r / 255;
    const G = g / 255;
    const B = b / 255;

    const R_f = F(R);
    const G_f = F(G);
    const B_f = F(B);

    const X = R_f * 0.4124564 + G_f * 0.3575761 + B_f * 0.1804375;
    const Y = R_f * 0.2126729 + G_f * 0.7151522 + B_f * 0.0721750;
    const Z = R_f * 0.0193339 + G_f * 0.1191920 + B_f * 0.9503041;

    return { X: X * 100, Y: Y * 100, Z: Z * 100 };
}

function F(t) {
    return t > 0.04045 ? Math.pow((t + 0.055) / 1.055, 2.4) : t / 12.92;
}

function rgbToHsv(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, v = max;

    const d = max - min;
    s = max === 0 ? 0 : d / max;

    if (max === min) {
        h = 0;
    } else {
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return { H: Math.round(h * 360), S: s, V: v };
}

function hsvToRgb(h, s, v) {
    let r, g, b;
    const i = Math.floor(h / 60) % 6;
    const f = h / 60 - Math.floor(h / 60);
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);

    switch (i) {
        case 0: (r = v, g = t, b = p); break;
        case 1: (r = q, g = v, b = p); break;
        case 2: (r = p, g = v, b = t); break;
        case 3: (r = p, g = q, b = v); break;
        case 4: (r = t, g = p, b = v); break;
        case 5: (r = v, g = p, b = q); break;
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}

function xyzToRgb(X, Y, Z) {
    const R_f =  3.2406 * X - 1.5372 * Y - 0.4986 * Z;
    const G_f = -0.9689 * X + 1.8758 * Y + 0.0415 * Z;
    const B_f =  0.0557 * X - 0.2040 * Y + 1.0570 * Z;

    let r = R_f > 0.0031308 ? (1.055 * Math.pow(R_f, 1 / 2.4) - 0.055) * 255 : R_f * 12.92 * 255;
    let g = G_f > 0.0031308 ? (1.055 * Math.pow(G_f, 1 / 2.4) - 0.055) * 255 : G_f * 12.92 * 255;
    let b = B_f > 0.0031308 ? (1.055 * Math.pow(B_f, 1 / 2.4) - 0.055) * 255 : B_f * 12.92 * 255;

    if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) {
        displayNotification("При переводах (XYZ->RGB) и (XYZ->HSV) значения были обрезаны. Потеря точности перевода!");
    }

    return {
        r: Math.round(Math.max(0, Math.min(255, r))),
        g: Math.round(Math.max(0, Math.min(255, g))),
        b: Math.round(Math.max(0, Math.min(255, b)))
    };
}

// function xyzToHsv(X, Y, Z) {
//     // Преобразование XYZ в HSV  
//     // Нормализация Y для получения яркости V  
//     const v = Y; // Яркость (Value) - это Y в системе XYZ

//     // Проверяем, является ли Y нулевым  
//     if (v === 0) {
//         return { H: 0, S: 0, V: 0 }; // В случае черного цвета  
//     }

//     // Преобразование XYZ в цветовой круг (Hue) и насыщенность (Saturation)
//     const max = Math.max(X, Y, Z);
//     const min = Math.min(X, Y, Z);
//     const d = max - min;

//     let h, s;

//     // Вычисляем насыщенность (S)
//     s = max === 0 ? 0 : d / max;

//     // Вычисляем оттенок (H)
//     if (max === X) {
//         h = (Y - Z) / d + (Y < Z ? 6 : 0);
//     } else if (max === Y) {
//         h = (Z - X) / d + 2;
//     } else { // max === Z  
//         h = (X - Y) / d + 4;
//     }
    
//     h /= 6; // Приведение к диапазону [0, 1]

//     // Возвращаем результат с округлением H и нормализацией S и V  
//     return {
//         H: Math.round(h * 360), // Угол в градусах от 0 до 360  
//         S: parseFloat(s.toFixed(2)), // Saturation от 0 до 1  
//         V: parseFloat(v.toFixed(2)) // Value от 0 до 1  
//     };
// }

function displayNotification(message) {
    const notification = document.getElementById('notification');
    notification.innerText = message;
    notification.style.display = 'block';
    
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}