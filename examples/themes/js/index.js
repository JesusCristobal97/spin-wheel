import { Wheel } from '../../../dist/spin-wheel-esm.js';
import { loadFonts, loadImages } from '../../../scripts/util.js';
import { props } from './props.js'; 
// Audios
const spinSound = new Audio('./sounds/rulete-modified.mp3'); 
const sonidoregaloaldia= new Audio('./sounds/sonidoregaloaldia.wav'); 
const finishSound2 = new Audio('./sounds/finish.wav');
const buttonSound = new Audio('./sounds/botonsound.wav'); // Sonido del botón

 
window.onload = async () => { 

var timeRandom =  calculeTimeRandom();

 
console.log("timeRandom " ,timeRandom); 

  var configBase = {} ;
  var optionSound = 0;
  
  const generateLocalStorage = async () => {
    var localConfigBase = localStorage.getItem("configBase");
    if(localConfigBase != null){
      configBase = JSON.parse(localConfigBase);
    }else{
      try {
        const response = await fetch('./database/getDataBase.json'); 
        if (!response.ok) {
          throw new Error(`Error al cargar el JSON: ${response.status} ${response.statusText}`);
        }
        const getDataBase = await response.json();
        configBase = getDataBase; 
        localStorage.setItem("configBase", JSON.stringify(configBase)); 

      } catch (error) {
        console.error("Error cargando el JSON:", error);
      }
    }
  }
  
  
  await generateLocalStorage();
  let isFetching = false; 
  const  fetchWinningItemIndexFromApi =  () => {
    if (isFetching) return; // Si ya se está ejecutando, sal del método
    isFetching = true;


    var options = configBase.options;
    var random = 0;
     

    random =  getRandomOption(options.length);
 
    var option = options[random];
    console.log("random ", random);
    console.log("option ", option);
    
    optionSound = 0;

    switch(option){
      case "Sampling Deluxe":
        break;
      case "Sampling Normal":
        break;
      case "REGALO ESPECIAL":
        random = comprobeBalls(random);
        break;
      case "TARJETA REGALO":
        random = comprobeGifts(random);
        console.log("random return ", random);
        break;


    } 
    isFetching = false;
    return random;
  }


  function comprobeBalls(option) {
    const now = new Date();
    const day = `${now.getDate().toString().padStart(2, '0')}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getFullYear()}`;
    
    let isDay = false; 
    const ballsDays = configBase.balls || [];  
   
    for (let index = 0; index < ballsDays.length; index++) {
      const ball = ballsDays[index]; 
  
      if (ball.day === day && ball.count < ball.max) {  
        ball.count++; 
        isDay = true;
        break;  
      }
    }
   
    if (!isDay) {
      return aleatoryBall();  
    }
    saveInformation();
    console.log("configbase" , configBase);
    return option;
  }

  function aleatoryBall (){
    let numero;
    do {
        numero = Math.floor(Math.random() * 8) + 1; // Genera un número entre 1 y 8
    } while (numero === 3); // Asegura que no sea 3
    return numero;
  }
  
  function calculeTimeRandom() {
    const hourInit = 19;
    const hourEnd = 21;
   
    const validHourInit = Math.max(0, Math.min(23, hourInit));
    const validHourEnd = Math.max(validHourInit, Math.min(23, hourEnd));
  
 
    const randomHour = Math.floor(Math.random() * (validHourEnd - validHourInit + 1)) + validHourInit;
  
 
    const randomMinutes = Math.floor(Math.random() * 60);
    const randomSeconds = Math.floor(Math.random() * 60);
  
 
    const formattedTime = `${randomHour.toString().padStart(2, '0')}:${randomMinutes.toString().padStart(2, '0')}:${randomSeconds.toString().padStart(2, '0')}`;
  
    return formattedTime;
  }
  


 
function comprobeGifts(option) {
  const gifts = configBase.gifts || [];
  const now = new Date();
 
  const day = `${now.getDate().toString().padStart(2, '0')}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getFullYear()}`;
 
    // Verificar si es el domingo específico (24-12-2024)
    if (day === "22-12-2024") {
      console.log("Hoy es el domingo especial (24-12-2024), 'TARJETA REGALO' no está disponible.");
      return aleatoryGift(); // Devuelve una opción aleatoria
    }

  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  console.log("Hora actual:", `${currentHour}:${currentMinute}`);
 
  if (!/^\d{2}:\d{2}:\d{2}$/.test(timeRandom)) {
    console.error("Formato inválido de timeRandom:", timeRandom);
    return aleatoryGift();
  }

  if (gifts.includes(day)) {
    return aleatoryGift();  
  } 
 
  const [horaLimite, minutosLimite] = timeRandom.split(":").map(Number);

  console.log("Hora límite:", `${horaLimite}:${minutosLimite}`);
 
  if (currentHour > horaLimite || (currentHour === horaLimite && currentMinute >= minutosLimite)) {
    configBase.gifts.push(day);
    saveInformation();  
    optionSound = 3;
    console.log(`Día ${day} agregado a gifts`);
    return option;
  } else { 
    return aleatoryGift();
  }
}

   
  function aleatoryGift() {
    let numero;
    do {
        numero = Math.floor(Math.random() * 9); // Genera un número entre 0 y 8
    } while (numero === 0 || numero === 3); // Asegura que no sea 0 ni 3
    return numero;
}
  
  function saveInformation(){
    const localData = JSON.stringify(configBase);
    if (localData !== localStorage.getItem("configBase")) {
      localStorage.setItem("configBase", localData);
    }
  }
  
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
  console.log("images ", images);
  await loadImages(images);

  // Mostrar la ruleta una vez que todo haya cargado
  document.querySelector('.wheel-wrapper').style.visibility = 'visible';

  // Manejar el cambio en el dropdown
  dropdown.onchange = () => {
    console.log(props[dropdown.selectedIndex]);
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
  let spinAnimationFrame;
  let isDecelerating = false;
  let rotationSpeed = 0;
  let rotationAngle = wheel.rotation || 0; // Obtener rotación actual o iniciar en 0
  const maxRotationSpeed =  20; // Velocidad máxima de rotación
  
  let decelerationStartTime = 0;
  let isKeyDown = false;

  // Escuchar la tecla Espacio para iniciar y detener el giro
  document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && !isSpinning && !isDecelerating  && !isFetching) {
      e.preventDefault();
      isKeyDown = true; 
      startSpin();
    }
  });

  document.addEventListener('keyup', (e) => {
    if (e.code === 'Space' && isSpinning) { 

      e.preventDefault();
      isKeyDown = false;
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

    sonidoregaloaldia.pause();
    isSpinning = true;
    isDecelerating = false;
    rotationSpeed = 0;
 
    btnSpin.classList.add('pressed');
    spinSound.play();
    spinSound.loop = true;
    buttonSound.play();
    document.querySelector('.wheel-wrapper').classList.add('vibrate');
 
    spinAnimationFrame = requestAnimationFrame(rotateWheel);
  }
 
  function rotateWheel() {
    if (!isSpinning) return;
 
    if (rotationSpeed < maxRotationSpeed) {
      rotationSpeed += 0.5;  
    }
 
    rotationAngle = (rotationAngle + rotationSpeed) % 360;
    wheel.rotation = rotationAngle;
    wheel.draw();
 
    spinAnimationFrame = requestAnimationFrame(rotateWheel);
  }
 
  function stopSpin() {
    isSpinning = false;
    isDecelerating = false;
 
    //spinSound.currentTime = 0;
    btnSpin.classList.remove('pressed');
    document.querySelector('.wheel-wrapper').classList.remove('vibrate');

    decelerationStartTime = null;

    // Iniciar la desaceleración
   spinAnimationFrame = requestAnimationFrame(decelerateWheel);
  }

   

  // Función para desacelerar y detener la ruleta suavemente
  function decelerateWheel(timestamp) {
    const itemSelect = fetchWinningItemIndexFromApi();
    console.log("itemSelect ",itemSelect );
    wheel.spinToItem(itemSelect, 3000,true,7,1,null);

    setTimeout(() => {
      spinSound.pause();  
    }, 3000);

        finishSound2.play();  
        finishSound2.volume = 0;

        finishSound2.onended = () => {
          console.log("option sound ," , optionSound);
          if (optionSound == 3) {  
            sonidoregaloaldia.play();
          }
          else{
          } 
          optionSound = 0;
      };

    
    /* */

    if (!isDecelerating)
      {
        console.log("isDecelerating");
        return;
      }
 

    if (!decelerationStartTime) {
      decelerationStartTime = timestamp;
      console.log("decelerationStartTime");
    }

    if (progress < 1) {
      console.log("progress");

      // Continuar la animación
      //spinAnimationFrame = requestAnimationFrame(decelerateWheel);
    } else {
      // Desaceleración completa
      console.log("isDecelerating");

      isDecelerating = false;
      // Reproducir sonidos de finalización
        
 
    }
  }

  function getRandomOption(max) {
    return Math.floor(Math.random() * max);
  }
  
    
  function initImage(obj, pName) {
    if (!obj[pName]) return null;
    const i = new Image();
    i.src = obj[pName];
    i.height = 40;
    i.width = 40; 
    obj[pName] = i;
    return i;
  }

 
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
