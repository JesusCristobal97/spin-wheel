import {AlignText} from '../../../src/constants.js';

export const props = [

  {
    name: 'Movies',
    radius: 0.92,  
    borderWidth:14,
    borderColor:"#c00244",
    itemLabelRadius: 0.92,
    itemLabelRadiusMax: 0.4,
    itemLabelRotation: 0,
    itemLabelAlign: AlignText.right,
    itemLabelBaselineOffset: -0.13,
    itemLabelFont: 'FuturaMed',
    itemBackgroundColors: ['#000', '#fff','#ce0058'],
    itemLabelColors: ['#fff', '#000','#fff'],
    rotationSpeedMax: 700,
    rotationResistance: -70,
    lineWidth: 0,
    overlayImage: './img/sephorav2.png',
    items: [
      {
        label:'REGALO ESPECIAL'
      },
      {
        label: 'MUESTRA',  
      },
      {
        label: 'PRUEBA OTRA VEZ',
      }, 
      {
        label: 'TARJETA DE REGALO',
      },
      {
        label:'MUESTRA'
      },
      {
        label:'MUESTRA DELUXE'
      },
      {
        label: 'MUESTRA',  
      },
      {
        label: 'PRUEBA OTRA VEZ',
      }, 
      {
        label: 'MUESTRA DELUXE',
      },
    ],
  },
];