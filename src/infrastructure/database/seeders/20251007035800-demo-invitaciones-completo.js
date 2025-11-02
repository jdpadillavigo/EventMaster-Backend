'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Insertar Notificaciones (sin IDs, autoincrement)
    await queryInterface.bulkInsert('Notificacion', [
      {
        fechaHora: new Date('2024-02-10T10:00:00'),
        evento_id: 1
      },
      {
        fechaHora: new Date('2024-02-15T14:00:00'),
        evento_id: 2
      },
      {
        fechaHora: new Date('2024-02-20T18:00:00'),
        evento_id: 3
      },
      {
        fechaHora: new Date('2024-02-25T16:00:00'),
        evento_id: 4
      }
    ], {});

    // 2. Obtener los IDs generados de Notificacion
    const notificaciones = await queryInterface.sequelize.query(
      `SELECT notificacion_id FROM "Notificacion" ORDER BY notificacion_id ASC;`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const notifIds = notificaciones.map(n => n.notificacion_id);

    // 3. Insertar Invitaciones usando los IDs de Notificacion
    await queryInterface.bulkInsert('Invitacion', [
      {
        notificacion_id: notifIds[0],
        fechaLimite: new Date('2024-02-14T23:59:59')
      },
      {
        notificacion_id: notifIds[1],
        fechaLimite: new Date('2024-02-19T23:59:59')
      },
      {
        notificacion_id: notifIds[2],
        fechaLimite: new Date('2024-02-24T23:59:59')
      },
      {
        notificacion_id: notifIds[3],
        fechaLimite: new Date('2024-02-29T23:59:59')
      }
    ], {});

    // 4. Obtener estado "Pendiente"
    const estadoPendiente = await queryInterface.sequelize.query(
      `SELECT estado_id FROM "EstadoInvitacion" WHERE nombre = 'Pendiente' LIMIT 1;`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const estadoId = estadoPendiente[0]?.estado_id || 1;

    // 5. Insertar InvitacionUsuario (sin IDs, autoincrement)
    await queryInterface.bulkInsert('InvitacionUsuario', [
      // Invitaciones para evento 1 (notifIds[0])
      {
        estado_invitacion_id: estadoId,
        invitacion_id: notifIds[0],
        usuario_id: 2
      },
      {
        estado_invitacion_id: estadoId,
        invitacion_id: notifIds[0],
        usuario_id: 3
      },
      // Invitaciones para evento 2 (notifIds[1])
      {
        estado_invitacion_id: estadoId,
        invitacion_id: notifIds[1],
        usuario_id: 2
      },
      {
        estado_invitacion_id: estadoId,
        invitacion_id: notifIds[1],
        usuario_id: 4
      },
      // Invitaciones para evento 3 (notifIds[2])
      {
        estado_invitacion_id: estadoId,
        invitacion_id: notifIds[2],
        usuario_id: 3
      },
      {
        estado_invitacion_id: estadoId,
        invitacion_id: notifIds[2],
        usuario_id: 5
      },
      // Invitaciones para evento 4 (notifIds[3])
      {
        estado_invitacion_id: estadoId,
        invitacion_id: notifIds[3],
        usuario_id: 2
      },
      {
        estado_invitacion_id: estadoId,
        invitacion_id: notifIds[3],
        usuario_id: 6
      }
    ], {});

    console.log('✅ Seeders de Notificacion, Invitacion e InvitacionUsuario insertados correctamente');
  },

  async down(queryInterface, Sequelize) {
    // Eliminar en orden inverso por las FK
    await queryInterface.bulkDelete('InvitacionUsuario', null, {});
    await queryInterface.bulkDelete('Invitacion', null, {});
    await queryInterface.bulkDelete('Notificacion', null, {});
  }
};
