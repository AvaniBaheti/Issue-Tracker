import {describe, expect, it} from '@jest/globals';
describe('User API', () => {
  let userId;

  it('should add a user', async () => {
    const url = 'http://localhost:3000/api/addUser';
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'testuser@example.com',
      }),
    };

    const response = await fetch(url, options);
    const data = await response.json();
    console.log('POST data:', data);
    userId = data.user.id;
    console.log(userId);
    expect(response.status).toBe(200);
    expect(data.message).toBe('User added successfully');
  }, 50000);

  it('should get users', async () => {
    const url = 'http://localhost:3000/api/users';
    const options = {
      method: 'GET',
    };

    const response = await fetch(url, options);
    const data = await response.json();
    console.log('GET data:', data);
    expect(response.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
  }, 50000);

  it('should delete a user', async () => {
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
    console.log('DELETE response text:', text);
    
    let data;
    try {
      data = JSON.parse(text); 
    } catch (error) {
      console.error('Error parsing JSON response:', error);
      data = { message: text }; 
    }

    console.log('DELETE response data:', data);
    expect(response.status).toBe(200);
    expect(data.message).toBe('User deleted successfully');
  }, 50000);
});
