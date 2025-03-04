require('dotenv').config();
const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');
const { DB_DEP } = process.env;

const sequelize = new Sequelize(
   DB_DEP,
   {
      logging: false, // set to console.log to see the raw SQL queries
      native: false, // lets Sequelize know we can use pg-native for ~30% more speed
   }
);

const basename = path.basename(__filename);

const modelDefiners = [];

// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
fs.readdirSync(path.join(__dirname, '/Models'))
   .filter(
      (file) =>
         file.indexOf('.') !== 0 &&
         file !== basename &&
         file.slice(-3) === '.js'
   )
   .forEach((file) => {
      modelDefiners.push(require(path.join(__dirname, '/Models', file)));
   });

// Injectamos la conexion (sequelize) a todos los modelos
modelDefiners.forEach((model) => model(sequelize));
// Capitalizamos los nombres de los modelos ie: product => Product
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [
   entry[0][0].toUpperCase() + entry[0].slice(1),
   entry[1],
]);
sequelize.models = Object.fromEntries(capsEntries);

// En sequelize.models están todos los modelos importados como propiedades
// Para relacionarlos hacemos un destructuring
const { Order, Cart, Product, PromotionCode, ReviewRating, Sales, User } = sequelize.models;


//muchos a muchos
Product.belongsToMany(User, {through: 'product_user'})
User.belongsToMany(Product, {through: 'product_user'})
PromotionCode.belongsToMany(User, {through: 'product_promotionCode'})
User.belongsToMany(PromotionCode, {through: 'product_promotionCode'})
Cart.belongsToMany(Product, { through: 'product_cart' });
// Cart.belongsToMany(Product, {
//    through: {
//      model: 'product_cart',
//      unique: false,
//      // Add the quantity attribute to the through table
//      // If you've already added the column to the table, you can omit the defaultValue option
//      defaults: {
//        quantity: {
//          type: DataTypes.INTEGER,
//          allowNull: false,
//          defaultValue: 1, // Set a default value if needed
//        },
//      },
//    },
//    foreignKey: 'cartId',
//  });
Product.belongsToMany(Cart, { through: 'product_cart' });

//uno a muchos
Product.hasMany(ReviewRating, { foreignKey: 'productId' });
ReviewRating.belongsTo(Product, { foreignKey: 'productId' });

//uno a uno
User.hasOne(Cart, { foreignKey: 'userId' });
Cart.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
   ...sequelize.models, // para poder importar los modelos así: const { Product, User } = require('./db.js');
   conn: sequelize, // para importart la conexión { conn } = require('./db.js');
};

