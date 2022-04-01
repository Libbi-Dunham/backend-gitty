const pool = require('../utils/pool');

module.exports = class Post {
  id;
  title;
  content;

  constructor(row) {
    this.id = row.id;
    this.title = row.title;
    this.content = row.content;
  }

  static async insert({ title, content }) {
    const { rows } = await pool.query(
      'INSERT INTO posts (title, content) VALUES ($1, $2) RETURNING *',
      [title, content]
    );
    return new Post(rows[0]);
  }

  static async getPosts() {
    const { rows } = await pool.query('SELECT * FROM posts');
    return rows.map((row) => new Post(row));
  }
};
