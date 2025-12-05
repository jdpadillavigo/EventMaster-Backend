'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Obtener los IDs de usuarios generados automáticamente
    const usuarios = await queryInterface.sequelize.query(
      `SELECT usuario_id FROM "Usuario" ORDER BY usuario_id ASC;`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    const usuarioIds = usuarios.map(u => u.usuario_id);

    await queryInterface.bulkInsert('Cliente', [
      {
        nombre: 'Juan',
        apellido: 'Perez',
        foto_perfil: 'https://preview.redd.it/yall-want-some-profile-pictures-v0-kg5dtjppx9ze1.jpg?width=640&crop=smart&auto=webp&s=26a56124c45355ad73af6ca2d214e0d95c39b6a6',
        usuario_id: usuarioIds[0]
      },
      {
        nombre: 'Maria',
        apellido: 'Gonzalez',
        foto_perfil: 'https://i.pinimg.com/236x/32/3b/0a/323b0afbb608104054289aa7d696b344.jpg',
        usuario_id: usuarioIds[1]
      },
      {
        nombre: 'Carlos',
        apellido: 'Lopez',
        foto_perfil: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRI4YLt3aOA800OEZAR3uKc1yLuiB7FZTez8Q&s',
        usuario_id: usuarioIds[2]
      },
      {
        nombre: 'Laura',
        apellido: 'Ramirez',
        foto_perfil: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRaCOobWuX1QLBAc-35uq5XO8Ozghn5Lej6yw&s',
        usuario_id: usuarioIds[3]
      },
      {
        nombre: 'Diego',
        apellido: 'Fernandez',
        foto_perfil: 'https://e0.pxfuel.com/wallpapers/442/989/desktop-wallpaper-perfil-boy-face.jpg',
        usuario_id: usuarioIds[4]
      },
      {
        nombre: 'Sofia',
        apellido: 'Martinez',
        foto_perfil: 'https://www.dzoom.org.es/wp-content/uploads/2020/02/portada-foto-perfil-redes-sociales-consejos-810x540.jpg',
        usuario_id: usuarioIds[5]
      },
      {
        nombre: 'Miguel',
        apellido: 'Hernandez',
        foto_perfil: 'https://preview.redd.it/is-this-a-good-pfp-v0-qm3p4sotkjgd1.jpeg?auto=webp&s=9f871f898320aa852b6b6bcde3ae8d19fae742ce',
        usuario_id: usuarioIds[6]
      },
      {
        nombre: 'Valentina',
        apellido: 'Sanchez',
        foto_perfil: 'https://img.freepik.com/vector-gratis/ilustracion-dibujos-animados-perfil-lateral-dibujado-mano_23-2150503812.jpg?semt=ais_hybrid&w=740&q=80',
        usuario_id: usuarioIds[7]
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Cliente', null, {});
  }
};
