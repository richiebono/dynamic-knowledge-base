import 'reflect-metadata';
import { TestHelper } from '@test/integration/testHelper';
import { UserRoleEnum } from '@shared/domain/enum/userRole';
import { ResourceType } from '@resource/domain/enum/resourceType';

describe('Resource API Endpoints', () => {
  const testHelper = TestHelper.getInstance();
  let adminToken: string;
  let createdTopicId: string;
  let createdResourceId: string;
  
  beforeAll(async () => {
    await testHelper.initializeApp();
    adminToken = testHelper.generateAuthToken(UserRoleEnum.Admin);
    
    const topicResponse = await testHelper.getRequest()
      .post('/api/topics')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Resource Test Topic',
        content: 'This is a topic for testing resources'
      });
      
    createdTopicId = topicResponse.body.data.id;
  });
  
  afterAll(async () => {
    await testHelper.cleanupApp();
  });
  
  describe('POST /api/resources', () => {
    it('should create a new resource when authenticated with admin role', async () => {
      const resourceData = {
        topicId: createdTopicId,
        url: 'https://example.com/resource',
        description: 'Test resource for integration testing',
        type: ResourceType.ARTICLE
      };
      
      const response = await testHelper.getRequest()
        .post('/api/resources')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(resourceData)
        .expect(201);
        
      expect(response.body).toHaveProperty('message', 'Resource created successfully');
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('id');
      
      createdResourceId = response.body.data.id;
    });
    
    it('should return 400 when required fields are missing', async () => {
      const incompleteData = {
        description: 'Resource with missing fields'
      };
      
      await testHelper.getRequest()
        .post('/api/resources')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(incompleteData)
        .expect(400);
    });
    
    it('should return 400 when URL is invalid', async () => {
      const invalidData = {
        topicId: createdTopicId,
        url: 'invalid-url',
        description: 'Resource with invalid URL',
        type: ResourceType.ARTICLE
      };
      
      await testHelper.getRequest()
        .post('/api/resources')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(invalidData)
        .expect(400);
    });
  });
  
  describe('GET /api/resources', () => {
    it('should return all resources when authenticated', async () => {
      const viewerToken = testHelper.generateAuthToken(UserRoleEnum.Viewer);
      
      const response = await testHelper.getRequest()
        .get('/api/resources')
        .set('Authorization', `Bearer ${viewerToken}`)
        .expect(200);
        
      expect(response.body).toHaveProperty('resources');
      expect(response.body).toHaveProperty('total');
      expect(response.body.resources).toBeInstanceOf(Array);
      expect(response.body.resources.length).toBeGreaterThan(0);
    });
    
    it('should return 401 when not authenticated', async () => {
      await testHelper.getRequest()
        .get('/api/resources')
        .expect(401);
    });
  });
  
  describe('GET /api/resources/topic/:topicId', () => {
    it('should return resources for a specific topic', async () => {
      const viewerToken = testHelper.generateAuthToken(UserRoleEnum.Viewer);
      
      const response = await testHelper.getRequest()
        .get(`/api/resources/topic/${createdTopicId}`)
        .set('Authorization', `Bearer ${viewerToken}`)
        .expect(200);
        
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBeGreaterThan(0);      
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('url');
      expect(response.body[0]).toHaveProperty('description');
    });
  });
  
  describe('GET /api/resources/:id', () => {
    it('should return a specific resource by ID', async () => {
      if (createdResourceId) {
        const viewerToken = testHelper.generateAuthToken(UserRoleEnum.Viewer);
        
        const response = await testHelper.getRequest()
          .get(`/api/resources/${createdResourceId}`)
          .set('Authorization', `Bearer ${viewerToken}`)
          .expect(200);
          
        expect(response.body).toHaveProperty('id', createdResourceId);
        expect(response.body).toHaveProperty('url', 'https://example.com/resource');
        expect(response.body).toHaveProperty('description');
        expect(response.body).toHaveProperty('type', ResourceType.ARTICLE);
      } else {
        console.warn('No resource created to test GET /api/resources/:id endpoint');
      }
    });
    
    it('should return 404 for a non-existent resource ID', async () => {
      const viewerToken = testHelper.generateAuthToken(UserRoleEnum.Viewer);
      const nonExistentId = '00000000-0000-0000-0000-000000000000';
      
      await testHelper.getRequest()
        .get(`/api/resources/${nonExistentId}`)
        .set('Authorization', `Bearer ${viewerToken}`)
        .expect(404);
    });
  });
  
  describe('PUT /api/resources/:id', () => {
    it('should update a resource when authenticated with admin role', async () => {
      if (createdResourceId) {
        const updateData = {
          url: 'https://example.com/updated-resource',
          description: 'Updated test resource',
          type: ResourceType.VIDEO
        };
        
        await testHelper.getRequest()
          .put(`/api/resources/${createdResourceId}`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send(updateData)
          .expect(200);
          
        // Verify the update worked
        const getResponse = await testHelper.getRequest()
          .get(`/api/resources/${createdResourceId}`)
          .set('Authorization', `Bearer ${adminToken}`)
          .expect(200);
          
        expect(getResponse.body).toHaveProperty('url', updateData.url);
        expect(getResponse.body).toHaveProperty('description', updateData.description);
        expect(getResponse.body).toHaveProperty('type', updateData.type);
      } else {
        console.warn('No resource created to test PUT /api/resources/:id endpoint');
      }
    });
  });
  
  describe('DELETE /api/resources/:id', () => {
    it('should delete a resource when authenticated with admin role', async () => {
      if (createdResourceId) {
        await testHelper.getRequest()
          .delete(`/api/resources/${createdResourceId}`)
          .set('Authorization', `Bearer ${adminToken}`)
          .expect(204);
          
        // Verify the delete worked
        await testHelper.getRequest()
          .get(`/api/resources/${createdResourceId}`)
          .set('Authorization', `Bearer ${adminToken}`)
          .expect(404);
      } else {
        console.warn('No resource created to test DELETE /api/resources/:id endpoint');
      }
    });
  });
});