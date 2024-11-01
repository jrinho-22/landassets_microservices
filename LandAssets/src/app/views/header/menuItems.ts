import { IMenuItems } from "./interfaceMenuItems";

const nav: IMenuItems[] = [
  {
    permission: ['all'],
    label: 'HOME',
    path: 'dashboard'
    // children: [
    //   {
    //     label: 'teste',
    //     path: ''
    //   },
    // ],
  },
  {
    permission: ['admin'],
    label: 'SALES',
    path: 'view-sales/listar'
    // children: [
    //   {
    //     label: 'teste',
    //     path: ''
    //   },
    // ],
  },
  {
    permission: ['client'],
    label: 'PLOTS',
    path: 'my-plots/listar'
  },
  {
    permission: ['admin'],
    label: 'MODULES',
    children: [
      {
        label: 'Estado',
        // path: 'cadastro-estado'
        children: [
          {
            label: 'Cadastrar estado',
            path: 'cadastro-estado'
          },
          {
            label: 'Vizualizar estado',
            path: 'cadastro-estado/listar'
          },
        ],
      },
      {
        label: 'Plot',
        // path: 'cadastro-estado/listar',
        children: [
          {
            label: 'cadastrar plot',
            path: 'cadastro-plot'
          },
          {
            label: 'listar plot',
            path: 'cadastro-plot/listar'
          },
        ],
      },
    ],
  },
];

export default nav