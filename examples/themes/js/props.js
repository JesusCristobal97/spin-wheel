import {AlignText} from '../../../src/constants.js';

export const props = [

  {
    name: 'Movies',
    radius: 0.88,  
    itemLabelRadius: 0.92,
    itemLabelRadiusMax: 0.4,
    itemLabelRotation: 0,
    itemLabelAlign: AlignText.right,
    itemLabelBaselineOffset: -0.13,
    itemLabelFont: 'Pragati Narrow',
    itemBackgroundColors: ['#f085be', '#fff'],
    itemLabelColors: ['#fff', '#000'],
    rotationSpeedMax: 700,
    rotationResistance: -70,
    lineWidth: 0,
    overlayImage: './img/Imagen1-removebg.png',
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
  },
];