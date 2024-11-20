import {Wheel} from '../../../dist/spin-wheel-esm.js';
import { loadFonts, loadImages } from '../../../scripts/util.js';

import * as easing from '../../../scripts/easing.js';
 

window.onload = () => {

  const container = document.querySelector('.wheel-wrapper');
  const dropdownWinningItem = document.querySelector('select.winning-item');
  const dropdownEasingFunction = document.querySelector('select.easing-function');
  const dropdownRevolutions = document.querySelector('select.revolutions');

  const btnSpin = document.querySelector('.gui-wrapper .btn-spin');
  const btnStop = document.querySelector('.gui-wrapper .btn-stop');

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

  const images = [];


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

  //props.overlayImage= '../img/example-2-overlay.svg',
  props.itemBackgroundColors = ['#c7160c', '#fff'],
  props.itemLabelColors = ['#fff', '#000'],

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

  window.addEventListener('click', (e) => {

    // Listen for click event on spin button:
    if (e.target === btnSpin) {
      const winningItemIndex = fetchWinningItemIndexFromApi();
      const easing = easingFunctions[dropdownEasingFunction.value];
      const easingFunction = easing.function;
      const duration = 2600;
      const spinDirection = parseInt(document.querySelector('input[name="spinDirection"]:checked').value);
      const revolutions = parseInt(dropdownRevolutions.value);
      wheel.spinToItem(winningItemIndex, duration, true, revolutions, spinDirection, easingFunction);
    }

    // Listen for click event on stop button:
    if (e.target === btnStop) {
      wheel.stop();
    }

  });

  window.addEventListener('keyup', (e) => {

    if (e.target && e.target.matches('#pointerAngle')) {
      wheel.pointerAngle = parseInt(e.target.value) || 0;
    }

  });

  function fetchWinningItemIndexFromApi() {
    // Simulate a call to the back-end
    return dropdownWinningItem.value;
  }

};