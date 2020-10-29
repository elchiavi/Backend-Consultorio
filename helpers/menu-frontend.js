const getMenuFrontEnd = (role = 'USER_ROLE') => {
    const menu = [
        {
            titulo: 'Administración',
            icono: 'mdi mdi-widgets',
            submenu: [
                { titulo: 'Obras Sociales', url: 'obrassociales' },
                { titulo: 'Pacientes', url: 'pacientes' },
                //{ titulo: 'Usuarios', url: 'usuarios'}
    
            ]
        },
    
        {

            titulo: 'Turnos',
            icono: 'mdi mdi-bullseye',
            submenu: [
                { titulo: 'Dashboard', url: '/' },
                { titulo: 'Turnos', url: 'turnos' }
            ]
          }   
    ];

    if (role === 'ADMIN_ROLE') {
        menu[0].submenu.unshift({ titulo: 'Usuarios', url: 'usuarios' })
    }

    return menu;
}

module.exports = {
    getMenuFrontEnd
}