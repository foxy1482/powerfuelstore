
const generarNumAleatorio = ()=>
{
    const characters ='0a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6p7q8r9s0t1u2v3x4y5z6';
    const length = 12;
    let result = ' ';
    const charactersLength = characters.length;
    for ( let i = 1; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}
module.exports = generarNumAleatorio; 