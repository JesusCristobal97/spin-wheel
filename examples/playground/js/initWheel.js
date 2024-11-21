import {Wheel} from '../../../dist/spin-wheel-esm.js';
import { loadFonts, loadImages } from '../../../scripts/util.js';
const props = {
  items: [
    {
      label: 'one xd' ,
      image: 'https://purepng.com/public/uploads/large/purepng.com-super-mariomariosuper-mariovideo-gamefictional-characternintendoshigeru-miyamotomario-franchise-17015286383789a9am.png'
    },
    {
      label: 'two sasas sssss ',
    },
    {
      label: 'three',
    },
  ],
  itemBackgroundColors: ['#fff', '#eee', '#ddd'],
  itemLabelFontSizeMax: 40,
  rotationResistance: -100,
  rotationSpeedMax: 1000,
};

const container = document.querySelector('.wheel-wrapper');

// Save object globally for easy debugging.
window.wheel = new Wheel(container, props);

// Log events for easy debugging:
wheel.onCurrentIndexChange = e => console.log(e);
wheel.onRest = e => console.log(e);
wheel.onSpin = e => console.log(e);


 