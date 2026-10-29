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

const sala = inicializarSala();
console.log("Sala vacia (L = libre, X = ocupado):");
mostrarSala(sala);

console.log(reservarAsiento(sala, 3, 5));
console.log(reservarAsiento(sala, 3, 5));
console.log(reservarAsiento(sala, 9, 1));

console.log("Sala final:");
mostrarSala(sala);

const [ocupados, disponibles] = contarAsientos(sala);
console.log(`Asientos ocupados: ${ocupados}`);
console.log(`Asientos disponibles: ${disponibles}`);

const asientosContiguos = buscarAsientosContiguos(sala);
if (asientosContiguos !== null) {
  console.log(
    `Asientos contiguos disponibles: fila ${asientosContiguos[0][0]}, columna ${asientosContiguos[0][1]} y fila ${asientosContiguos[1][0]}, columna ${asientosContiguos[1][1]}.`
  );
} else {
  console.log("No hay dos asientos contiguos disponibles.");
}

export {};
