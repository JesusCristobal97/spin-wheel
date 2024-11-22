import {AlignText} from '../../../src/constants.js';

export const props = [

  {
    name: 'Movies',
    radius: 0.92,  
    borderWidth:14,
    borderColor:"#404040",
    itemLabelRadius: 0.92,
    itemLabelRadiusMax: 0.2,
    itemLabelRotation: 0,
    itemLabelAlign: AlignText.right,
    itemLabelBaselineOffset: -0.13,
    itemLabelFont: 'FuturaMed',
    itemLabelFontSizeMax: 500,
    itemBackgroundColors: ['#000', '#fff','#ce0058'],
    itemLabelColors: ['#fff', '#000','#fff'],
    rotationSpeedMax: 700,
    rotationResistance: -70,
    lineWidth: 0,
    overlayImage: './img/sephorav3.png',
    items: [
      {
        label:'REGALO ESPECIAL'
      },
      {
        label: 'MUESTRA       ',  
      },
      {
        label: 'PRUEBA OTRA VEZ',
      }, 
      {
        label: 'TARJETA REGALO',
      },
      {
        label:'MUESTRA'
      },
      {
        label:'MUESTRA DELUXE'
      },
      {
        label: 'MUESTRA       ',  
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