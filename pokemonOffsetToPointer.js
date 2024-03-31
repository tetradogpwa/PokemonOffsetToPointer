const MAX_LENGTH = 8; // 4 bytes (cada byte son dos caracteres hexadecimales)
const SIXTEEN_MEGAS = 0x1000000;
const OFFSET_THRESHOLD = SIXTEEN_MEGAS * 2;
const POINTER_SUFFIX_8 = "08";
const POINTER_SUFFIX_9 = "09";

// Función para reemplazar todas las ocurrencias de una cadena en otra
// Se recomienda evitar modificar el prototipo de String y usar una función independiente
function replaceAll(text, find, replace) {
    return text.replace(new RegExp(find, 'g'), replace);
}

function calculateOffset(pointer) {
    try {
        pointer = pointer.replaceAll(" ", "");
        if (isPointerValid(pointer)) {
            pointer = fixPointerFormat(pointer);
            const endsWith8 = pointer.endsWith("8");
            let offset = pointer.substring(4, 6) + pointer.substring(2, 4) + pointer.substring(0, 2);
            if (!endsWith8) {
                offset = (SIXTEEN_MEGAS + parseInt(offset, 16)).toString(16);
            }
            return offset.toUpperCase();
        }
    } catch (error) {
        console.error('Error calculating offset:', error);
    }
    return "";
}

function calculatePointer(offset) {
    try {
        offset = replaceAll(offset, " ", "");
        if (isOffsetValid(offset)) {
            offset = fixOffsetFormat(offset);
            const isGreaterThanThreshold = parseInt(offset, 16) > OFFSET_THRESHOLD;
            let pointer = offset.substring(MAX_LENGTH - 2, MAX_LENGTH) +
                offset.substring(MAX_LENGTH - 4, MAX_LENGTH - 2) +
                offset.substring(MAX_LENGTH - 6, MAX_LENGTH - 4);
            pointer += isGreaterThanThreshold ? POINTER_SUFFIX_9 : POINTER_SUFFIX_8;
            return pointer.toUpperCase();
        }
    } catch (error) {
        console.error('Error calculating pointer:', error);
    }
    return "";
}

function isOffsetValid(offset) {
    const validHex = /^[0-9a-fA-F]+$/;
    if (validHex.test(offset) && offset.length <= MAX_LENGTH) {
        return parseInt(offset, 16) < OFFSET_THRESHOLD;
    }
    return false;
}

function fixOffsetFormat(offset) {
    return offset.padStart(MAX_LENGTH, '0');
}

function isPointerValid(pointer) {
    const validHex = /^[0-9a-fA-F]+$/;
    if (validHex.test(pointer) && pointer.length <= MAX_LENGTH) {
        return pointer.length < MAX_LENGTH - 1 || pointer.endsWith(POINTER_SUFFIX_8) || pointer.endsWith(POINTER_SUFFIX_9);
    }
    return false;
}

function fixPointerFormat(pointer) {
    if (pointer.length > MAX_LENGTH - 2) {
        const endsWith8 = pointer.endsWith("8");
        pointer = pointer.substring(0, MAX_LENGTH - 2);
        pointer += endsWith8 ? POINTER_SUFFIX_8 : POINTER_SUFFIX_9;
    } else {
        pointer = pointer.padStart(MAX_LENGTH - 2, '0');
    }
    return pointer;
}
