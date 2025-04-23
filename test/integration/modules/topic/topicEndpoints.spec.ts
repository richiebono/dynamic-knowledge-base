import 'reflect-metadata';
import { TestHelper } from '@test/integration/testHelper';
import { UserRoleEnum } from '@shared/domain/enum/userRole';

describe('Topic API Endpoints', () => {
  const testHelper = TestHelper.getInstance();
  let token: string;
  let createdTopicId: string;
  
  beforeAll(async () => {
    await testHelper.initializeApp();
    token = testHelper.generateAuthToken(UserRoleEnum.Admin);
  });
  
  afterAll(async () => {
    await testHelper.cleanupApp();
  });
  
  describe('POST /api/topics', () => {
    it('should create a new topic when authenticated with admin role', async () => {
      const topicData = {
        name: 'Test Topic',
        content: 'This is a test topic content for integration testing',
      };
      
      const response = await testHelper.getRequest()
        .post('/api/topics')
        .set('Authorization', `Bearer ${token}`)
        .send(topicData)
        .expect(201);
        
      expect(response.body).toHaveProperty('message', 'Topic created successfully');
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('id');
      
      // Save the created topic ID for later tests
      createdTopicId = response.body.data.id;
    });
    
    it('should return 403 when authenticated with insufficient permissions', async () => {
      const viewerToken = testHelper.generateAuthToken(UserRoleEnum.Viewer);
      
      const topicData = {
        name: 'Unauthorized Topic',
        content: 'This should not be created',
      };
      
      await testHelper.getRequest()
        .post('/api/topics')
        .set('Authorization', `Bearer ${viewerToken}`)
        .send(topicData)
        .expect(403);
    });
    
    it('should return 400 when required fields are missing', async () => {
      const incompleteData = {
        name: 'Incomplete Topic'
        // Missing content field
      };
      
      await testHelper.getRequest()
        .post('/api/topics')
        .set('Authorization', `Bearer ${token}`)
        .send(incompleteData)
        .expect(400);
    });
  });
  
  describe('GET /api/topics', () => {
    it('should return all topics when authenticated with viewer role', async () => {
      const viewerToken = testHelper.generateAuthToken(UserRoleEnum.Viewer);
      
      const response = await testHelper.getRequest()
        .get('/api/topics')
        .set('Authorization', `Bearer ${viewerToken}`)
        .expect(200);
        
      expect(response.body).toHaveProperty('topics');
      expect(response.body).toHaveProperty('total');
      expect(response.body.topics).toBeInstanceOf(Array);
    });
    
    it('should return 401 when not authenticated', async () => {
      await testHelper.getRequest()
        .get('/api/topics')
        .expect(401);
    });
  });
  
  describe('GET /api/topics/:id', () => {
    it('should return a topic by ID when authenticated', async () => {
      // Use the topic created in the POST test
      if (createdTopicId) {
        const response = await testHelper.getRequest()
          .get(`/api/topics/${createdTopicId}`)
          .set('Authorization', `Bearer ${token}`)
          .expect(200);
          
        expect(response.body).toHaveProperty('id', createdTopicId);
        expect(response.body).toHaveProperty('name', 'Test Topic');
        expect(response.body).toHaveProperty('content');
      } else {
        console.warn('No topic created to test GET /api/topics/:id endpoint');
      }
    });
    
    it('should return 404 for a non-existent topic ID', async () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';
      
      await testHelper.getRequest()
        .get(`/api/topics/${nonExistentId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });
  
  describe('PUT /api/topics/:id', () => {
    it('should update a topic when authenticated with admin role', async () => {
      if (createdTopicId) {
        const updateData = {
          name: 'Updated Test Topic',
          content: 'This content has been updated during integration testing',
        };
        
        await testHelper.getRequest()
          .put(`/api/topics/${createdTopicId}`)
          .set('Authorization', `Bearer ${token}`)
          .send(updateData)
          .expect(200);
          
        // Verify the update worked
        const getResponse = await testHelper.getRequest()
          .get(`/api/topics/${createdTopicId}`)
          .set('Authorization', `Bearer ${token}`)
          .expect(200);
          
        expect(getResponse.body).toHaveProperty('name', updateData.name);
        expect(getResponse.body).toHaveProperty('content', updateData.content);
      } else {
        console.warn('No topic created to test PUT /api/topics/:id endpoint');
      }
    });
  });
  
  describe('DELETE /api/topics/:id', () => {
    it('should delete a topic when authenticated with admin role', async () => {
      if (createdTopicId) {
        await testHelper.getRequest()
          .delete(`/api/topics/${createdTopicId}`)
          .set('Authorization', `Bearer ${token}`)
          .expect(200);
          
        // Verify the delete worked
        await testHelper.getRequest()
          .get(`/api/topics/${createdTopicId}`)
          .set('Authorization', `Bearer ${token}`)
          .expect(404);
      } else {
        console.warn('No topic created to test DELETE /api/topics/:id endpoint');
      }
    });
    
    it('should return 403 when authenticated with insufficient permissions', async () => {
      // Create a new topic to delete
      const createResponse = await testHelper.getRequest()
        .post('/api/topics')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Topic To Delete',
          content: 'This topic will be attempted to be deleted by a viewer'
        })
        .expect(201);
        
      const topicId = createResponse.body.data.id;
      
      // Try to delete with viewer role
      const viewerToken = testHelper.generateAuthToken(UserRoleEnum.Viewer);
      
      await testHelper.getRequest()
        .delete(`/api/topics/${topicId}`)
        .set('Authorization', `Bearer ${viewerToken}`)
        .expect(403);
    });
  });
});