import { Sequelize, DataTypes } from 'sequelize';

// Crea la conexión, define los modelos y sus asociaciones en un solo lugar
export const initDatabase = async (storage) => {
  const sequelize = new Sequelize({ dialect: 'sqlite', storage, logging: false });

  const Duenio = sequelize.define('Duenio', {
    nombre: { type: DataTypes.STRING(100), allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    telefono: { type: DataTypes.STRING(20) }
  }, { tableName: 'duenios' });

  const Mascota = sequelize.define('Mascota', {
    nombre: { type: DataTypes.STRING(100), allowNull: false },
    especie: { type: DataTypes.STRING(20), allowNull: false },
    raza: { type: DataTypes.STRING(100) },
    fechaNacimiento: { type: DataTypes.DATEONLY }
  }, { tableName: 'mascotas' });

  const Turno = sequelize.define('Turno', {
    fechaHora: { type: DataTypes.DATE, allowNull: false },
    motivo: { type: DataTypes.STRING, allowNull: false },
    estado: { type: DataTypes.STRING(20), allowNull: false, defaultValue: 'pendiente' }
  }, { tableName: 'turnos' });

  // Asociaciones 1 a N
  Duenio.hasMany(Mascota, { foreignKey: { name: 'duenioId', allowNull: false }, as: 'mascotas' });
  Mascota.belongsTo(Duenio, { foreignKey: 'duenioId', as: 'duenio' });

  Mascota.hasMany(Turno, { foreignKey: { name: 'mascotaId', allowNull: false }, as: 'turnos' });
  Turno.belongsTo(Mascota, { foreignKey: 'mascotaId', as: 'mascota' });

  // Crea las tablas si no existen
  await sequelize.sync();

  return { sequelize, Duenio, Mascota, Turno };
};