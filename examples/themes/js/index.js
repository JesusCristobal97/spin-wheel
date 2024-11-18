import { Wheel } from '../../../dist/spin-wheel-esm.js';
import { loadFonts, loadImages } from '../../../scripts/util.js';
import { props } from './props.js';

// Audios
const spinSound = new Audio('./sounds/rulete.mp3');
const finishSound1 = new Audio('./sounds/winner1.wav');
const finishSound2 = new Audio('./sounds/finish.wav');
const buttonSound = new Audio('./sounds/botonsound.wav'); // Sonido del botón

window.onload = async () => {
  await loadFonts(props.map(i => i.itemLabelFont));

  const wheel = new Wheel(document.querySelector('.wheel-wrapper'));
  const dropdown = document.querySelector('select');

  const images = [];

  for (const p of props) {
    // Inicializar el dropdown con los nombres de cada ejemplo
    const opt = document.createElement('option');
    opt.textContent = p.name;
    dropdown.append(opt);

    // Convertir las URLs de las imágenes en objetos Image
    images.push(initImage(p, 'image'));
    images.push(initImage(p, 'overlayImage'));
    for (const item of p.items) {
      images.push(initImage(item, 'image'));
    }
  }

  await loadImages(images);

  // Mostrar la ruleta una vez que todo haya cargado
  document.querySelector('.wheel-wrapper').style.visibility = 'visible';

  // Manejar el cambio en el dropdown
  dropdown.onchange = () => {
    wheel.init({
      ...props[dropdown.selectedIndex],
      rotation: wheel.rotation, // Preservar el valor de rotación actual
    });
  };

  // Seleccionar el primer elemento por defecto
  dropdown.options[0].selected = 'selected';
  dropdown.onchange();

  // Guardar el objeto wheel globalmente para depuración
  window.wheel = wheel;

  // Referencia al botón START
  const btnSpin = document.querySelector('#btnStart');

  // Variables para controlar el giro
  let isSpinning = false;
  let isDecelerating = false;
  let rotationSpeed = 0;
  let rotationAngle = wheel.rotation || 0; // Obtener rotación actual o iniciar en 0
  const maxRotationSpeed = 20; // Velocidad máxima de rotación
  let spinAnimationFrame;
  let targetRotation = 0;
  let decelerationStartRotation = 0;
  let decelerationDuration = 0;
  let decelerationStartTime = 0;

  // Escuchar la tecla Espacio para iniciar y detener el giro
  document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && !isSpinning && !isDecelerating) {
      e.preventDefault();
      startSpin();
    }
  });

  document.addEventListener('keyup', (e) => {
    if (e.code === 'Space' && isSpinning) {
      e.preventDefault();
      stopSpin();
    }
  });

  // Manejar el evento de clic en el botón START
  btnSpin.addEventListener('mousedown', () => {
    if (!isSpinning && !isDecelerating) {
      startSpin();
    }
  });

  btnSpin.addEventListener('mouseup', () => {
    if (isSpinning) {
      stopSpin();
    }
  });

  // Función para iniciar el giro
  function startSpin() {
    isSpinning = true;
    isDecelerating = false;
    rotationSpeed = 0;

    // Reproducir sonidos
    spinSound.play();
    spinSound.loop = true;
    buttonSound.play();

    // Añadir clase 'pressed' para efecto visual
    btnSpin.classList.add('pressed');

    // Añadir clase 'vibrate' para efecto visual en la ruleta
    document.querySelector('.wheel-wrapper').classList.add('vibrate');

    // Iniciar la animación de rotación
    spinAnimationFrame = requestAnimationFrame(rotateWheel);
  }

  // Función para rotar la ruleta continuamente
  function rotateWheel() {
    if (!isSpinning) return;

    // Aumentar la velocidad hasta el máximo
    if (rotationSpeed < maxRotationSpeed) {
      rotationSpeed += 0.5; // Ajusta la aceleración según sea necesario
    }

    // Actualizar el ángulo de rotación
    rotationAngle = (rotationAngle + rotationSpeed) % 360;
    wheel.rotation = rotationAngle;
    wheel.draw();

    // Continuar la animación
    spinAnimationFrame = requestAnimationFrame(rotateWheel);
  }

  // Función para detener el giro y desacelerar
  function stopSpin() {
    isSpinning = false;
    isDecelerating = true;

    // Detener el sonido de giro
    //spinSound.pause();
    spinSound.currentTime = 0;

    // Quitar clase 'pressed' del botón
    btnSpin.classList.remove('pressed');

    // Quitar la clase 'vibrate' para detener el efecto visual
    document.querySelector('.wheel-wrapper').classList.remove('vibrate');

    // Obtener la rotación objetivo dentro del bloque seleccionado
    //const { winningItemRotation } = calcSpinToValues();

    var winningItemRotation = document.getElementById("txtRotation").value;
    // Calcular la rotación objetivo agregando rotaciones completas para un mejor efecto
    const decelerationRotations = 3; // Número de rotaciones completas durante la desaceleración
    const currentRotationMod = rotationAngle % 360;
    const angleDifference = (winningItemRotation - currentRotationMod + 360) % 360;
    targetRotation = rotationAngle + angleDifference + decelerationRotations * 360;

    // Guardar valores para la interpolación
    decelerationStartRotation = rotationAngle;
    decelerationDuration = 4000; // Duración de la desaceleración en milisegundos
    decelerationStartTime = null;

    // Iniciar la desaceleración
    spinAnimationFrame = requestAnimationFrame(decelerateWheel);
  }

  // Función de easing (suavizado) cúbica
  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  // Función para desacelerar y detener la ruleta suavemente
  function decelerateWheel(timestamp) {
    if (!isDecelerating) return;

    if (!decelerationStartTime) {
      decelerationStartTime = timestamp;
    }

    const elapsed = timestamp - decelerationStartTime;
    const progress = Math.min(elapsed / decelerationDuration, 1); // Asegurarse de que no exceda 1
    const easedProgress = easeOutCubic(progress);

    // Calcular la rotación actual
    rotationAngle = decelerationStartRotation + (targetRotation - decelerationStartRotation) * easedProgress;
    wheel.rotation = rotationAngle % 360;
    wheel.draw();

    if (progress < 1) {
      // Continuar la animación
      spinAnimationFrame = requestAnimationFrame(decelerateWheel);
    } else {
      // Desaceleración completa
      isDecelerating = false;

      // Reproducir sonidos de finalización
        spinSound.pause();
        finishSound2.play(); 
        finishSound2.onended = () => {
        finishSound1.play();

      };
    }
  }

  // Función para calcular los valores de giro según el bloque seleccionado
  function calcSpinToValues() {
    const selectedBlock = localStorage.getItem('selectedBlock') || '1';

    let minDegrees, maxDegrees;

    // Determinar los rangos según el bloque seleccionado
    if (selectedBlock === '1') {
      minDegrees = 0;
      maxDegrees = 90;
    } else if (selectedBlock === '2') {
      minDegrees = 90;
      maxDegrees = 180;
    } else if (selectedBlock === '3') {
      minDegrees = 180;
      maxDegrees = 270;
    } else if (selectedBlock === '4') {
      minDegrees = 270;
      maxDegrees = 360;
    }

    // Generar rotación dentro del rango del bloque seleccionado
    const winningItemRotation = getRandomInt(minDegrees, maxDegrees);

    console.log(`Rotación calculada: ${winningItemRotation}`); // Mostrar en consola

    return { winningItemRotation };
  }

  // Función para obtener un número aleatorio dentro de un rango
  function getRandomInt(min, max) {
    return Math.random() * (max - min) + min;
  }

  // Función para inicializar imágenes
  function initImage(obj, pName) {
    if (!obj[pName]) return null;
    const i = new Image();
    i.src = obj[pName];
    obj[pName] = i;
    return i;
  }

  // Mostrar u ocultar la interfaz según la posición del mouse
  document.addEventListener('mousemove', function (e) {
    const guiWrapper = document.querySelector('.gui-wrapper');

    // Mostrar la barra si el mouse está en la parte superior (dentro de los primeros 50px)
    if (e.clientY < 50) {
      guiWrapper.classList.add('visible');
    } else {
      guiWrapper.classList.remove('visible');
    }
  });
};
