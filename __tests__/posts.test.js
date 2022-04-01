const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

jest.mock('../lib/utils/github');

describe('backend-gitty routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('should be able to list all posts', async () => {
    const agent = request.agent(app);
    await request(app).get('/api/v1/github/login');
    await agent.get('/api/v1/github/login/callback?code=42').redirects(1);

    const firstPost = {
      id: expect.any(String),
      title: 'first post',
      content: 'hello',
    };

    const secondPost = {
      id: expect.any(String),
      title: 'second post',
      content: 'bye',
    };
    const res = await agent.get('/api/v1/posts');
    expect(res.body).toEqual([firstPost, secondPost]);
  });
});
