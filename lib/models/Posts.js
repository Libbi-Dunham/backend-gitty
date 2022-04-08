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

  static insert({ title, content }) {
    return pool
      .query('INSERT INTO posts (title, content) VALUES ($1, $2) RETURNING *', [
        title,
        content,
      ])
      .then(({ rows }) => new Post(rows[0]));
  }

  static getPosts() {
    return pool
      .query('SELECT * FROM posts')
      .then(({ rows }) => rows.map((row) => new Post(row)));
  }
};
