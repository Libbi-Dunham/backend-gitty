const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const GithubUser = require('../lib/models/GithubUser');

jest.mock('../lib/utils/github');

describe('backend-gitty routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('redirect to the github oauth when logged in', async () => {
    const req = await request(app).get('/api/v1/github/login');
    expect(req.header.location).toMatch(
      /https:\/\/github.com\/login\/oauth\/authorize\?client_id=[\w\d]+&scope=user&redirect_uri=http:\/\/localhost:7890\/api\/v1\/github\/login\/callback/i
    );
  });

  it('should login and redirect users to /api/v1/github/dashboard', async () => {
    const res = await request
      .agent(app)
      .get('/api/v1/github/login/callback?code=42')
      .redirects(1);
    expect(res.req.path).toEqual('/api/v1/posts');
    // console.log(req.body);
    // expect(req.body).toEqual({
    //   id: expect.any(String),
    //   username: 'fake_github_user',
    //   email: 'not-real@example.com',
    //   iat: expect.any(Number),
    //   exp: expect.any(Number),
    // });
  });

  it('should sign out a user', async () => {
    const agent = request.agent(app);
    await GithubUser.insert({
      username: 'fake_github_user',
      email: 'not-real@example.com',
    });
    await agent
      .post('/api/v1/github/login')
      .send({ username: 'fake_github_user', email: 'not-real@example.com' });

    const res = await agent.delete('/api/v1/github/login');
    expect(res.body).toEqual({
      success: true,
      message: 'Successfully signed out',
    });
  });
});
