function calcular(){


    //obtener valores de entrada (IP y Prefijo)
    var valido;
    var error;
    var ip = document.getElementById("ip").value;
    var prefix = parseInt(document.getElementById("prefix").value);
    var newFirstByte = parseInt(ip.split(".")[0]);
    for ( var i = 0 ; i <32; i+= 8){
        //Byte de la direccion IP
        var newByte = parseInt(ip.split(".")[i/8]);
        if(newByte>255){
            valido = false;
        }
    }
    if (prefix > 30 || newFirstByte > 255 || valido == false){
        alert("Datos invalidos");
        error=true;
    }
    if (newFirstByte >= 1 && newFirstByte <= 127){
        if(prefix<8){
            alert("prefijo menor a 8 en una clase A");
            error=true;
        }
    }
    
    if (newFirstByte >= 128 && newFirstByte <= 191){
        if(prefix<16){
            alert("prefijo menor a 16 en una clase B");
            error=true;
        }
    }

    if (newFirstByte >= 192 && newFirstByte <= 255){
        if(prefix<24){
            alert("prefijo menor a 24 en una clase C, D, E");
            error=true;
    }
    }
else{

    //Crear la mascara con el prefijo
    var mascara = "";
    for(var i = 0; i<32; i++){
        if(i<prefix){
            mascara += "1";
        }
        else{
            mascara += "0";
        }
    }

    console.log('Mascara Binaria = ' + mascara);

    //Calcular identificador de Red, Rango y Direccion Brooadcast

    var identificador = "";
    var rango = "";
    var broadcast = "";

    for ( var i = 0 ; i <32; i+= 8){
        //Byte de la direccion IP
        var byte = parseInt(ip.split(".")[i/8]);
        console.log('byte de la IP original = ' + byte);

        //Byte de la mascara binaria
        var mbyte = parseInt(mascara.substring(i, i+8), 2);
        console.log('byte de la Mascara de IP = ' + mbyte);

        //funcion AND para Hallar el identificador de Red
        var ibyte = byte & mbyte;
        console.log('Byte del identificador (AND) = ' + ibyte);

        //Establecer el Bradcast mediante el uso de una mascara binaria inversa con funcion NOT
        var fbyte = ibyte |  ~mbyte & 0xFF;
        console.log('Byte de Broadcast = ' + fbyte);
        //Separador de bytes "."

        if (i>0){
            identificador += ".";
            rango += ".";
            broadcast += ".";
        }
        //Convertir los resultados a String
        identificador += ibyte.toString();
        rango += ibyte.toString();
        broadcast += fbyte.toString();
        console.log('|||||||||||||||||||||||||||||||');
    }

    //Analisis De Usuarios Disponibles en la red restando a un exponente de 32 el valor del prefijo
    var usuarios = Math.pow(2, 32-prefix)-2;

    //Hallar el tipo de red haciendo uso del primer byte de la IP
    var firstByte = parseInt(ip.split(".")[0]);

    //Comparar el balos con los de la tabla mstrada en clase
    if (firstByte >= 1 && firstByte <= 127) {
    tipo = "Clase A";
    } else if (firstByte >= 128 && firstByte <= 191) {
    tipo = "Clase B";
    } else if (firstByte >= 192 && firstByte <= 223) {
    tipo = "Clase C";
    } else if (firstByte >= 224 && firstByte <= 239) {
    tipo = "Clase D (multicast)";
    } else if (firstByte >= 240 && firstByte <= 255) {
    tipo = "Clase E (experimental)";
    }

    //Inyectar los valores a los cuadros de dialogo en la secion de salida
    if (error){
        document.getElementById("identificador").value = "";
        document.getElementById("rango").value = "";
        document.getElementById("broadcast").value = "";
        document.getElementById("tipo").value = "";
        document.getElementById("usuarios").value = "";
    }
    else{
    document.getElementById("identificador").value = identificador;
    document.getElementById("rango").value = rango + " - " + broadcast;
    document.getElementById("broadcast").value = broadcast;
    document.getElementById("tipo").value = tipo;
    document.getElementById("usuarios").value = usuarios.toString();
    }
}
}
