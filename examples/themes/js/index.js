import {Wheel} from '../../../dist/spin-wheel-esm.js';
import {loadFonts, loadImages} from '../../../scripts/util.js';
import {props} from './props.js';

// audios
const spinSound = new Audio('./sounds/rulete.mp3');
const finishSound1 = new Audio('./sounds/winner1.wav');
const finishSound2 = new Audio('./sounds/finish.wav');


window.onload = async () => {

  await loadFonts(props.map(i => i.itemLabelFont));

  const wheel = new Wheel(document.querySelector('.wheel-wrapper'));
  const dropdown = document.querySelector('select');

  // Cargar el sonido del botón
const buttonSound = new Audio('./sounds/botonsound.wav'); // Ruta al archivo de sonido


  const images = [];

  for (const p of props) {
    // Initalise dropdown with the names of each example:
    const opt = document.createElement('option');
    opt.textContent = p.name;
    dropdown.append(opt);

    // Convert image urls into actual images:
    images.push(initImage(p, 'image'));
    images.push(initImage(p, 'overlayImage'));
    for (const item of p.items) {
      images.push(initImage(item, 'image'));
    }
  }

  await loadImages(images);

  // Show the wheel once everything has loaded
  document.querySelector('.wheel-wrapper').style.visibility = 'visible';

  // Handle dropdown change:
  dropdown.onchange = () => {
    wheel.init({
      ...props[dropdown.selectedIndex],
      rotation: wheel.rotation, // Preserve value.
    });
  };

  // Select default:
  dropdown.options[0].selected = 'selected';
  dropdown.onchange();

  // Save object globally for easy debugging.
  window.wheel = wheel;

  const btnSpin = document.querySelector('#btnStart');

  btnSpin.addEventListener('click', () => {
  
  spinSound.play();
   // Reproducir sonido del botón
   buttonSound.play();
  // Añadir clase pressed para simular el efecto hundido
  btnSpin.classList.add('pressed');

  // Quitar la clase 'pressed' después de 8 segundos
  setTimeout(() => {
      btnSpin.classList.remove('pressed');
  }, 8000); // 8 segundos

  setTimeout(() => {
    winSound.play();
    showWinningEffect();
  }, 3000);
});

  let modifier = 0;

  window.addEventListener('click', (e) => {
    if (e.target === btnSpin) {
        const {duration, winningItemRotaion} = calcSpinToValues();
        
        // Reproducir sonido y hacer que se repita
        spinSound.play();
        spinSound.loop = true;

        // Girar la ruleta
        const wheelElement = document.querySelector('.wheel-wrapper');

        // Añadir la clase vibrate para que la ruleta vibre durante el giro
        wheelElement.classList.add('vibrate');
        // Girar la ruleta
        wheel.spinTo(winningItemRotaion, duration);

        // Detener el sonido cuando el giro haya terminado
        setTimeout(() => {
            spinSound.pause();
            spinSound.currentTime = 0; // Reiniciar el sonido para la próxima vez
        
            // Quitar la clase vibrate para detener la vibración
            wheelElement.classList.remove('vibrate');

            // Reproducir los sonidos al finalizar el giro
            finishSound2.play();  // Reproduce el primer sonido
            finishSound2.onended = () => {
                finishSound1.play();  // Reproduce el segundo sonido cuando el primero termine
            };
        
          }, duration); // Detener el sonido cuando el giro termine
    }
});

/*
  function calcSpinToValues() {
    const duration = 9149;
    const winningItemRotaion = getRandomInt(360 * 5, 360 * 10) + modifier;
    modifier += 360 * 10;
    return {duration, winningItemRotaion};
  }

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  function initImage(obj, pName) {
    if (!obj[pName]) return null;
    const i = new Image();
    i.src = obj[pName];
    obj[pName] = i;
    return i;
  }
*/

function calcSpinToValues() {
  const duration = 9149;
  const winningItemRotaion = getRandomInt(355 * 10, 360 * 10) + modifier;
  modifier += 360 * 10;
  return {duration, winningItemRotaion};
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function initImage(obj, pName) {
  if (!obj[pName]) return null;
  const i = new Image();
  i.src = obj[pName];
  obj[pName] = i;
  return i;
}

  // funciones para el sonido

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