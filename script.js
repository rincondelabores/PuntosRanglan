document.addEventListener('DOMContentLoaded', function() {
    const formulario = document.getElementById('formulario-calculo');
    const resultadosDiv = document.getElementById('resultados');

    // ** 👶 BASE DE DATOS DE MEDIDAS (TALLAS 0 A 24 MESES) 📏 **
    // Medidas en centímetros (cm)
    const medidasTallas = {
        '0m': { 
            circunferenciaCuello: 20, // cm - Este es el dato clave para los puntos iniciales
            largoCuerpo: 20, // cm - Largo final de cuerpo
            largoManga: 15 // cm - Largo final de manga
        },
        '1m': {
            circunferenciaCuello: 22,
            largoCuerpo: 22,
            largoManga: 17
        },
        '3m': {
            circunferenciaCuello: 24,
            largoCuerpo: 24,
            largoManga: 19
        },
        '6m': {
            circunferenciaCuello: 26,
            largoCuerpo: 26,
            largoManga: 21
        },
        '9m': {
            circunferenciaCuello: 28,
            largoCuerpo: 28,
            largoManga: 23
        },
        '12m': {
            circunferenciaCuello: 30,
            largoCuerpo: 30,
            largoManga: 25
        },
        '18m': {
            circunferenciaCuello: 32,
            largoCuerpo: 32,
            largoManga: 27
        }
    };

    formulario.addEventListener('submit', function(e) {
        e.preventDefault(); // Evita que la página se recargue

        // 1. Obtener los valores del formulario
        const puntosMuestra = parseFloat(document.getElementById('puntosMuestra').value);
        const tallaSeleccionada = document.getElementById('tallaSeleccionada').value;

        if (!puntosMuestra || !tallaSeleccionada) {
            alert('Por favor, ingresa los puntos de la muestra y selecciona una talla.');
            return;
        }

        const datosTalla = medidasTallas[tallaSeleccionada];
        if (!datosTalla) {
            alert('Error: Talla seleccionada no encontrada en la base de datos.');
            return;
        }

        // 2. CÁLCULO DE PUNTOS POR CENTÍMETRO (Regla de tres)
        // Puntos/cm = (Puntos en la muestra) / 10 cm
        const puntosPorCm = puntosMuestra / 10;
        
        // 3. CÁLCULO DE PUNTOS TOTALES PARA EL ESCOTE
        // Puntos Escote = Circunferencia del Cuello (cm) * Puntos/cm
        let totalPuntosEscote = datosTalla.circunferenciaCuello * puntosPorCm;

        // Redondear al número par más cercano (es mejor para el reparto)
        totalPuntosEscote = Math.round(totalPuntosEscote);
        if (totalPuntosEscote % 2 !== 0) {
            totalPuntosEscote += 1; // Asegura que sea par
        }
        
        // 4. CÁLCULO DEL REPARTO BÁSICO DE RAGLÁN
        // La distribución clásica es: 40% Cuerpo, 20% Mangas, 4 Puntos Raglán (uno para cada línea)
        
        // Puntos a Repartir = Puntos Totales - 4 (puntos de las 4 líneas raglán)
        let puntosARepartir = totalPuntosEscote - 4;

        // Distribución:
        // Espalda = Puntos a Repartir * 30% (aprox.)
        // Delantero = Puntos a Repartir * 30% (aprox.)
        // Manga (x2) = Puntos a Repartir * 20% (aprox. cada una)
        
        // En este ejemplo, usaremos el reparto clásico de tercios (Espalda 1/3, Delantero 1/3, Mangas 1/3) 
        // pero ajustado para que Delantero sea ligeramente menor al inicio (para chaquetas).

        // Porcentaje para el Cuerpo (Espalda + Delantero) = 60%
        // Porcentaje para las Mangas (20% cada una) = 40%
        
        // 📌 Reparto 1:1:2:2 (Manga:Delantero:Manga:Espalda) para empezar
        // La suma de las partes debe dar los 'puntosARepartir'. Total de partes: 6
        // Puntos/Parte = puntosARepartir / 6

        const puntosPorUnidad = puntosARepartir / 6;

        let puntosEspalda = Math.round(puntosPorUnidad * 2);
        let puntosDelantero = Math.round(puntosPorUnidad * 2);
        let puntosManga = Math.round(puntosPorUnidad); // Puntos de CADA manga

        // 5. AJUSTE FINO (Asegurar que la suma cuadre)
        const puntosActuales = puntosEspalda + puntosDelantero + (puntosManga * 2);
        const diferencia = puntosARepartir - puntosActuales;

        // Si hay diferencia, se añade o quita a la espalda (la parte más grande)
        puntosEspalda += diferencia;
        
        // 6. Mostrar Resultados
        document.getElementById('totalPuntosEscote').textContent = totalPuntosEscote;
        document.getElementById('puntosEspalda').textContent = puntosEspalda;
        // Se muestra el TOTAL del Delantero (la suma de los dos lados si es chaqueta)
        document.getElementById('puntosDelantero').textContent = puntosDelantero + ' (Si es chaqueta, dividir: ' + Math.ceil(puntosDelantero / 2) + ' + Tapeta)';
        document.getElementById('puntosManga').textContent = puntosManga;
        document.getElementById('puntosRaglan').textContent = '4 (1 punto x 4 líneas)';

        // Mostrar Medidas Finales
        document.getElementById('largoCuerpo').textContent = datosTalla.largoCuerpo + ' cm';
        document.getElementById('largoManga').textContent = datosTalla.largoManga + ' cm';

        // 7. Hacer visible la sección de resultados
        resultadosDiv.classList.remove('oculto');
    });

    // Opcional: Centrar el foco y destacar la tienda
    document.getElementById('nombreTienda').textContent = 'Rincón de Labores';
});
