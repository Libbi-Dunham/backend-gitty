const pool = require('../utils/pool');

module.exports = class GithubUser {
  id;
  username;
  email;

  constructor(row) {
    this.id = row.id;
    this.username = row.username;
    this.email = row.email;
  }

  static insert({ username, email }) {
    if (!username) throw new Error('require username');

    return pool
      .query(
        'INSERT INTO github_users (username, email) VALUES ($1, $2) RETURNING *',
        [username, email]
      )
      .then(({ rows }) => new GithubUser(rows[0]));
  }

  static findByUsername(username) {
    return pool
      .query('SELECT * FROM github_users WHERE username=$1', [username])

      .then(({ rows }) => {
        if (!rows[0]) {
          return null;
        } else {
          new GithubUser(rows[0]);
        }
      });
  }

  toJSON() {
    return { ...this };
  }
};
