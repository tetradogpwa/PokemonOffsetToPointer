const MAXLENGTH = 4 * 2; //4 bytes y cada byte son dos char
var dieciseisMegas = Integer.parseInt("1000000", 16);
var trentaidosMegas = dieciseisMegas * 2;
const ESMAYORDEDECISEISMEGAS = 0x1;




function CalculaOffset(pointer) {
    //quito espacios
    //valido
    //arreglo la string para hacer un caso
    //hacer la conversión
    var offset = "";
    var acabaEn8;
    try {
        pointer = pointer.replaceAll(" ", "");
        if (PointerEsValido(pointer)) {
            pointer = ArreglaPointer(pointer);
            // XX YY ZZ 08 o 09 Pointer
            acabaEn8 = pointer.substring(pointer.length() - 1, pointer.length()).equals("8");
            //ZZYYXX offset y si acaba en 09 se le suma 0x FF FF FF al offset
            offset = pointer.substring(4, 6) + pointer.substring(2, 4) + pointer.substring(0, 2);
            if (!acabaEn8) {
                //le sumo 0x FF FF FF al offset
                offset = Integer.toHexString(dieciseisMegas + Integer.parseInt(offset, 16));
            }

        }
    } catch {
        offset = "";
    }
    return offset.toUpperCase();
}







function CalculaPointer(offset) {
    //quito espacios
    //valido
    //arreglo la string para hacer un caso
    //hacer la conversión

    var esMayor;
    var ptr = "";
    try {
        offset = offset.replaceAll(" ", "");
        if (OffsetEsValido(offset)) {
            offset = ArreglaOffset(offset);
            //ZZYYXX offset y si empieza en 01 y tiene seis char mas pues se le resta 0x FF FF FF al offset y acaba en 09
            esMayor = offset.substring(0, 2).equals("01");
            // XX YY ZZ 08 o 09 Pointer
            ptr = offset.substring(MAXLENGTH - 2, MAXLENGTH) + offset.substring(MAXLENGTH - 4, MAXLENGTH - 2) + offset.substring(MAXLENGTH - 6, MAXLENGTH - 4);
            if (esMayor) {
                ptr += "09";
            } else {
                ptr += "08";
            }
        }
    } catch {
        ptr = "";
    }
    return ptr.toUpperCase();
}

function OffsetEsValido(offset) {
    var esValido = offset.matches("-?[0-9a-fA-F]+");
    if (esValido) {
        esValido = Integer.parseInt(offset, 16) < trentaidosMegas;

    }
    return esValido; //si es menor o igual de 01 FF FF FF es valido
}

function ArreglaOffset(offset) {
    offset = PadLeft(offset, MAXLENGTH, '0');

    return offset;
}


function PointerEsValido(ptr) {
    const End8 = "" + 8;
    const End9 = 9 + "";
    var valido = false;
    var esMasPequeño;
    var lastChar;

    if (ptr.matches("-?[0-9a-fA-F]+") && ptr.length() <= MAXLENGTH) {

        esMasPequeño = ptr.length() < MAXLENGTH - 1;
        valido = esMasPequeño;

        if (!esMasPequeño) {
            lastChar = ptr.substring(ptr.length() - 1);
            valido = lastChar.equals(End8) || lastChar.equals(End9);
        }
    }
    return valido; //si mide la longitud maxima mirar si acaba en 8 o 9
}

function ArreglaPointer(pointer) {
    var poner08 = true;
    if (pointer.length() > MAXLENGTH - 2) {
        poner08 = pointer.substring(pointer.length() - 1, pointer.length()).equals("8");
        pointer = pointer.substring(0, MAXLENGTH - 2);
    } else {
        pointer = PadLeft(pointer, MAXLENGTH - 2, '0');
    }
    if (poner08) {
        pointer += "08";
    } else {
        pointer += "09";
    }

    return pointer;
}



function intToByteArray( /*int*/ int) {
    // we want to represent the input as a 4-bytes array
    var byteArray = [0, 0, 0, 0];
    var byte;
    for (var index = 0; index < byteArray.length; index++) {

        byte = long & 0xff;
        byteArray[index] = byte;
        long = (long - byte) / 256;
    }

    return byteArray;
};

function bytesToInt(int_bytes) {
    var value = 0;
    for (var i = int_bytes.length - 1; i >= 0; i--) {
        value = (value * 256) + int_bytes[i];
    }

    return value;
};

function byteArrayToHex(array) {
    var s = '0x';
    array.forEach(function(byte) {
        s += ('0' + (byte & 0xFF).toString(16)).slice(-2);
    });
    return s;
}

function hexStringToByteArray(s) {
    var len = s.length();
    var data = new byte[len / 2];
    var i;
    for (i = 0; i < len; i += 2) {
        data[i / 2] = (byte)((Character.digit(s.charAt(i), 16) << 4) +
            Character.digit(s.charAt(i + 1), 16));
    }
    return data;
}

function PadLeft(string, maxLenght, caracter) {
    var str = "";
    var i;
    for (i = string.length(); i < maxLenght; i++) {
        str += caracter;
    }
    str += string;

    return str;
}

function PadRight(string, maxLenght, caracter) {
    var str = string;
    var i;
    for (i = string.length(); i < maxLenght; i++) {
        str += caracter;
    }
    return str;
}