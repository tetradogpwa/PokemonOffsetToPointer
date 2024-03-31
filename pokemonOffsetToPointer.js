



function toPointer(offset){
    const LENGTH=6;

    let result='';
    if(offset.length==LENGTH){
        //leo de dos en dos
        for(let i=0;i<LENGTH;i+=2){
            result+=offset[offset.length-i-2];
            result+=offset[offset.length-i-1];
         
        }
        result+='08';
    }

    return result;
}

function toOffset(pointer){
    const LENGTH=8;
    let result='';

    if(pointer.length == LENGTH){
        for(let i=2;i<LENGTH;i+=2){
            result+=pointer[pointer.length-i-2];
            result+=pointer[pointer.length-i-1];
        }
    }

    return result;

}
