const miModulo = (() => {
  "use strict";

  Swal.fire({
    title: 'Custom animation with Animate.css',
    showClass: {
      popup: 'animate__animated animate__fadeInDown'
    },
    hideClass: {
      popup: 'animate__animated animate__fadeOutUp'
    }
  })
    let baraja = []; // Declaramos este arreglo vacio
    const cartasNormales = ["C", "D", "H", "S"], //Cartas de la varajas normales
          cartasReyes    = ["A", "J", "K", "Q"]; // Cartas de la barajas especiales

    let puntosJugadores = []; 

    const botonPedirCarta = document.querySelector("#boton__pedirCarta"),
             boton__pausa = document.querySelector("#boton__pausa");

    const mostraPuntosHtml  = document.querySelectorAll('small'),
          mostrarcartasHtml = document.querySelectorAll(".cartas_html");

//############################################################
    const inicializarJuego = (numeroJugadores = 2)=>{

        // baraja = ;
        baraja.push(estadoCartas())

        puntosJugadores = [];
        for (let i = 0; i < numeroJugadores; i++) {
            puntosJugadores.push(0)    
        }
        mostraPuntosHtml.forEach( elem => elem.innerText = 0 );
        mostrarcartasHtml.forEach( elem => elem.innerHTML = '' );

        botonPedirCarta.disabled   = false;
        boton__pausa.disabled = false;
    }

//####################################### Guardamos las cartas en un array ############################################
  
    const estadoCartas = () => {

    baraja = []
    for (let i = 2; i < 10; i++) {
      for (let cartasNormal of cartasNormales) {
        baraja.push(i + cartasNormal);
      }
    }
    for (let cartasNormal of cartasNormales) {
      for (let cartasRey of cartasReyes) {
        baraja.push(cartasRey + cartasNormal);
      }
    }
    baraja = _.shuffle(baraja); // Funcion que me permitira cada vez que le de al Boton revolver la baraja
    return baraja
  };
  
//##############################################################################################################  
  const pedirCarta = () => {
    if (baraja.length === 0) {
      throw "No hay cartas en la baraja";
    }
    return baraja.pop(); //Esto nos eliminara la carta ultima
  
  };


  const valorCarta = (carta) => {
    const valorCar = carta.substring(0, carta.length - 1);
    // isNaN me dice que si es un numero o no se debe cumplir algo con el operador ternario
    return (isNaN(valorCar)) ? 
           (valorCar === "A") ? 11 : 10 
            : valorCar * 1;
  };

  //
//##############################################################################################################  
   const acumularPuntos = ( carta, turno) => {
    puntosJugadores[turno] = puntosJugadores[turno]+ valorCarta(carta);
    mostraPuntosHtml[turno].innerText = puntosJugadores;
    return  puntosJugadores[turno];
   }
   //############################### Crear Cartas #################################################################
     const crearCartas = (carta , turno) => {
        const imgCarta = document.createElement("img");
        imgCarta.src = `assets/img-cartas/${carta}.png`;
        imgCarta.classList.add('img_scala');
        mostrarcartasHtml[turno].append(imgCarta);
     }
   
   
     const determinarGanador = () => {

         const [puntosminimos ,puntosComputadora] = puntosJugadores;
        setTimeout(() => {
            if (puntosComputadora === puntosminimos) {
              Swal.fire(" Es un empate nadien gana");
            } else if (puntosminimos > 21) {
              Swal.fire("Computadora gana");
            } else if (puntosComputadora > 21) {
              Swal.fire("Jugador gana");
            } else {
              Swal.fire(" Computadora gana");
            }
          }, 100);
     }
   
   
     //##############################################################################################################  
  const turnoMaquina = (puntosminimos) => {
    // Esto nos permite hacer la sumatoria del jugador
    let puntosComputadora = 0;
    do {
        const carta = pedirCarta();
        puntosComputadora = acumularPuntos(carta, puntosJugadores.length - 1);
        crearCartas(carta,puntosJugadores.length - 1);
    } while ((puntosComputadora < puntosminimos) && (puntosminimos <= 21));

    determinarGanador()
  };

 


  //Eventos para pedir cartas
  botonPedirCarta.addEventListener("click", () => {
    // Esto nos permite hacer la sumatoria del jugador
    const carta = pedirCarta();
    const puntosJugador = acumularPuntos(carta , 0);
    

    crearCartas(carta , 0)
    // Esto nos permite medir si se pasa o no de los 21 puntos
    if (puntosJugador > 21) {
      botonPedirCarta.disabled = true;
      boton__pausa.disabled = true;
      turnoMaquina(puntosJugador);

    } else if (puntosJugador === 21) {
      botonPedirCarta.disabled = true;
      boton__pausa.disabled = true;
      turnoMaquina(puntosJugador);
    }
  });

  boton__pausa.addEventListener("click", () => {
    botonPedirCarta.disabled = true;
    boton__pausa.disabled = true;
    turnoMaquina(puntosJugadores[0]);
  });

//   boton__nuevoJuego.addEventListener("click", () => {
   
//     inicializarJuego();

//   });
  
  return {
    nuevoJuego:inicializarJuego
   };

})();
