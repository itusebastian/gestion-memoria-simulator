var programas = [
    {
        "nombre": "Safari",
        "tamano": 1048576,
        "bss": 120,
        "data": 210000,
        "text": 820000,
    },
    {
        "nombre": "Pages",
        "tamano": 1048576 * 2,
        "bss": 180,
        "data": 400000,
        "text": 1700000,
    },
    {
        "nombre": "Xcode",
        "tamano": 1048576 * 4,
        "bss": 500,
        "data": 1500000,
        "text": 2700000,
    },
    {
        "nombre": "Final Cut Pro",
        "tamano": 1048576 * 3,
        "bss": 350,
        "data": 1100000,
        "text": 2000000,
    },
    {
        "nombre": "GarageBand",
        "tamano": 1048576 * 2,
        "bss": 200,
        "data": 600000,
        "text": 1400000,
    },
    {
        "nombre": "Visual Studio Code",
        "tamano": 1048576 * 1.5,
        "bss": 150,
        "data": 350000,
        "text": 1100000,
    },
    {
        "nombre": "iMovie",
        "tamano": 1048576 * 2,
        "bss": 160,
        "data": 500000,
        "text": 1200000,
    }
];

var particionesVariables = [1, 2, 2, 3, 3, 4]
var gestionMemoria = 0;
var programasEjecutados = [];
var segmentosEjecutados = [];
var programasTTP = [];
var memoria = new Memoria();
var idProceso = 0;
var colores = [];

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function llenarProgramas() {
    document.getElementById("programas").replaceChildren();
    for (let i = 0; i < programas.length; i++) {
        const programa = programas[i];

        var fila = "<tr><td>" + programa.nombre + "</td><td>" + programa.text + "</td><td>" + programa.data + "</td><td>" + programa.bss + "</td><td>" + programa.tamano + "</td><td><button name='btnEncender' class='btn btnEncender' value='" + i + "' disabled title='Encender'><span style='font-size:1.2em;'>⏻</span></button></td></tr>";

        var btn = document.createElement("TR");
        btn.innerHTML = fila;
        document.getElementById("programas").appendChild(btn);
    };
}

function mostrarTablasSeg(mostrar) {
    if (mostrar) {
        $("#tituloEjecutados").hide();
        $(".contenedorTablaEjecutados").hide();

        $("#tituloSegmentacion").show();
        $("#tablaSegemetnos").show();
        $(".contenedorTablaSegmentos").show();
        $("#tituloLibres").show();
        $("#tablaLibres").show();
        $(".contenedorTablaLibres").show();

        $("#tituloMarcos").hide();
        $("#tablaMarcos").hide();
        $(".contenedorTablaMarcos").hide();
        $("#tituloTPP").hide();
        $("#tablaTPP").hide();
        $(".contenedorTablaTPP").hide();
    } else {
        $("#tituloEjecutados").show();
        $(".contenedorTablaEjecutados").show();

        $("#tituloSegmentacion").hide();
        $("#tablaSegemetnos").hide();
        $(".contenedorTablaSegmentos").hide();
        $("#tituloLibres").hide();
        $("#tablaLibres").hide();
        $(".contenedorTablaLibres").hide();
    }
}

function mostrarTablasPag(mostrar) {
    if (mostrar) {
        $("#tituloEjecutados").hide();
        $(".contenedorTablaEjecutados").hide();

        $("#tituloSegmentacion").hide();
        $("#tablaSegemetnos").hide();
        $(".contenedorTablaSegmentos").hide();
        $("#tituloLibres").hide();
        $("#tablaLibres").hide();
        $(".contenedorTablaLibres").hide();

        $("#tituloMarcos").show();
        $("#tablaMarcos").show();
        $(".contenedorTablaMarcos").show();
        $("#tituloTPP").show();
        $("#tablaTPP").show();
        $(".contenedorTablaTPP").show();
    } else {
        $("#tituloEjecutados").show();
        $(".contenedorTablaEjecutados").show();

        $("#tituloMarcos").hide();
        $("#tablaMarcos").hide();
        $(".contenedorTablaMarcos").hide();
        $("#tituloTPP").hide();
        $("#tablaTPP").hide();
        $(".contenedorTablaTPP").hide();
    }
}

function removeItemFromArr(arr, item) {
    return arr.filter(function (e) {
        return e.id != item;
    });
};

function llenarEjecutados() {
    document.getElementById("ejecucion").replaceChildren();
    for (let i = 0; i < programasEjecutados.length; i++) {
        const programa = programasEjecutados[i];

        var fila = "<tr><td>" + programa.id + "</td><td>" + programa.nombre + "</td><td>" + programa.tamano + "</td><td>0x" + programa.posicion + "</td><td><button class='btn btnApagar' value='" + i + "' title='Apagar'><span style='font-size:1.2em;'>⏻</span></button></td></tr>";

        var btn = document.createElement("TR");
        btn.innerHTML = fila;
        document.getElementById("ejecucion").appendChild(btn);
    };
}

function llenarMarcos() {
    document.getElementById("marcos").replaceChildren();

    var segmentos = memoria.getSegmentos();
    for (let i = 0; i < segmentos.length; i++) {

        var libre = 1;
        if (segmentos[i].proceso == null) {
            libre = 0;
        }

        const idHex = componentToHex(i);
        var fila = "<tr><td>" + idHex + "</td><td>0x" + idHex + segmentos[i].posicion + "</td><td>" + libre + "</td></tr>";

        var btn = document.createElement("TR");
        btn.innerHTML = fila;
        document.getElementById("marcos").appendChild(btn);
    };
}

function llenarLibres() {
    document.getElementById("libres").replaceChildren();

    var segmentos = memoria.getSegmentosLibres();
    for (let i = 0; i < segmentos.length; i++) {
        var fila = "<tr><td>" + segmentos[i].tamano + "</td><td>0x" +  segmentos[i].posicion + "</td></tr>";

        var btn = document.createElement("TR");
        btn.innerHTML = fila;
        document.getElementById("libres").appendChild(btn);
    };
}

function llenarSegmentos() {
    document.getElementById("segmentos").replaceChildren();


    document.getElementById("ejecucion").replaceChildren();
    for (let i = 0; i < segmentosEjecutados.length; i++) {
        const programa = segmentosEjecutados[i];

        var fila = "<tr><td>" + programa.id + "</td><td>" + programa.nombre +  "</td><td>" + programa.parte + "</td><td>" +programa.tamano + "</td><td>0x" + programa.posicion + "</td><td><button class='btn btnApagar'" + " value='" + i + "'>Apagar</button>" + "</td></tr>";

        var btn = document.createElement("TR");
        btn.innerHTML = fila;
        document.getElementById("segmentos").appendChild(btn);
    };
}

function llenarTpps(){
    document.getElementById("tpps").replaceChildren();

    for (let i = 0; i < programasTTP.length; i++) {
        const programa = programasTTP[i];
        console.log(programasTTP);
        var marco = determinarMarco(programa.nombre, programa.id);

        var fila = "<tr><td>" + programa.id + "</td><td>" + programa.nombre + "</td><td>" + programa.pagina + "</td><td>"+ componentToHex(marco) +"</td><td>"+"<button class='btn btnApagar'" + " value='" + i + "'>Apagar</button>" + "</tr>";
        
        var btn = document.createElement("TR");
        btn.innerHTML = fila;
        document.getElementById("tpps").appendChild(btn);
    }
}

function determinarMarco(nombreProceso, idProceso){
    
    var segmentos = memoria.getSegmentos();
    var marco = 0;

    for (let index = 0; index < segmentos.length; index++){
        if(segmentos[index].proceso == null){
            console.log("null");
        }else{
            if (nombreProceso === segmentos[index].proceso.nombre && idProceso === segmentos[index].proceso.id){
                return marco = index;
            }
        }
    } 
    
}

function limpiarMemoria() {
    var canvas = document.getElementById("memoria");
    canvas.width = canvas.width;
}

function dibujarProceso(posicionHex, nombre, tamano, id) {
    var canvas = document.getElementById("memoria");
    if (canvas.getContext) {
        var ctx = canvas.getContext("2d");
        /// 51px = 1048576 bytes = 1 MiB
        /// 51*tamaño/1024*1024
        var posicion = 51 * parseInt(componentToHex(posicionHex), 16) / 1048576;
        var altura = 51 * tamano / 1048576;

        // Fondo
        var colorId = null;
        for (let index = 0; index < this.colores.length; index++) {
            const element = this.colores[index];
            if (element.id == id) {
                colorId = index
            }
        }

        if (colorId != null) {
            var r = this.colores[colorId].r;
            var g = this.colores[colorId].g;
            var b = this.colores[colorId].b;
        } else {
            var r = Math.round(Math.random() * 255);
            var g = Math.round(Math.random() * 255);
            var b = Math.round(Math.random() * 255);
            this.colores.push({ "id": id, "r": r, "g": g, "b": b });
        }

        ctx.fillStyle = "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
        ctx.fillRect(0, posicion, 300, altura);

        // Texto
        ctx.font = "20px Arial";
        ctx.textAlign = "center";

        var o = Math.round(((parseInt(r) * 299) + (parseInt(g) * 587) + (parseInt(b) * 114)) / 1000);
        if (o > 125) {
            ctx.fillStyle = 'black';
        } else {
            ctx.fillStyle = 'white';
        }

        ctx.strokeRect(0, posicion, 300, altura);
        ctx.fillText(nombre, 150, posicion + altura / 1.5, 300);
    }
}

function dibujarMemoria(numParticiones, tipoGestionMemoria) {
    var canvas = document.getElementById("memoria");
    if (canvas.getContext) {

        var ctx = canvas.getContext("2d");
        if (tipoGestionMemoria == 4 || tipoGestionMemoria == 6) {
            var valor = 765 / numParticiones;

            for (let index = 0; index < numParticiones; index++) {
                ctx.rect(0, index * valor + 51, 300, valor);
                ctx.stroke();
            }
        } else if (tipoGestionMemoria == 3) {
            var cont = 0;

            for (let index = 0; index < numParticiones; index++) {
                ctx.rect(0, cont * 51 + 51, 300, 51 * particionesVariables[index]);
                ctx.stroke();
                cont = cont + particionesVariables[index];
            }
        }

    }
}

function activarBotones(botones) {
    for (let i = 0; i < botones.length; i++) {
        var boton = botones[i]
        boton.disabled = false;
    }
}

function agregarListener() {
    //// Empezar el programa 
    var btnEmpezar = document.getElementById("empezar");
    btnEmpezar.addEventListener("click", function () {
        var seleccionAjuste = $('input:radio[name=ordenamiento]:checked').val();
        var botones = document.getElementsByName("btnEncender");
        memoria = new Memoria(1048576 * 15, null);
        programasEjecutados = [];
        llenarEjecutados();
        idProceso = 0;

        switch (gestionMemoria) {

            case 1:
                if (seleccionAjuste != undefined) {
                    limpiarMemoria();
                    dibujarMemoria(1, 4);

                    dibujarProceso("000000", "SO", 1048576);
                    activarBotones(botones);
                } else {
                    mostrarError("Debe seleccionar un tipo de ajuste");
                }
                break;
            case 2:
                if (seleccionAjuste != undefined) {
                    limpiarMemoria();
                    dibujarMemoria(1, 4);

                    dibujarProceso("000000", "SO", 1048576);
                    activarBotones(botones);
                } else {
                    mostrarError("Debe seleccionar un tipo de ajuste");
                }
                break;
            case 3:
                if (seleccionAjuste != undefined) {
                    limpiarMemoria();
                    dibujarMemoria(particionesVariables.length, gestionMemoria);

                    memoria.setMetodoVariable(particionesVariables);

                    dibujarProceso("000000", "SO", 1048576);
                    activarBotones(botones);
                } else {
                    mostrarError("Debe seleccionar un tipo de ajuste");
                }
                break;
            case 4:
                var cantParticion = document.getElementsByName("cantidadParticiones");
                limpiarMemoria();
                if (cantParticion[0].value != "") {
                    dibujarMemoria(cantParticion[0].value, gestionMemoria);

                    memoria.setMetodoFija(parseInt(cantParticion[0].value));

                    dibujarProceso("000000", "SO", 1048576);
                    activarBotones(botones);
                } else {
                    mostrarError("Debe ingresar el número de particiones");
                }
                break;
            case 5:
                if (seleccionAjuste != undefined) {
                    limpiarMemoria();
                    dibujarMemoria(1, 4);

                    dibujarProceso("000000", "SO", 1048576);
                    activarBotones(botones);
                } else {
                    mostrarError("Debe seleccionar un tipo de ajuste");
                }
                break;
            case 6:
                var tamPagina = document.getElementsByName("tamanoPagina");
                const mega = 1048576;
                if (tamPagina[0].value != "") {
                    limpiarMemoria();

                    var cantParticiones = (mega * 15) / tamPagina[0].value;

                    dibujarMemoria(cantParticiones, gestionMemoria);
                    memoria.setMetodoFija(parseInt(cantParticiones));

                    dibujarProceso("000000", "SO", 1048576);
                    activarBotones(botones);
                } else {
                    mostrarError("Debe llenar el tamaño de la pagina");
                }
                break;
            default:
                mostrarError("Debe seleccionar un método de gestión de memoria");
                limpiarMemoria();
        }
        this.colores = [];
    })

    //// Acción para crear un programa
    var btnNuevoPrograma = document.getElementById("nuevoPrograma");
    btnNuevoPrograma.addEventListener("click", function () {
        var name = prompt("Nombre del programa");
        var text = parseInt(prompt("Tamaño del código"));
        var data = parseInt(prompt("Tamaño de datos inicializados"));
        var bss = parseInt(prompt("Tamaño de datos sin inicializar"));

        if (name != "" && !isNaN(text) && !isNaN(data) && !isNaN(bss)) {
            programas.push({
                "nombre": name,
                "text": text,
                "data": data,
                "bss": bss,
                "tamano": data + text + bss,
            });
            llenarProgramas();
        } else {
            mostrarError("Error en el llenado del formulario");
        }
    }, false)


    //// Acción para ejecutar programas existentes
    $('#tablaProgramas').unbind('click');
    $('#tablaProgramas').on('click', '.btnEncender', function (event) {
        var $row = $(this).closest("tr");
        var $tds = $row.find("td");

        ejecutarProceso($tds);
    });

    //// Detener programas en ejecución segmentacion
    $('#tablaSegemetnos').on('click','.btnApagar', function (event){
        limpiarMemoria();
        dibujarMemoria(1, 4);
        dibujarProceso("000000", "SO", 1048576);

        var $row = $(this).closest("tr"),
            $tds = $row.find("td");

        memoria.eliminarProcesoPag($tds[0].textContent);

        segmentosEjecutados = removeItemFromArr(segmentosEjecutados, $tds[0].textContent);

        llenarSegmentos();
        llenarLibres();

        dibujarProcesos();
    })

    //// Detener programas en ejecución paginación
    $('#tablaTPP').on('click','.btnApagar', function (event) {
        limpiarMemoria();

        var tamPagina = document.getElementsByName("tamanoPagina");
        const mega = 1048576;
        var cantParticiones = (mega * 15) / tamPagina[0].value;

        dibujarMemoria(cantParticiones, gestionMemoria);


        dibujarProceso("000000", "SO", 1048576);

        var $row = $(this).closest("tr"),
            $tds = $row.find("td");

        memoria.eliminarProcesoPag($tds[0].textContent);

        programasTTP = removeItemFromArr(programasTTP, $tds[0].textContent);

        for (let index = 0; index < programasTTP.length; index++) {
            const element = programasTTP[index];
            var proceso = memoria.getProceso(element.id);
            element.posicion = proceso[0].posicion;
        }

        llenarMarcos();

        llenarTpps();

        dibujarProcesos();
    })

    //// Detener prorgamas en ejecución
    $('#tablaEjecutados').unbind('click');
    $('#tablaEjecutados').on('click', '.btnApagar', function (event) {
        limpiarMemoria();
        switch (gestionMemoria) {
            case 1:
                dibujarMemoria(1, 4);
                break;
            case 2:
                dibujarMemoria(1, 4);
                break;
            case 3:
                dibujarMemoria(particionesVariables.length, gestionMemoria);
                break;
            case 4:
                var cantParticion = document.getElementsByName("cantidadParticiones");
                dibujarMemoria(cantParticion[0].value, gestionMemoria);
                break;
        }
        dibujarProceso("000000", "SO", 1048576);

        var $row = $(this).closest("tr"),
            $tds = $row.find("td");

        memoria.eliminarProceso($tds[0].textContent, $tds[1].textContent, gestionMemoria);

        programasEjecutados = removeItemFromArr(programasEjecutados, $tds[0].textContent);

        for (let index = 0; index < programasEjecutados.length; index++) {
            const element = programasEjecutados[index];
            var proceso = memoria.getProceso(element.id);
            element.posicion = proceso[0].posicion;
        }

        llenarEjecutados();
        dibujarProcesos();
    });

    //// Selección de método de gestión de memoria
    var optMetodo = document.getElementById("selecProgramas");
    optMetodo.addEventListener("click", function () {
        var ordenamiento = document.getElementsByName("ordenamiento");
        switch (optMetodo.value) {
            case "1":
                console.log("Particionamiento Dinamico Con Compactacion");
                gestionMemoria = 1;
                $("#contMetodos").hide();
                $(".ordenamiento").show();
                mostrarTablasPag(false);
                mostrarTablasSeg(false);

                ordenamiento[0].disabled = false;
                ordenamiento[1].disabled = false;
                ordenamiento[2].disabled = false;
                break;
            case "2":
                console.log("Particionamiento Dinamico Sin Compactacion");
                gestionMemoria = 2;
                $("#contMetodos").hide();
                $(".ordenamiento").show();
                mostrarTablasPag(false);
                mostrarTablasSeg(false);

                ordenamiento[0].disabled = false;
                ordenamiento[1].disabled = false;
                ordenamiento[2].disabled = false;
                break;
            case "3":
                console.log("Particionamiento Estatico Variable");
                gestionMemoria = 3;
                $("#contMetodos").show();
                $(".ordenamiento").show();
                mostrarTablasPag(false);
                mostrarTablasSeg(false);

                document.getElementById("contMetodos").replaceChildren();
                for (let i = 0; i < particionesVariables.length; i++) {

                    var fila = "<li>" + particionesVariables[i] + " Megabit" + "</li>";
                    var btn = document.createElement("LI");
                    btn.innerHTML = fila;
                    document.getElementById("contMetodos").appendChild(btn);
                }

                ordenamiento[0].disabled = false;
                ordenamiento[1].disabled = false;
                ordenamiento[2].disabled = false;

                break;
            case "4":
                console.log("Particionamiento Estatico Fijo");
                gestionMemoria = 4;
                $(".ordenamiento").hide();
                $("#contMetodos").show();
                mostrarTablasPag(false);
                mostrarTablasSeg(false);

                document.getElementById("contMetodos").replaceChildren();
                const particion = "<input type='text' name='cantidadParticiones' id = 'cantidadParticiones' autocomplete='off' placeholder='Número de particiones'>" + "</input>";
                var btn = document.createElement("DIV");
                btn.innerHTML = particion;
                document.getElementById("contMetodos").appendChild(btn);

                ordenamiento[0].disabled = true;
                ordenamiento[1].disabled = true;
                ordenamiento[2].disabled = true;

                break;
            case "5":
                console.log("Segmentacion");
                gestionMemoria = 5;
                $("#contMetodos").hide();
                $(".ordenamiento").show();
                mostrarTablasPag(false);
                mostrarTablasSeg(true);

                ordenamiento[0].disabled = false;
                ordenamiento[1].disabled = false;
                ordenamiento[2].disabled = false;

                break;
            case "6":
                console.log("Paginacion");
                gestionMemoria = 6;
                $("#contMetodos").show();
                $(".ordenamiento").hide();
                mostrarTablasSeg(false);
                mostrarTablasPag(true);

                document.getElementById("contMetodos").replaceChildren();
                const confPagina = "<div>Tamaño de la pagina</div>" +
                    "<input type='text' name='tamanoPagina' id='tamanoPagina' autocomplete='off' placeholder='Tamano en Bytes'>" + "</input>";
                var btn = document.createElement("DIV");
                btn.innerHTML = confPagina;
                document.getElementById("contMetodos").appendChild(btn);

                ordenamiento[0].disabled = true;
                ordenamiento[1].disabled = true;
                ordenamiento[2].disabled = true;
                break;
            default:
                $(".ordenamiento").hide();
                $("#contMetodos").hide();
                console.log("No se ha seleccionado el método de gestión de memoria");
                break;

        }
    }, false);
}

function ejecutarProceso(proceso) {
    var seleccionAjuste = $('input:radio[name=ordenamiento]:checked').val();

    var resultado = memoria.insertarProceso({
        "id": idProceso + 1, "bss": proceso[3].textContent,
        "data": proceso[2].textContent,
        "text": proceso[1].textContent,
        "nombre": proceso[0].textContent, "tamano": proceso[4].textContent
    }, gestionMemoria, seleccionAjuste);

    if (resultado == 1) {
        mostrarError("Memoria insuficiente");
        return 0;
    }

    if (resultado == 0) {
        mostrarError("Memoria llena");
        return 0;
    }

    if (gestionMemoria != 5 && gestionMemoria != 6) {
        var procesoGuardado = memoria.getProceso(idProceso + 1);

        idProceso += 1;
        programasEjecutados.push({
            "id": idProceso, "nombre": proceso[0].textContent, "tamano": proceso[4].textContent, "posicion": procesoGuardado[0].posicion
        });
        llenarEjecutados();
    }

    if (gestionMemoria == 5) {
        var procesoGuardado = memoria.getProceso(idProceso + 1);

        idProceso += 1;
        procesoGuardado.forEach(procesog => {
            var parte = procesog.proceso.nombre.split(" - ")
            segmentosEjecutados.push({"id": idProceso, "nombre": proceso[0].textContent, "parte": parte[1], "tamano": procesog.tamano, "posicion": procesog.posicion});
        });
        llenarSegmentos();
        llenarLibres();
    }

    if (gestionMemoria == 6) {
        var procesoGuardado = memoria.getProceso(idProceso + 1);
        idProceso += 1;
        llenarMarcos();

        for(let index = 0; index < procesoGuardado.length; index++ ){
            programasTTP.push({"id": procesoGuardado[index].proceso.id, "nombre": procesoGuardado[index].proceso.nombre, "pagina": index});
        }
        llenarTpps();
    }

    dibujarProcesos();
}

function dibujarProcesos() {
    var memoriaEstatica = memoria.getSegmentos();

    memoriaEstatica.forEach(segmento => {
        if (segmento.proceso !== null) {
            dibujarProceso(segmento.posicion, "(" + segmento.proceso.id + ")" + segmento.proceso.nombre, segmento.proceso.tamano, segmento.proceso.id);
        }
    });
}

// Sistema de errores personalizados
function mostrarError(mensaje) {
    var errorBox = document.getElementById('errorBox');
    if (!errorBox) return;
    errorBox.innerHTML = mensaje + '<button onclick="ocultarError()">Cerrar</button>';
    errorBox.style.display = 'block';
}

function ocultarError() {
    var errorBox = document.getElementById('errorBox');
    if (!errorBox) return;
    errorBox.style.display = 'none';
}

function init() {
    llenarProgramas();
    agregarListener();
}

init();