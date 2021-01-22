const db = require("./db.js");

findAll = async (tableName) => {
  try {
    const queryString = `SELECT * FROM ${tableName};`;
    const response = await db.query(queryString);
    return response;
  } catch (err) {
    console.log(err);
  }
};

findById = async (tableName, id) => {
  try {
    const queryString = `SELECT * FROM ${tableName} WHERE id=${id};`;
    const response = await db.query(queryString);
    return response;
  } catch (err) {
    console.log(err);
  }
};

createNewEntry = async (tableName, body) => {
  try {
    const columns = Object.keys(body);
    const values = Object.values(body);
    const queryString = `INSERT INTO ${tableName} (${columns.join(",")}, created_at, updated_at) VALUES (${values
      .map((v) => `'${v}'`)
      .join(",")}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);`;
    const response = await db.query(queryString);
    return response;
  } catch (err) {
    console.log(err);
  }
};

findByIdAndUpdate = async (tableName, id, body) => {
  try {
    const entries = Object.entries(body);
    const queryString = `UPDATE ${tableName} SET ${entries
      .map(([column, value]) => `${column}='${value}'`)
      .join(",")}, updated_at=CURRENT_TIMESTAMP WHERE id=${parseInt(id)};`;
    const response = await db.query(queryString);
    return response;
  } catch (err) {
    console.log(err);
  }
};

findByIdAndDelete = async (tableName, id) => {
  try {
    const queryString = `DELETE FROM ${tableName} WHERE id=${id}`;
    const response = await db.query(queryString);
    return response;
  } catch (err) {
    console.log(err);
  }
};

findProductWithCategory = async (id) => {
  try {
    const queryString = `SELECT p.id, p.headline, p.content, p.cover, c.name as category_name, p.created_at, p.updated_at
    FROM products as p
    INNER JOIN categories as c ON a.category_id = c.id
    WHERE a.id = ${id}`;
    const response = await db.query(queryString);
    return response;
  } catch (err) {
    console.log(err);
  }
};

findByNameSearch = async (tableName, searchterm) => {
  try {
    const queryString = `SELECT * FROM ${tableName} WHERE name LIKE '%${searchterm}%'`;
    const response = await db.query(queryString);
    return response;
  } catch (err) {
    console.log(err);
  }
};

findByDescriptionSearch = async (tableName, searchterm) => {
  try {
    const queryString = `SELECT * FROM ${tableName} WHERE description LIKE '%${searchterm}%'`;
    const response = await db.query(queryString);
    return response;
  } catch (err) {
    console.log(err);
  }
};

getProductCountByCategory = async () => {
  try {
    const queryString = `SELECT c.id, c.name, COUNT(p.id) AS total_products FROM categories AS c INNER JOIN products AS p ON p.category_id=c.id GROUP BY (c.id) ORDER BY c.id ASC`;
    const response = await db.query(queryString);
    return response;
  } catch (err) {
    console.log(err);
  }
};

getReviewsCountByProduct = async () => {
  try {
    const queryString = `SELECT p.id as product_id , p.name, p.description, COUNT(r.id) AS total_reviews FROM products AS p INNER JOIN reviews AS r ON r.product_id=p.id GROUP BY (p.id) ORDER BY p.id ASC`;
    const response = await db.query(queryString);
    return response;
  } catch (err) {
    console.log(err);
  }
};

getReviewDataById = async (id) => {
  try {
    const queryString = `SELECT p.id, p.name, p.description, COUNT(r.id) as total_reviews FROM reviews AS r INNER JOIN products AS p ON r.product_id = p.id WHERE p.id=${id} GROUP BY(p.id)
`;
    const response = await db.query(queryString);
    return response;
  } catch (err) {
    console.log(err);
  }
};

getAllCarts = async () => {
  try {
    const queryString = `SELECT u.id AS user_id, u.username, CAST (SUM(p.price) as decimal (8,2)) AS total_cart_price FROM carts as c
    INNER JOIN users AS u ON c.user_id = u.id
    INNER JOIN products AS p ON p.id = c.product_id
    GROUP BY (u.id)
    ORDER BY u.id ASC`;
    let response = await db.query(queryString);
    return response;
  } catch (err) {
    console.log(err);
  }
};

getSingleCart = async (id) => {
  try {
    const queryString = `SELECT u.id AS user_id, u.username, p.id AS product_id, p.name, p.price, p.imageurl FROM carts as c
    INNER JOIN users AS u ON c.user_id = u.id
    INNER JOIN products AS p ON p.id = c.product_id
    WHERE c.user_id = ${parseInt(id)}
    ORDER BY u.id ASC`;
    const response = await db.query(queryString);
    return response;
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  findAll,
  findById,
  createNewEntry,
  findByIdAndUpdate,
  findByIdAndDelete,
  findProductWithCategory,
  findByNameSearch,
  findByDescriptionSearch,
  getProductCountByCategory,
  getReviewsCountByProduct,
  getReviewDataById,
  getAllCarts,
  getSingleCart,
};
