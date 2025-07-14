const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("./database/expenses.db");

db.serialize(() => {
  db.run(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  discord_id TEXT UNIQUE NOT NULL,
  username TEXT
);
  `) , (err) => {
    if (err) console.error('Error creating users table:', err);
}


db.run(`CREATE TABLE IF NOT EXISTS expenses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  amount REAL NOT NULL,
  note TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);` , (err) => {
  if (err) {
    console.error('Error creating expenses table:', err);
  }
})

});

module.exports = db;
