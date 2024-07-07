import {describe, expect, it} from '@jest/globals';
describe('Issue API', () => {
  let userId;
  let issueId;

  it('should add a user', async () => {
    const url = 'http://localhost:3000/api/addUser';
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User 2',
        email: 'testuser2@example.com',
      }),
    };

    const response = await fetch(url, options);
    const data = await response.json();
    console.log('POST user data:', data);
    userId = data.user.id;
    expect(response.status).toBe(200);
    expect(data.message).toBe('User added successfully');
  }, 50000);

  it('should create an issue', async () => {
    const url = 'http://localhost:3000/api/issues';
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: 'Test Issue',
        description: 'This is a test issue.',
        status: 'OPEN',
        priority: 'HIGH',
        assignee: userId,
      }),
    };

    const response = await fetch(url, options);
    const data = await response.json();
    console.log('POST issue data:', data);
    issueId = data.id;
    expect(response.status).toBe(200);
    expect(data.title).toBe('Test Issue');
  }, 50000);

  it('should update the issue status to closed', async () => {
    const url = `http://localhost:3000/api/issues/${issueId}`;
    const options = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: 'CLOSED',
      }),
    };

    const response = await fetch(url, options);
    const data = await response.json();
    console.log('PATCH issue data:', data);
    expect(response.status).toBe(200);
    expect(data.status).toBe('CLOSED');
  }, 50000);

  it('should delete the issue', async () => {
    const url = `http://localhost:3000/api/issues/${issueId}`;
    const options = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const response = await fetch(url, options);
    const text = await response.text();
    console.log('DELETE issue response text:', text);

    let data;
    try {
      data = JSON.parse(text);
    } catch (error) {
      console.error('Error parsing JSON response:', error);
      data = { message: text };
    }

    console.log('DELETE issue response data:', data);
    expect(response.status).toBe(200);
    expect(data.message).toBe('Issue deleted successfully');
  }, 50000);

  it('should delete the user', async () => {
    const url = 'http://localhost:3000/api/users';
    const options = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: userId,
      }),
    };

    const response = await fetch(url, options);
    const text = await response.text();
    console.log('DELETE user response text:', text);

    let data;
    try {
      data = JSON.parse(text);
    } catch (error) {
      console.error('Error parsing JSON response:', error);
      data = { message: text };
    }

    console.log('DELETE user response data:', data);
    expect(response.status).toBe(200);
    expect(data.message).toBe('User deleted successfully');
  }, 50000);
});
