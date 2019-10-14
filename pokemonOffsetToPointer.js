const MAXLENGTH = 4 * 2; //4 bytes y cada byte son dos char
var dieciseisMegas = 1000000;
var trentaidosMegas = dieciseisMegas * 2;
const ESMAYORDEDECISEISMEGAS = 0x1;

String.prototype.ReplaceAll = function() {
    if (arguments.length < 2)
        throw "se necesitan dos argumentos, textoAEncontrar,reemplazarPor"
    text = this;
    while (text.includes(arguments[0])) {
        text = text.replace(arguments[0], arguments[1]);
    }
    return text;
}


function CalculaOffset(pointer) {
    //quito espacios
    //valido
    //arreglo la string para hacer un caso
    //hacer la conversión
    var offset = "";
    var acabaEn8;

    try {
        pointer = String(pointer).ReplaceAll(" ", "");
        if (PointerEsValido(pointer)) {
            pointer = ArreglaPointer(pointer);
            // XX YY ZZ 08 o 09 Pointer
            acabaEn8 = String(pointer).substring(String(pointer).length - 1, String(pointer).length) == "8";
            //ZZYYXX offset y si acaba en 09 se le suma 0x FF FF FF al offset
            offset = String(pointer).substring(4, 6) + String(pointer).substring(2, 4) + String(pointer).substring(0, 2);
            if (!acabaEn8) {
                //le sumo 0x FF FF FF al offset
                offset = (dieciseisMegas + parseInt(offset)).toString(16);
            }

        }
    } catch {
        offset = "";
    }
    return String(offset).toUpperCase();
}







function CalculaPointer(offset) {
    //quito espacios
    //valido
    //arreglo la string para hacer un caso
    //hacer la conversión

    var esMayor;
    var ptr = "";
    try {
        offset = offset.ReplaceAll(" ", "");
        if (OffsetEsValido(offset)) {
            offset = ArreglaOffset(offset);
            //ZZYYXX offset y si empieza en 01 y tiene seis char mas pues se le resta 0x FF FF FF al offset y acaba en 09
            esMayor = String(offset).substring(0, 2) == "01";
            // XX YY ZZ 08 o 09 Pointer
            ptr = String(offset).substring(MAXLENGTH - 2, MAXLENGTH) + String(offset).substring(MAXLENGTH - 4, MAXLENGTH - 2) + String(offset).substring(MAXLENGTH - 6, MAXLENGTH - 4);
            if (esMayor) {
                ptr += "09";
            } else {
                ptr += "08";
            }
        }
    } catch {
        ptr = "";
    }
    return String(ptr).toUpperCase();
}

function OffsetEsValido(offset) {
    var esValido = String(offset).match("-?[0-9a-fA-F]+");
    if (esValido) {
        esValido = parseInt(offset) < trentaidosMegas;

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

    if (String(ptr).match("-?[0-9a-fA-F]+") && String(ptr).length <= MAXLENGTH) {

        esMasPequeño = String(ptr).length < MAXLENGTH - 1;
        valido = esMasPequeño;

        if (!esMasPequeño) {
            lastChar = String(ptr).substring(String(ptr).length - 1);
            valido = lastChar == End8 || lastChar == End9;
        }
    }
    return valido; //si mide la longitud maxima mirar si acaba en 8 o 9
}

function ArreglaPointer(pointer) {
    var poner08 = true;
    if (String(pointer).length > MAXLENGTH - 2) {
        poner08 = String(pointer).substring(String(pointer).length - 1, String(pointer).length) == "8";
        pointer = String(pointer).substring(0, MAXLENGTH - 2);
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

function PadLeft(string, maxLenght, caracter) {
    var str = "";
    var i;
    for (i = String(string).length; i < maxLenght; i++) {
        str += caracter;
    }
    str += string;

    return str;
}