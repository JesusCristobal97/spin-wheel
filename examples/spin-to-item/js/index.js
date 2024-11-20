import {Wheel} from '../../../dist/spin-wheel-esm.js';
import { loadFonts, loadImages } from '../../../scripts/util.js'; 

import * as easing from '../../../scripts/easing.js';
 



window.onload = async() => { 

  //#region objects html
  const container = document.querySelector('.wheel-wrapper');
  const dropdownWinningItem = document.querySelector('select.winning-item');
  const dropdownEasingFunction = document.querySelector('select.easing-function');
  const dropdownRevolutions = document.querySelector('select.revolutions');

  const btnSpin = document.querySelector('.gui-wrapper .btn-spin');
  const btnStop = document.querySelector('.gui-wrapper .btn-stop');
//#endregion
  
  //#region  props
  const props = { 
    
    items: [
      {
        label:'sampling Deluxe' 
      },
      {
        label: 'sampling normal',
      },
      {
        label: 'Bolas ',  
      },
      {
        label: 'Tarjeta Regalo',
      },
      {
        label:'sampling Deluxe'
      },
      {
        label: 'sampling normal',
      },
      {
        label: 'Bolas ',  
      },
      {
        label: 'Tarjeta Regalo',
      },
    ],
    itemLabelRadiusMax: 0.5,
  };

  const easingFunctions = [
    {
      label: 'default (easeSinOut)',
      function: null,
    },
    {
      label: 'easeSinInOut',
      function: easing.sinInOut,
    },
    {
      label: 'easeCubicOut',
      function: easing.cubicOut,
    },
    {
      label: 'easeCubicInOut',
      function: easing.cubicInOut,
    },
    {
      label: 'easeElasticOut',
      function: easing.elasticOut,
    },
    {
      label: 'easeBounceOut',
      function: easing.bounceOut,
    },
  ];
 
  //#endregion
  //#region props for imagen
  const images = [];
  props.overlayImage = './img/example-2-overlay.svg';
  images.push(initImage(props, 'overlayImage')); 
  loadImages(images);
  //#endregion

  //#region props for color items
  props.itemBackgroundColors = ['#c7160c', '#fff'],
  props.itemLabelColors = ['#fff', '#000'],
  //#endregion
  
  window.wheel = new Wheel(container, props);

 
  // Initalise winning item dropdown:
  for (const [i, item] of wheel.items.entries()) {
    const opt = document.createElement('option');
    opt.textContent = item.label;
    opt.value = i;
    dropdownWinningItem.append(opt);
  }

  // Initalise easing functions dropdown:
  for (const [i, item] of easingFunctions.entries()) {
    const opt = document.createElement('option');
    opt.textContent = item.label;
    opt.value = i;
    dropdownEasingFunction.append(opt);
  }


  var configBase = {} ;

  window.addEventListener('click', (e) => {
    // Listen for click event on spin button:
    if (e.target === btnSpin) {
      startRuleta();
    }

    // Listen for click event on stop button:
    if (e.target === btnStop) {
      wheel.stop();
    }

  });

  function startRuleta(){
    const winningItemIndex = fetchWinningItemIndexFromApi();
    const easing = easingFunctions[dropdownEasingFunction.value];
    const easingFunction = easing.function;
    const duration = 2600;
    const spinDirection = parseInt(document.querySelector('input[name="spinDirection"]:checked').value);
    const revolutions = parseInt(dropdownRevolutions.value);
    wheel.spinToItem(winningItemIndex, 
      duration, 
      true, 
      revolutions, 
      spinDirection, 
      easingFunction);
 
  }


window.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    e.preventDefault(); 
  }
});


  window.addEventListener('keyup', (e) => {

    if (e.target && e.target.matches('#pointerAngle')) {
      wheel.pointerAngle = parseInt(e.target.value) || 0;
    }

    if (e.code === 'Space'  ) {
      e.preventDefault(); 
    }
 
  });


  

  const  fetchWinningItemIndexFromApi =  () => {
    
    var options = configBase.options;
    var random = 2;// getRandomInt(options.length);
    var option = options[random];
    console.log("options ", options);
    console.log("random ", random);
    console.log("option ", option);
    
    switch(option){
      case "Sampling Deluxe":
        break;
      case "Sampling Normal":
        break;
      case "Bolas":
        random = comprobeBalls(random);
        break;
      case "Tarjeta Regalo":
        random = comprobeGifts(random);
        break;

    } 
    return random;
  }

 
 

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
  

  function comprobeBalls(option) {
    const now = new Date();
    const day = `${now.getDate().toString().padStart(2, '0')}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getFullYear()}`;
    
    let isDay = false; 
    const ballsDays = configBase.balls || [];  
   
    for (let index = 0; index < ballsDays.length; index++) {
      const ball = ballsDays[index]; 
  
      if (ball.day === day && ball.count < 4) {  
        ball.count++; 
        isDay = true;
        break;  
      }
    }
   
    if (!isDay) {
      return option - 1;  
    }
   
    console.log("configbase" , configBase);
    return option;
  }

  function comprobeGifts(option) {
    const gifts = configBase.gifts || []; 
    const now = new Date();
    const day = `${now.getDate().toString().padStart(2, '0')}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getFullYear()}`;
  
    if (gifts.includes(day)) {
      return option + 1;  
    } else { 
      configBase.gifts.push(day);
      console.log(`Día ${day} agregado a gifts`);
    }
    console.log(configBase);
    return option;

  }
  

  const loadGetDataBase = async () => {
    try {
      const response = await fetch('./database/getDataBase.json'); 
      if (!response.ok) {
        throw new Error(`Error al cargar el JSON: ${response.status} ${response.statusText}`);
      }
      const getDataBase = await response.json();
      configBase = getDataBase;
      console.log("getDataBase ", configBase);

    } catch (error) {
      console.error("Error cargando el JSON:", error);
    }
  };

  
  await loadGetDataBase();

  function getRandomInt(max) {
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
 
};
