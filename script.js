function calcular(){


    //obtener valores de entrada (IP y Prefijo)
    var ip = document.getElementById("ip").value;
    var prefix = parseInt(document.getElementById("prefix").value);

    //Verificar Errores

    var error;
    var mayor = false;

    //Verificar valores superiores a 255 en la IP
    for ( var i = 0 ; i <32; i+= 8){
        //Byte de la direccion IP
        var newByte = parseInt(ip.split(".")[i/8]);
        if(newByte>255){
            mayor = true;
        }

    //verificar Rangos de prefijo invalidos segun su clase
    if (newByte >= 1 && newByte <= 127){
        if(prefix<8){
            alert("prefijo menor a 8 en una clase A");
            error=true;
        }
    }
    
    else if (newByte >= 128 && newByte <= 191){
        if(prefix<16){
            alert("prefijo menor a 16 en una clase B");
            error=true;
        }
    }

    else if (newByte >= 192 && newByte <= 255){
        if(prefix<24){
            alert("prefijo menor a 24 en una clase C, D, E");
            error=true;
    }
    }
    }
    //Verificar cuando se detecte un prefijo mayor a 30
    if(prefix>30){
        alert("se detecto un prefijo mayor a 30, por favor cambiarlo");
        error = true;
    }

    //Comprobar si se encontraron fallos y asi mismo dar mensajes de error o evitar el calculo

    if(mayor){
        alert("Se detecto un valor de IP superior a 255, revise su IP");
    }
    
    if(mayor || error){
        document.getElementById("identificador").value = "";
        document.getElementById("rango").value = "";
        document.getElementById("broadcast").value = "";
        document.getElementById("tipo").value = "";
        document.getElementById("usuarios").value = "";
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
        //Crear un rango Real aceptado por el profe (xd)
        //Agregar 1 al último byte del rango
        var rangoArr = rango.split(".");
        rangoArr[3] = parseInt(rangoArr[3]) + 1;
        var newRango = rangoArr.join(".");
        
    
        //Restar 1 al último byte del broadcast
        var broadcastArr = broadcast.split(".");
        broadcastArr[3] = parseInt(broadcastArr[3]) - 1;
        var newBroadcast = broadcastArr.join(".");
    
    //Inyectar los valores a los cuadros de dialogo en la secion de salida
    document.getElementById("identificador").value = identificador;
    document.getElementById("broadcast").value = broadcast;
    document.getElementById("tipo").value = tipo;
    document.getElementById("usuarios").value = usuarios.toString();
    document.getElementById("rango").value = newRango + " - " + newBroadcast;
    }
}
