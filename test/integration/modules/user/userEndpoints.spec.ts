import 'reflect-metadata';
import { TestHelper } from '@test/integration/testHelper';
import { UserRoleEnum } from '@shared/domain/enum/userRole';

describe('User API Endpoints', () => {
  const testHelper = TestHelper.getInstance();
  
  beforeAll(async () => {
    await testHelper.initializeApp();
  });
  
  afterAll(async () => {
    await testHelper.cleanupApp();
  });
  
  describe('POST /api/users/login', () => {
    it('should register a new user and then login successfully', async () => {
      const password = 'Test@12345';
      
      const timestamp = new Date().getTime();
      const uniqueEmail = `test${timestamp}@example.com`;
      
      const userData = {
        name: 'Test User',
        email: uniqueEmail,
        password: password, 
        role: UserRoleEnum.Admin
      };
      
      await testHelper.getRequest()
        .post('/api/users')
        .send(userData)
        .expect(201);
        
      console.log('User created successfully');

      const loginData = {
        email: uniqueEmail,
        password: password
      };
      
      const loginResponse = await testHelper.getRequest()
        .post('/api/users/login')
        .send(loginData)
        .expect(200);
        
      expect(loginResponse.body).toHaveProperty('token');

      
      
    });
    
    it('should return 401 with invalid credentials', async () => {
      const timestamp = new Date().getTime();
      const nonExistentEmail = `nonexistent${timestamp}@example.com`;
      
      const invalidLoginData = {
        email: nonExistentEmail,
        password: 'wrongpassword'
      };
      
      await testHelper.getRequest()
        .post('/api/users/login')
        .send(invalidLoginData)
        .expect(401);
    });
  });
  
  describe('GET /api/users', () => {
    it('should return users when authenticated with admin role', async () => {
      const token = testHelper.generateAuthToken(UserRoleEnum.Admin);
      
      const response = await testHelper.getRequest()
        .get('/api/users')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
        
      expect(response.body).toHaveProperty('users');
      expect(response.body).toHaveProperty('total');
    });
    
    it('should return 403 when authenticated with insufficient permissions', async () => {
      const token = testHelper.generateAuthToken(UserRoleEnum.Viewer);
      
      await testHelper.getRequest()
        .get('/api/users')
        .set('Authorization', `Bearer ${token}`)
        .expect(403);
    });
    
    it('should return 401 when not authenticated', async () => {
      await testHelper.getRequest()
        .get('/api/users')
        .expect(401);
    });
  });
  
  describe('GET /api/users/:id', () => {
    it('should return a user by ID when authenticated', async () => {
      const token = testHelper.generateAuthToken(UserRoleEnum.Admin);
      
      const allUsersResponse = await testHelper.getRequest()
        .get('/api/users')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
      
      const userId = allUsersResponse.body.users[0]?.id;
      
      if (userId) {
        const response = await testHelper.getRequest()
          .get(`/api/users/${userId}`)
          .set('Authorization', `Bearer ${token}`)
          .expect(200);
          
        expect(response.body).toHaveProperty('id', userId);
        
        await testHelper.getRequest()
          .delete(`/api/users/${userId}`)
          .set('Authorization', `Bearer ${token}`)
          .expect(204);
          
        console.log('User deleted successfully');

      } else {
        console.warn('No users found to test GET /api/users/:id endpoint');
      }
    });
  });
});