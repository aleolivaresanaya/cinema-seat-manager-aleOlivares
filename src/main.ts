const NUMERO_FILAS = 8;
const NUMERO_COLUMNAS = 10;

// Crea una matriz de 8 filas y 10 columnas con todos los asientos libres.
function inicializarSala(): number[][] {
  const sala: number[][] = [];

  for (let fila = 0; fila < NUMERO_FILAS; fila++) {
    const asientos: number[] = [];
    for (let columna = 0; columna < NUMERO_COLUMNAS; columna++) {
      asientos.push(0);
    }
    sala.push(asientos);
  }

  return sala;
}

// Muestra las filas y columnas numeradas, usando L para libre y X para ocupado.
function mostrarSala(sala: number[][]): void {
  let encabezado = "   ";
  for (let columna = 1; columna <= NUMERO_COLUMNAS; columna++) {
    encabezado += String(columna).padStart(3);
  }
  console.log(encabezado);

  for (let fila = 0; fila < sala.length; fila++) {
    let linea = String(fila + 1).padStart(2) + " ";
    for (let columna = 0; columna < sala[fila].length; columna++) {
      const simbolo = sala[fila][columna] === 0 ? "L" : "X";
      linea += simbolo.padStart(3);
    }
    console.log(linea);
  }
}

// Valida coordenadas desde 1 y reserva solo si el asiento esta disponible.
function reservarAsiento(sala: number[][], fila: number, columna: number): string {
  if (
    !Number.isInteger(fila) ||
    !Number.isInteger(columna) ||
    fila < 1 ||
    fila > NUMERO_FILAS ||
    columna < 1 ||
    columna > NUMERO_COLUMNAS
  ) {
    return "Posicion invalida: indica una fila entera del 1 al 8 y una columna entera del 1 al 10.";
  }

  if (sala[fila - 1][columna - 1] === 1) {
    return `El asiento de la fila ${fila}, columna ${columna} ya esta ocupado.`;
  }

  sala[fila - 1][columna - 1] = 1;
  return `Reserva confirmada: fila ${fila}, columna ${columna}.`;
}

// Devuelve una tupla con los conteos en el orden [ocupados, disponibles].
function contarAsientos(sala: number[][]): [number, number] {
  let ocupados = 0;
  let disponibles = 0;

  for (let fila = 0; fila < sala.length; fila++) {
    for (let columna = 0; columna < sala[fila].length; columna++) {
      if (sala[fila][columna] === 1) {
        ocupados++;
      } else {
        disponibles++;
      }
    }
  }

  return [ocupados, disponibles];
}

// Busca el primer par horizontal de asientos libres sin modificar la sala y devuelve sus posiciones desde 1 o null.
function buscarAsientosContiguos(sala: number[][]): number[][] | null {
  for (let fila = 0; fila < sala.length; fila++) {
    for (let columna = 0; columna < sala[fila].length - 1; columna++) {
      if (sala[fila][columna] === 0 && sala[fila][columna + 1] === 0) {
        return [[fila + 1, columna + 1], [fila + 1, columna + 2]];
      }
    }
  }

  return null;
}

// Compara un resultado real con el esperado e indica si la comprobacion paso.
function comprobarResultado(descripcion: string, real: string, esperado: string): void {
  const resultado = real === esperado ? "PASO" : "FALLO";
  console.log(`${resultado}: ${descripcion}. Real: ${real}. Esperado: ${esperado}.`);
}

// Muestra un escenario y comprueba sus conteos, su primer par y que buscar no cambie la sala.
function comprobarEscenario(
  nombre: string,
  sala: number[][],
  ocupadosEsperados: number,
  disponiblesEsperados: number,
  parEsperado: number[][] | null
): void {
  console.log(`\n${nombre} (L = libre, X = ocupado):`);
  mostrarSala(sala);

  const [ocupados, disponibles] = contarAsientos(sala);
  console.log(`Asientos ocupados: ${ocupados}`);
  console.log(`Asientos disponibles: ${disponibles}`);
  comprobarResultado("Cantidad de ocupados", String(ocupados), String(ocupadosEsperados));
  comprobarResultado("Cantidad de disponibles", String(disponibles), String(disponiblesEsperados));

  const salaAntes = JSON.stringify(sala);
  const parEncontrado = buscarAsientosContiguos(sala);
  if (parEncontrado !== null) {
    console.log(`Primer par contiguo disponible: ${JSON.stringify(parEncontrado)}`);
  } else {
    console.log("No hay dos asientos contiguos disponibles en la misma fila.");
  }
  comprobarResultado("Primer par libre", JSON.stringify(parEncontrado), JSON.stringify(parEsperado));
  comprobarResultado(
    "La busqueda no modifica la sala",
    String(JSON.stringify(sala) === salaAntes),
    "true"
  );
}

// Comprueba el mensaje de rechazo y que todos los asientos conserven sus valores.
function comprobarReservaRechazada(
  sala: number[][],
  fila: number,
  columna: number,
  mensajeEsperado: string
): void {
  const salaAntes = JSON.stringify(sala);
  const mensaje = reservarAsiento(sala, fila, columna);
  comprobarResultado(`Rechazo de reserva (${fila}, ${columna})`, mensaje, mensajeEsperado);
  comprobarResultado(
    `Reserva rechazada (${fila}, ${columna}) sin modificar la sala`,
    String(JSON.stringify(sala) === salaAntes),
    "true"
  );
}

// Conecta los botones con la misma matriz y las funciones usadas en consola.
function iniciarInterfaz(): void {
  const mapa = document.querySelector<HTMLDivElement>("#asientos");
  const columnas = document.querySelector<HTMLDivElement>("#columnas");
  const disponibles = document.querySelector<HTMLElement>("#disponibles");
  const ocupados = document.querySelector<HTMLElement>("#ocupados");
  const mensaje = document.querySelector<HTMLParagraphElement>("#mensaje");
  const buscar = document.querySelector<HTMLButtonElement>("#buscar-par");
  if (!mapa || !columnas || !disponibles || !ocupados || !mensaje || !buscar) {
    return;
  }

  const sala = inicializarSala();

  // Actualiza los botones existentes para no reconstruir el mapa tras cada reserva.
  function actualizarMapa(): void {
    const botones = mapa!.querySelectorAll<HTMLButtonElement>("button");
    for (let indice = 0; indice < botones.length; indice++) {
      const fila = Math.floor(indice / NUMERO_COLUMNAS);
      const columna = indice % NUMERO_COLUMNAS;
      const libre = sala[fila][columna] === 0;
      const boton = botones[indice];
      boton.textContent = `${columna + 1}\n${libre ? "L" : "X"}`;
      boton.disabled = !libre;
      boton.setAttribute("aria-label", `Fila ${fila + 1}, columna ${columna + 1}, ${libre ? "libre" : "ocupado"}`);
      boton.classList.remove("asiento-sugerido");
    }
    const conteos = contarAsientos(sala);
    ocupados!.textContent = String(conteos[0]);
    disponibles!.textContent = String(conteos[1]);
  }

  const etiquetaFila = document.createElement("span");
  etiquetaFila.textContent = "F/C";
  etiquetaFila.className = "coordenada";
  columnas.append(etiquetaFila);
  for (let columna = 1; columna <= NUMERO_COLUMNAS; columna++) {
    const etiqueta = document.createElement("span");
    etiqueta.textContent = String(columna);
    etiqueta.className = "coordenada";
    columnas.append(etiqueta);
  }

  for (let fila = 0; fila < NUMERO_FILAS; fila++) {
    const etiqueta = document.createElement("span");
    etiqueta.textContent = String(fila + 1);
    etiqueta.className = "coordenada";
    etiqueta.setAttribute("aria-label", `Fila ${fila + 1}`);
    mapa.append(etiqueta);
    for (let columna = 0; columna < NUMERO_COLUMNAS; columna++) {
      const boton = document.createElement("button");
      boton.type = "button";
      boton.className = "asiento";
      boton.addEventListener("click", () => {
        mensaje.textContent = reservarAsiento(sala, fila + 1, columna + 1);
        actualizarMapa();
      });
      mapa.append(boton);
    }
  }

  buscar.addEventListener("click", () => {
    actualizarMapa();
    const par = buscarAsientosContiguos(sala);
    if (par === null) {
      mensaje.textContent = "No hay dos asientos juntos disponibles en la misma fila.";
      return;
    }
    mensaje.textContent = `Par disponible: fila ${par[0][0]}, columnas ${par[0][1]} y ${par[1][1]}. Sin reservar.`;
    const botones = mapa.querySelectorAll<HTMLButtonElement>("button");
    for (let indice = 0; indice < par.length; indice++) {
      botones[(par[indice][0] - 1) * NUMERO_COLUMNAS + par[indice][1] - 1].classList.add("asiento-sugerido");
    }
  });
  actualizarMapa();
}

if (typeof document !== "undefined") {
  import("./style.css").then(() => iniciarInterfaz());
} else {
// Escenario 1: una sala nueva tiene los 80 asientos disponibles.
const salaVacia = inicializarSala();
comprobarEscenario("1. Sala vacia", salaVacia, 0, 80, [[1, 1], [1, 2]]);

// Escenario 2: dos reservas validas y varios intentos que deben rechazarse.
const salaParcial = inicializarSala();
console.log("\nReservas y validaciones de la sala parcialmente ocupada:");
comprobarResultado(
  "Reserva (1, 1)",
  reservarAsiento(salaParcial, 1, 1),
  "Reserva confirmada: fila 1, columna 1."
);
comprobarResultado(
  "Reserva (1, 2)",
  reservarAsiento(salaParcial, 1, 2),
  "Reserva confirmada: fila 1, columna 2."
);
comprobarReservaRechazada(
  salaParcial, 1, 1,
  "El asiento de la fila 1, columna 1 ya esta ocupado."
);

const coordenadasInvalidas = [[0, 1], [9, 1], [1, 0], [1, 11], [1.5, 1], [1, 2.5]];
for (let indice = 0; indice < coordenadasInvalidas.length; indice++) {
  comprobarReservaRechazada(
    salaParcial,
    coordenadasInvalidas[indice][0],
    coordenadasInvalidas[indice][1],
    "Posicion invalida: indica una fila entera del 1 al 8 y una columna entera del 1 al 10."
  );
}
comprobarEscenario("2. Sala parcialmente ocupada", salaParcial, 2, 78, [[1, 3], [1, 4]]);

// Escenario 3: los dos asientos libres estan en filas distintas, sin formar un par.
const salaCasiLlena = inicializarSala();
for (let fila = 0; fila < NUMERO_FILAS; fila++) {
  for (let columna = 0; columna < NUMERO_COLUMNAS; columna++) {
    if (!((fila === 0 && columna === 9) || (fila === 1 && columna === 0))) {
      salaCasiLlena[fila][columna] = 1;
    }
  }
}
comprobarEscenario("3. Sala casi llena", salaCasiLlena, 78, 2, null);

// Escenario 4: todos los asientos estan ocupados y no se aceptan nuevas reservas.
const salaLlena = inicializarSala();
for (let fila = 0; fila < NUMERO_FILAS; fila++) {
  for (let columna = 0; columna < NUMERO_COLUMNAS; columna++) {
    salaLlena[fila][columna] = 1;
  }
}
comprobarReservaRechazada(
  salaLlena, 1, 1,
  "El asiento de la fila 1, columna 1 ya esta ocupado."
);
comprobarReservaRechazada(
  salaLlena, 8, 10,
  "El asiento de la fila 8, columna 10 ya esta ocupado."
);
comprobarEscenario("4. Sala llena", salaLlena, 80, 0, null);
}

export {};
