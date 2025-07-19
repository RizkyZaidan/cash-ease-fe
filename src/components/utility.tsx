import { fetchCustomerList } from '@/api/customer';
import { fetchOptions } from '@/api/options';
import { Balance, ClientCompressionResult, CompressionOptions, Option, Pagination, TopUp, Transfer, User } from '@/structures/interfaces';
import { differenceInYears, differenceInMonths, differenceInDays, parse, format } from 'date-fns';

var ENCRYPTION_KEY = process.env.NEXT_PUBLIC_CONFIG_IDB_ENCRYPTION_KEY;
var encoder = new TextEncoder();
var decoder = new TextDecoder();


export function toTitleCase(str: string) {
    return str
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

export function parseLabel(str: string): string {
    return str
        .split('_')                     // split by underscore
        .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // capitalize first letter
        .join(' ');                    // join with spaces
}
export function getRelativeTime(timestamp: Date | string | number) {
    const rtf = new Intl.RelativeTimeFormat("id", { numeric: "auto" });

    const now = new Date();
    const past = new Date(timestamp);

    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000); // <-- this is key

    const times: { unit: Intl.RelativeTimeFormatUnit; seconds: number }[] = [
        { unit: "year", seconds: 31536000 },
        { unit: "month", seconds: 2592000 },
        { unit: "week", seconds: 604800 },
        { unit: "day", seconds: 86400 },
        { unit: "hour", seconds: 3600 },
        { unit: "minute", seconds: 60 },
        { unit: "second", seconds: 1 },
    ];

    for (let { unit, seconds } of times) {
        const delta = Math.floor(diffInSeconds / seconds);
        if (Math.abs(delta) >= 1) {
            return rtf.format(-delta, unit); // <-- negative because it's "time ago"
        }
    }

    return "Baru saja"; // Just now
};

export function formatNumber(value: number) {
    return new Intl.NumberFormat("id-ID", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
}

export function formatStringToIdFormat(value: string) {
    let date = new Date(value);
    return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC' // ensure consistent time zone
    }).format(date);;
}

export function calculateAge(birthdate: string) {
    const today = new Date();
    const birthDate = new Date(birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    // Adjust age if the birthday hasn't occurred yet this year
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return age;
};

export function isEmpty(obj: any, property = null): boolean {
    // Base emptiness check for null or undefined
    const isNullOrUndefined = obj === null || obj === undefined;
    // If there's no property to check, determine emptiness based on type
    if (!property) {
        if (isNullOrUndefined) {
            return true;
        }
        // For arrays, empty means length === 0
        if (Array.isArray(obj)) {
            return obj.length === 0;
        }
        // For objects, empty means no keys
        if (typeof obj === 'object') {
            return Object.keys(obj).length === 0;
        }
        // For strings, empty means trimmed length === 0
        if (typeof obj === 'string') {
            return obj.trim() === '';
        }
        // Default to false for other types (e.g., numbers, booleans)
        return false;
    }
    // If the base value is null or undefined, return true (considered empty)
    if (isNullOrUndefined) {
        return true;
    }
    // If a property is specified, ensure it exists on the object and is not empty itself
    if (typeof obj === 'object' && !Array.isArray(obj)) {
        return !(property in obj) || isEmpty(obj[property]);
    }

    // If obj is not an object, having a property doesn't make sense, so return true (empty)
    return true;
}

export const generateRandomNumber = () => {
    const buffer = new Uint32Array(1);
    crypto.getRandomValues(buffer);
    return buffer[0] / (0xffffffff + 1);
};

export const capitalizeFLetter = (string: string) => {
    return string[0].toUpperCase() + string.slice(1);
};

export const capitalizeWords = (text: string) => {
    return text
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}


export const isValidEmail = (value: string) => {
    return value && /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,8}$/i.test(value);
};

export const idGenerator = () => {
    return Math.floor(generateRandomNumber() * 100000);
};

export const getEmptyArray = (size: number): object[] => {
    return Array.from({ length: size }, () => ({}));
};


export const getRandomInt = (max: number, min: number = 0): number => {
    return Math.floor(Math.random() * (max + 1 - min)) + min;
};


const alphabets = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
];

export const getRandomChar = (length: number): string => {

    const alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

    let char = "";
    for (let i = 0; i < length; i++) {
        char += alphabets[getRandomInt(25)];
    }
    return char;
};

export const getProgress = (current: number, total: number): number => {
    return Math.round((current / total) * 100);
};


/*
public static String get(String appId, String key, String time, String method, String body) {
    final String secretKey = DigestUtils.sha256Hex(key);
    String baseMessage = null;
    if(body!=null)  {
        baseMessage = createBaseMessage(appId, time, method, body.getBytes());
    }else {
        baseMessage = createBaseMessage(appId, time, method, null);
    }
    String signature = HmacUtils.hmacSha256Hex(secretKey, baseMessage);
    log.info("Method = {}", method );
    log.info("Secret Key = {}", secretKey);
    log.info("Time = {}", time);
    log.info("Body before Byte = {}", body);
    log.info("Signature = {}", signature);
    return signature;
}
public static String createBaseMessage(String appId, String time, String method, byte[] byteBody) {
    if(byteBody!=null) {
        String payloadBase64 = Base64.encodeBase64URLSafeString(byteBody);
        return appId + time + method + payloadBase64;
    }else {
        return appId + time + method;
    }

}
*/

// export const getSHA256HexString = (payload: string): string => {
//     return enc.Hex.stringify(SHA256(payload));
// };
// export const getSHA256Hex = (payload: string): WordArray => {
//     return enc.Hex.parse(getSHA256HexString(payload));
// };

// export const getHmacSHA256HexString = (
//   payload: string,
//   secret: string
// ): string => {
//   return enc.Hex.stringify(HmacSHA256(payload, secret));
// };


// export const getHmacSHA256Hex = (
//   payload: string,
//   secret: string
// ): lib.WordArray => {
//   return enc.Hex.parse(getHmacSHA256HexString(payload, secret));
// };

const encodeBase64Url = (base64: string): string => {
    return base64
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
};

declare global {
    interface String {
        getBytes(): number[];
    }
}

// eslint-disable-next-line no-extend-native
String.prototype.getBytes = function (): number[] {
    const bytes: number[] = [];
    for (let i = 0; i < this.length; ++i) {
        bytes.push(this.charCodeAt(i));
    }
    return bytes;
};


export const convertStringToHexString = (str: string): string => {
    return Array.from(str)
        .map((char) => char.charCodeAt(0).toString(16))
        .join('');
};

export const generateCaptcha = (max: number, min: number): [number, number, boolean, number] => {
    const isAddition = getRandomInt(1, 0) === 1;
    if (isAddition) {
        const firstNumber = getRandomInt(max);
        const secondNumber = getRandomInt(max - firstNumber);
        const result = firstNumber + secondNumber;

        return [firstNumber, secondNumber, isAddition, result];
    } else {
        const firstNumber = getRandomInt(max);
        const secondNumber = getRandomInt(min + firstNumber);
        const result = firstNumber - secondNumber;

        return [firstNumber, secondNumber, isAddition, result];
    }
};

export const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
        }
        : null;
};


export const clearCanvas = (canvas: React.RefObject<HTMLCanvasElement>): void => {
    let cnv = canvas.current;
    let ctx = cnv?.getContext('2d');

    ctx?.clearRect(0, 0, cnv?.width as number, cnv?.height as number);
};

type CanvasRef = React.RefObject<HTMLCanvasElement>;

export const renderCaptcha = (
    canvas: CanvasRef,
    firstNumber: number,
    secondNumber: number,
    isAddition: boolean,
    isDark: boolean
): void => {
    const cnv = canvas.current;
    if (!cnv) return;

    const ctx = cnv.getContext("2d");
    if (!ctx) return;

    const fontSize = 75;
    const text = `${firstNumber} ${isAddition ? "+" : "-"} ${secondNumber}`;
    const xPosition = cnv.width / 2;
    const yPosition = cnv.height / 2 + fontSize / 2;

    let imageDataShadows: string;
    let imageDataWithShadow: string;

    const imageObjShadow = new Image();
    const imageObjWithShadow = new Image();

    const generateRandomNumber = (): number => Math.random();

    const randInt = (min: number, max: number): number =>
        Math.floor(generateRandomNumber() * (max - min + 1) + min);

    const offset = (): number =>
        Math.floor(generateRandomNumber() * (3 - 2 + 1) + 2) * 0.8;

    const lineShadows = (): number =>
        Math.floor(generateRandomNumber() * (7 - 4 + 1) + 4);

    const lineShadowsHeight = (): number[] => {
        const count = lineShadows();
        const arr: number[] = [];
        let remainingHeight = cnv.height;
        let accumulated = 0;

        for (let i = 0; i < count; i++) {
            arr[i] = Math.floor(
                generateRandomNumber() * (cnv.height / (count - 1) - 2 + 1) + 2
            );
            remainingHeight -= arr[i];
            accumulated += arr[i];
        }
        arr[count] = cnv.height - accumulated;
        return arr;
    };

    const drawText = () => {
        ctx.font = `${fontSize}px Arial`;
        ctx.fillStyle = isDark ? "#fff" : "#000";
        ctx.textAlign = "center";
        ctx.fillText(text, xPosition, yPosition);
    };

    const getShadowsImg = () => {
        ctx.save();
        ctx.font = `${fontSize}px Arial`;
        ctx.textAlign = "center";
        ctx.globalCompositeOperation = "destination-over";
        ctx.clearRect(0, 0, cnv.width, cnv.height);
        ctx.fillStyle = "#a3004a";
        ctx.fillText(text, xPosition - 5, yPosition);
        ctx.fillStyle = "#09c4de";
        ctx.fillText(text, xPosition + 5, yPosition);
        ctx.restore();

        imageDataShadows = cnv.toDataURL("image/png", 1.0);
    };

    const glitch = () => {
        imageObjShadow.onload = () => {
            ctx.clearRect(0, 0, cnv.width, cnv.height);
            const arr = lineShadowsHeight();
            let sy = 0;

            for (const o of arr) {
                ctx.drawImage(
                    imageObjShadow,
                    0,
                    sy,
                    cnv.width,
                    o,
                    randInt(-2 * offset(), 2 * offset()),
                    sy,
                    cnv.width,
                    o
                );
                sy += o;
            }

            drawText();
            imageDataWithShadow = cnv.toDataURL("image/png", 1.0);

            imageObjWithShadow.onload = () => {
                ctx.clearRect(0, 0, cnv.width, cnv.height);
                ctx.drawImage(
                    imageObjWithShadow,
                    0,
                    0,
                    cnv.width,
                    cnv.height / 3 + 5,
                    1,
                    0,
                    cnv.width,
                    cnv.height / 3 + 5
                );
                ctx.drawImage(
                    imageObjWithShadow,
                    0,
                    cnv.height / 3 + 5,
                    cnv.width,
                    cnv.height / 3 - 5,
                    0,
                    cnv.height / 3 + 5,
                    cnv.width,
                    cnv.height / 3 - 5
                );
                ctx.drawImage(
                    imageObjWithShadow,
                    0,
                    (cnv.height / 3) * 2,
                    cnv.width,
                    cnv.height / 3,
                    0,
                    (cnv.height / 3) * 2,
                    cnv.width,
                    cnv.height / 3
                );
            };
            imageObjWithShadow.src = imageDataWithShadow;
        };

        imageObjShadow.src = imageDataShadows;

        setTimeout(() => {
            imageObjWithShadow.onload = () => {
                ctx.clearRect(0, (cnv.height / 3) * 2, cnv.width, cnv.height / 3);
                const arr = lineShadowsHeight();
                let sy = 0;
                for (const o of arr) {
                    ctx.drawImage(
                        imageObjWithShadow,
                        0,
                        sy,
                        cnv.width,
                        o,
                        randInt(-2 * offset(), 2 * offset()),
                        sy,
                        cnv.width,
                        o
                    );
                    sy += o;
                }
            };
            imageObjWithShadow.src = imageDataWithShadow;
        }, 80);
    };

    ctx.clearRect(0, 0, cnv.width, cnv.height);
    getShadowsImg();
    drawText();
    glitch();
};

export const queryString = (object: Record<string, string | number>): string => {
    return Object.keys(object)
        .map((key, idx) =>
            `${idx === 0 ? "?" : ""}${key}=${object[key]}`
        )
        .join("&");
};

export const isValidURL = (str: string): boolean => {
    try {
        new URL(str);
        return true;
    } catch {
        return false;
    }
};


export const getFileNameFromUrl = (url: string): string => {
    return url.substring(url.lastIndexOf("/") + 1);
};

export const titleize = (str: string): string => {
    let upper = true;
    let newStr = "";

    for (let i = 0; i < str.length; i++) {
        if (str[i].match(/\s/)) {
            upper = true;
            newStr += str[i];
        } else {
            newStr += upper ? str[i].toUpperCase() : str[i].toLowerCase();
            upper = false;
        }
    }

    return newStr;
};

export const clearAndTitleize = (str: string, delimiters: string[] = []): string => {
    // Step 1: Replace specified delimiters with spaces
    let processedStr = str;
    delimiters.forEach((delimiter) => {
        processedStr = processedStr.split(delimiter).join(' ');
    });

    // Step 2: Apply title case logic
    let upper = true;
    let newStr = "";

    for (let i = 0; i < processedStr.length; i++) {
        if (processedStr[i].match(/\s/)) {
            upper = true;
            newStr += processedStr[i];
        } else {
            newStr += upper ? processedStr[i].toUpperCase() : processedStr[i].toLowerCase();
            upper = false;
        }
    }

    return newStr;
};


export const createFile = async (url: string): Promise<File> => {
    const response = await fetch(url);
    const data = await response.blob();
    const filename = url.split("/").pop() || "file";
    const ext = url.split(/[#?]/)[0].split(".").pop()?.trim().toLowerCase() || "";

    const types: { ext: string; type: string }[] = [
        { ext: "pdf", type: "application/pdf" },
        { ext: "docx", type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" },
        { ext: "doc", type: "application/msword" },
        { ext: "xlsx", type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" },
        { ext: "xls", type: "application/vnd.ms-excel" },
        { ext: "png", type: "image/png" },
        { ext: "jpg", type: "image/jpeg" },
        { ext: "jpeg", type: "image/jpeg" },
    ];

    const found = types.find((type) => type.ext === ext);
    const type = found?.type || "application/octet-stream"; // default if unknown

    const metadata: BlobPropertyBag = { type };
    return new File([data], filename, metadata);
};

export const isElementFullscreen = (element: Element): boolean => {
    return (
        document.fullscreenElement === element ||
        (document as any).mozFullScreenElement === element || // Firefox
        (document as any).webkitFullscreenElement === element || // Chrome/Safari/Opera
        (document as any).msFullscreenElement === element // IE/Edge
    );
};


declare function requestRDS(nomorRDS: string): Promise<{ data: string | Blob }>;

export const redirectRDS = (nomorRDS: string): void => {
    requestRDS(nomorRDS).then((res) => {
        const file = new Blob([res.data], { type: "application/pdf" });
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL);
    });
};


export function encryptForUrl(data: string): string {
    const encodedData = btoa(data); // Base64 encode
    return encodeURIComponent(encodedData);
}


export function decryptForUrl(encryptedData: string): string {
    const decodedData = decodeURIComponent(encryptedData);
    return atob(decodedData); // Base64 decode
}



export const randomAlphaNumeric = (length: number): string => {
    let s = "";
    Array.from({ length }).some(() => {
        s += Math.random().toString(36).slice(2); // Adds a chunk of random base-36
        return s.length >= length;
    });
    return s.slice(0, length);
};

export const expiredTime = () => {
    // Tambahkan timestamp waktu kadaluarsa
    let date = new Date();

    // add a day
    date.setDate(date.getDate() + 1);

    // Tambahkan timestamp waktu kadaluarsa
    // const now = Date.now();

    // const expiryTime = now + 3 * 60 * 1000;

    return date.getTime()
}

export const parseJwtToArray = (token: string): [string, any][] => {
    try {
        const base64Payload = token.split('.')[1]; // Get the payload part
        const jsonPayload = Buffer.from(base64Payload, 'base64').toString('utf8');
        const payloadObj = JSON.parse(jsonPayload);

        return Object.entries(payloadObj); // Convert object to array of [key, value] pairs
    } catch (err) {
        console.error("Invalid JWT:", err);
        return [];
    }
}

export const jwtToJson = (token: string): Record<string, any> | null => {
    try {
        const base64 = token.split('.')[1];
        const json = atob(base64);
        return JSON.parse(json);
    } catch (e) {
        console.error("Invalid JWT:", e);
        return null;
    }
}

export const integerToRoman = (num: number): string => {
    const romanValues: Record<string, number> = {
        M: 1000,
        CM: 900,
        D: 500,
        CD: 400,
        C: 100,
        XC: 90,
        L: 50,
        XL: 40,
        X: 10,
        IX: 9,
        V: 5,
        IV: 4,
        I: 1,
    };

    let roman = '';
    for (const key in romanValues) {
        while (num >= romanValues[key]) {
            roman += key;
            num -= romanValues[key];
        }
    }
    return roman;
};


export const objectToQueryStringNullable = (
    obj: Record<string, any>
): string => {
    const str: string[] = [];

    for (const p in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, p) && !isEmpty(obj[p])) {
            str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
        }
    }

    return str.join('&');
};

export function fileToBase64(file: File, includeDataUri: boolean = true): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onloadend = () => {
            let result = reader.result as string;
            if (!includeDataUri) {
                // Remove the data URI prefix if it exists (e.g., "data:image/png;base64,")
                const base64Index = result.indexOf("base64,");
                if (base64Index !== -1) {
                    result = result.substring(base64Index + 7); // Extract only the Base64 part
                }
            }
            resolve(result);
        };

        reader.onerror = () => {
            reject(new Error("Failed to read file as Base64"));
        };

        // Read the file as a data URL (Base64)
        reader.readAsDataURL(file);
    });
}

export const splitIntoChunks = (data: any, chunkSize: number): any[] => {
    if (Array.isArray(data)) {
        // For arrays, split into smaller arrays
        const chunks: any[] = [];
        for (let i = 0; i < data.length; i += chunkSize) {
            chunks.push(data.slice(i, i + chunkSize));
        }
        return chunks;
    } else if (typeof data === 'object' && data !== null) {
        // For objects, split into smaller objects by entries if possible
        const entries = Object.entries(data);
        if (entries.length > 0) {
            const chunks: any[] = [];
            for (let i = 0; i < entries.length; i += chunkSize) {
                const chunkEntries = entries.slice(i, i + chunkSize);
                chunks.push(Object.fromEntries(chunkEntries));
            }
            return chunks;
        }
    }
    // If data cannot be split (e.g., a small object or non-splittable), return as a single chunk
    return [data];
};

// Function to split a large string (like Base64) into chunks
export const splitStringIntoChunks = (str: string, chunkSize: number): string[] => {
    const chunks: string[] = [];
    for (let i = 0; i < str.length; i += chunkSize) {
        chunks.push(str.slice(i, i + chunkSize));
    }
    return chunks;
};

export function compressImageClientSide(
    file: File,
    options: Partial<CompressionOptions> = {}
): Promise<ClientCompressionResult> {
    const {
        includeDataUri = true,
        targetSizeKB = 500,
        maxWidth = 1920,
        maxHeight = 1080,
    } = options;

    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                // Calculate new dimensions while maintaining aspect ratio
                if (width > height) {
                    if (width > maxWidth) {
                        height = Math.round((height * maxWidth) / width);
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width = Math.round((width * maxHeight) / height);
                        height = maxHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    return reject(new Error('Failed to get canvas context'));
                }
                ctx.drawImage(img, 0, 0, width, height);

                // Compress by reducing quality iteratively until under target size
                let quality = 0.9; // Start with high quality
                let dataUrl: string;
                let sizeKB: number;

                do {
                    dataUrl = canvas.toDataURL('image/jpeg', quality);
                    sizeKB = Math.round((dataUrl.length * 3) / 4 / 1024); // Approximate size in KB
                    quality -= 0.1; // Reduce quality if size is too large
                } while (sizeKB > targetSizeKB && quality > 0.1);

                if (sizeKB > targetSizeKB) {
                    return reject(new Error(`Could not compress image below ${targetSizeKB} KB.`));
                }

                // Convert Base64 to Blob for potential upload
                const byteString = atob(dataUrl.split(',')[1]);
                const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0];
                const ab = new ArrayBuffer(byteString.length);
                const ia = new Uint8Array(ab);
                for (let i = 0; i < byteString.length; i++) {
                    ia[i] = byteString.charCodeAt(i);
                }
                const blob = new Blob([ab], { type: mimeString });

                const compressedBase64 = includeDataUri ? dataUrl : dataUrl.split(',')[1];

                resolve({
                    compressedBase64,
                    compressedBlob: blob,
                    originalSizeKB: file.size / 1024,
                    compressedSizeKB: sizeKB,
                });
            };
            img.onerror = (error) => reject(error);
            img.src = reader.result as string;
        };
        reader.onerror = () => reject(new Error('Failed to read file as Base64'));
        reader.readAsDataURL(file);
    });
}

export const hasHtmlTags = (text: string | null | undefined): boolean => {
    if (!text) return false;
    return /<[^>]+>/.test(text);
};



export const formatInputNumber = (value: string): string => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');
    // Add dots every 3 digits from the right
    return digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export const unformatNumber = (value: string | null): string => {
    if (!value) return ''; // Handle null or empty
    return value.replace(/\./g, ''); // Remove all dots (.)
};

export const stringDateToMonthYear = (data: string) => {
    const parsedDate = parse(data, "dd-MM-yyyy", new Date());
    const formattedDate = format(parsedDate, "MM-yyyy");
    if (formattedDate) {
        return formattedDate
    } else {
        return null
    }
};

export const formatDateToMonthYear = (dateInput: Date | string | number): string => {
    let date: Date;

    // Handle different input types
    if (typeof dateInput === 'string') {
        // Handle common date string formats like dd-MM-yyyy, yyyy-MM-dd, or ISO
        if (dateInput.includes('-')) {
            const parts = dateInput.split('-');
            if (parts.length === 3) {
                // Assume dd-MM-yyyy or yyyy-MM-dd based on length of first part
                if (parts[0].length === 4) {
                    // yyyy-MM-dd
                    date = new Date(dateInput);
                } else {
                    // dd-MM-yyyy
                    date = new Date(`${parts[1]}-${parts[0]}-${parts[2]}`); // Convert to MM-dd-yyyy for Date parsing
                }
            } else {
                date = new Date(dateInput); // Fallback to default parsing
            }
        } else {
            date = new Date(dateInput); // Fallback for other string formats
        }
    } else if (typeof dateInput === 'number') {
        // Assume timestamp in milliseconds
        date = new Date(dateInput);
    } else {
        // Already a Date object
        date = dateInput;
    }

    // Check if the date is valid
    if (isNaN(date.getTime())) {
        throw new Error('Invalid date input');
    }

    // Extract month and year, format with leading zeros for month
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so add 1
    const year = date.getFullYear();

    return `${month}-${year}`;
};


export const retryRequest = async (fn: any, maxRetries = 3, delay = 1000) => {
    for (let i = 0; i < maxRetries; i++) {
        try {
            const response = await fn();
            // If status is not 500, return the response
            if (response.status !== 500) {
                return response;
            }
            // If it's the last retry, return the failed response
            if (i === maxRetries - 1) {
                return response;
            }
            // Wait before retrying
            await new Promise(resolve => setTimeout(resolve, delay));
        } catch (error) {
            // If it's the last retry, throw the error
            if (i === maxRetries - 1) {
                return error;
            }
            // Wait before retrying
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
};

export function calculateDurationWithDateFns(startDate: Date | string, endDate: Date | string): string {
    const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
    const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new Error('Invalid date input');
    }
    if (end < start) {
        return "-";
    }
    const years = differenceInYears(end, start);
    if (years >= 1) {
        return `${years} Tahun`;
    }
    const months = differenceInMonths(end, start);
    if (months >= 1) {
        return `${months} Bulan`;
    }
    const days = differenceInDays(end, start);
    return `${days} Hari`;
}

export function parseDateSimple(dateString: string): Date {
    // Convert "Jan 2025" to a format like "01 Jan 2025" for parsing
    const formattedString = `01 ${dateString}`;
    const date = new Date(formattedString);
    if (isNaN(date.getTime())) {
        throw new Error('Invalid date string');
    }
    return date;
}

export const isObjectEqual = (obj1: any, obj2: any) => {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
};

export function deriveEncryptionKey(rawKey: string): Promise<Uint8Array> {
    return new Promise(function (resolve, reject) {
        var encodedKey = encoder.encode(rawKey);
        // Check if the encoded key is already 16, 24, or 32 bytes
        if (encodedKey.length === 16 || encodedKey.length === 24 || encodedKey.length === 32) {
            resolve(encodedKey);
        } else {
            // If not, derive a 32-byte key using SHA-256
            crypto.subtle.digest('SHA-256', encodedKey).then(function (hashBuffer) {
                // Ensure hashBuffer is treated as ArrayBuffer
                var hashArray = new Uint8Array(hashBuffer as any); // Use 'any' to bypass strict type check
                // SHA-256 always returns 32 bytes (256 bits), perfect for AES-256
                resolve(hashArray);
            }).catch(function (error) {
                console.error('Error deriving key with SHA-256:', error);
                reject(error);
            });
        }
    });
}

export function encryptData(data: string): Promise<string> {
    return new Promise(function (resolve, reject) {
        deriveEncryptionKey(String(ENCRYPTION_KEY)).then(function (keyData) {
            crypto.subtle.importKey(
                'raw',
                keyData as any, // Use 'any' to bypass strict type check
                { name: 'AES-GCM', length: 256 },
                false,
                ['encrypt']
            ).then(function (key) {
                var iv = crypto.getRandomValues(new Uint8Array(12)); // Initialization vector
                var encodedData = encoder.encode(data);
                crypto.subtle.encrypt(
                    { name: 'AES-GCM', iv: iv as any }, // Use 'any' to bypass strict type check
                    key,
                    encodedData as any // Use 'any' to bypass strict type check
                ).then(function (encrypted) {
                    // Combine IV and encrypted data for storage without spread operator
                    var encryptedArray = new Uint8Array(encrypted as any); // Use 'any' to bypass strict type check
                    var combined = new Uint8Array(iv.length + encryptedArray.length);
                    for (var i = 0; i < iv.length; i++) {
                        combined[i] = iv[i];
                    }
                    for (var j = 0; j < encryptedArray.length; j++) {
                        combined[iv.length + j] = encryptedArray[j];
                    }
                    // Convert to base64 for storage in a compatible way
                    var binaryString = '';
                    for (var k = 0; k < combined.length; k++) {
                        binaryString += String.fromCharCode(combined[k]);
                    }
                    var base64String = btoa(binaryString);
                    resolve(base64String);
                }).catch(function (error) {
                    console.error('Encryption error:', error);
                    reject(error);
                });
            }).catch(function (error) {
                console.error('Key import error:', error);
                reject(error);
            });
        }).catch(function (error) {
            reject(error);
        });
    });
}

// Helper to decrypt data after retrieval
export function decryptData(encryptedData: string): Promise<string> {
    return new Promise(function (resolve, reject) {
        deriveEncryptionKey(String(ENCRYPTION_KEY)).then(function (keyData) {
            crypto.subtle.importKey(
                'raw',
                keyData as any, // Use 'any' to bypass strict type check
                { name: 'AES-GCM', length: 256 },
                false,
                ['decrypt']
            ).then(function (key) {
                var binary = atob(encryptedData);
                var bytes = new Uint8Array(binary.length);
                for (var i = 0; i < binary.length; i++) {
                    bytes[i] = binary.charCodeAt(i);
                }
                // Split into IV and data without spread operator
                var iv = new Uint8Array(12);
                var data = new Uint8Array(bytes.length - 12);
                for (var j = 0; j < 12; j++) {
                    iv[j] = bytes[j];
                }
                for (var k = 0; k < data.length; k++) {
                    data[k] = bytes[12 + k];
                }
                crypto.subtle.decrypt(
                    { name: 'AES-GCM', iv: iv as any }, // Use 'any' to bypass strict type check
                    key,
                    data as any // Use 'any' to bypass strict type check
                ).then(function (decrypted) {
                    var decryptedText = decoder.decode(decrypted);
                    resolve(decryptedText);
                }).catch(function (error) {
                    console.error('Decryption error:', error);
                    reject(error);
                });
            }).catch(function (error) {
                console.error('Key import error:', error);
                reject(error);
            });
        }).catch(function (error) {
            reject(error);
        });
    });
}

export const fetchDataOption = async (id: string) => {
    try {
        const params = { id: id };
        const responseOption = await fetchOptions(objectToQueryStringNullable(params));
        if (responseOption?.data.data && Array.isArray(responseOption.data.data)) {
            const result = responseOption.data.data.map(mapOptionData);
            return result;
        } else {
            return [];
        }
    } catch (error) {
        console.error("Failed to fetch relevant option data:", error);
        return [];
    } finally {
    }
};

export const mapUserData = (data: any): User => ({
    id: data.id ?? null,
    full_name: data.full_name ?? null,
    balance: data.balance ?? "0",
    account_no: data.account_no ?? null,
    account_type: data.account_type ?? null,
});

export const mapOptionData = (data: any): Option => ({
    id: data.id ?? null,
    name: data.name ?? null,
    label: data.label ?? null,
    description: data.description ?? null,
    image: data.image ?? null,
});

export const mapBalanceData = (data: any): Balance => ({
    full_name: data.full_name ?? null,
    date: data.date ?? null,
    account_no: data.account_no ?? null,
    account_type: data.account_type ?? null,
    balance: data.balance ?? null,
});

export const mapTransferData = (data: any): Transfer => ({
    nama_pengirim: data.nama_pengirim ?? null,
    nama_penerima: data.nama_penerima ?? null,
    date: data.date ?? null,
});

export const mapTopUpData = (data: any): TopUp => ({
    full_name: data.full_name ?? null,
    date: data.date ?? null,
    amount: data.amount ?? null,
});

export const mapPaginationData = (data: any): Pagination => ({
    page: data.page ?? null,
    lastPage: data.lastPage ?? null,
    total: data.total ?? null
});

export function formatDecimalString(decimalString: string): string {
    const number = parseFloat(decimalString);

    const [integerPart, decimalPart] = number.toString().split('.');

    const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    return `${formattedIntegerPart},${decimalPart || '00'}`;
}

export function formatNumberToIDR(value: string) {
    if (!value) return "";
    // Remove all non-digit and non-comma characters
    let cleaned = value.replace(/[^0-9,]/g, "");
    // Split integer and decimal parts
    const parts = cleaned.split(",");
    // Format integer part with thousand separators (.)
    let integerPart = parts[0];
    let decimalPart = parts[1] || "";
    // Add thousand separators
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    // Limit decimal part to 2 digits
    if (decimalPart.length > 2) {
        decimalPart = decimalPart.slice(0, 2);
    }
    return decimalPart ? `${integerPart},${decimalPart}` : integerPart;
}

export function parseFormattedToRaw(value: string) {
    return value.replace(/\./g, "").replace(/,/g, ".");
};


export const transformUser = (user: any): Option => ({
    id: user.id,
    name: user.account_no,
    label: user.full_name,

})
export const fetchUserAsOption = async () => {
    try {
        const responseOption = await fetchCustomerList();
        if (responseOption?.data.data && Array.isArray(responseOption.data.data)) {
            const result = responseOption.data.data.map(transformUser);
            return result;
        } else {
            return [];
        }
    } catch (error) {
        console.error("Failed to fetch relevant option data:", error);
        return [];
    } finally {
    }
};