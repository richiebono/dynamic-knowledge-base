import 'reflect-metadata';
import { ResourceQueryHandler } from '@resource/application/handlers/resourceQueryHandler';
import { GetAllResources } from '@resource/application/useCases/getAllResources';
import { GetTotalResourceCount } from '@resource/application/useCases/getTotalResourceCount';
import { IResourceRepository } from '@resource/domain/interfaces/resourceRepository';
import { ResourceDTO } from '@resource/application/DTOs/resourceDTO';
import { mock, instance, verify, when, anything } from 'ts-mockito';

describe('ResourceQueryHandler', () => {
    let getAllResourcesUseCase: GetAllResources;
    let getTotalResourceCountUseCase: GetTotalResourceCount;
    let resourceRepository: IResourceRepository;
    let resourceQueryHandler: ResourceQueryHandler;

    beforeEach(() => {
        getAllResourcesUseCase = mock(GetAllResources);
        getTotalResourceCountUseCase = mock(GetTotalResourceCount);
        resourceRepository = mock<IResourceRepository>();

        resourceQueryHandler = new ResourceQueryHandler(
            instance(getAllResourcesUseCase),
            instance(getTotalResourceCountUseCase),
            instance(resourceRepository)
        );
    });

    it('should call findById on repository when getResourceById is called', async () => {
        const resourceId = 'resource-id';
        const mockResource = {
            id: resourceId,
            topicId: 'topic-id',
            url: 'http://example.com',
            description: 'Test resource',
            type: 'article',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        when(resourceRepository.findById(resourceId)).thenResolve(mockResource);

        const result = await resourceQueryHandler.getResourceById(resourceId);

        verify(resourceRepository.findById(resourceId)).once();
        expect(result).toEqual({
            id: resourceId,
            topicId: 'topic-id',
            url: 'http://example.com',
            description: 'Test resource',
            type: 'article',
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
        });
    });

    it('should return null when getResourceById is called with non-existent ID', async () => {
        const resourceId = 'non-existent-id';

        when(resourceRepository.findById(resourceId)).thenResolve(null);

        const result = await resourceQueryHandler.getResourceById(resourceId);

        verify(resourceRepository.findById(resourceId)).once();
        expect(result).toBeNull();
    });

    it('should call findByTopicId on repository when getResourcesByTopicId is called', async () => {
        const topicId = 'topic-id';
        const mockResources = [
            {
                id: 'resource-1',
                topicId: topicId,
                url: 'http://example1.com',
                description: 'Test resource 1',
                type: 'article',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                id: 'resource-2',
                topicId: topicId,
                url: 'http://example2.com',
                description: 'Test resource 2',
                type: 'video',
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        ];

        when(resourceRepository.findByTopicId(topicId)).thenResolve(mockResources);

        const result = await resourceQueryHandler.getResourcesByTopicId(topicId);

        verify(resourceRepository.findByTopicId(topicId)).once();
        expect(result).toHaveLength(2);
        expect(result[0].id).toBe('resource-1');
        expect(result[1].id).toBe('resource-2');
    });

    it('should call execute on GetAllResources and GetTotalResourceCount when getAllResources is called', async () => {
        const limit = 10;
        const offset = 0;
        const orderBy = 'createdAt';
        const orderDirection = 'desc';
        const mockResources = {
            resources: [
                {
                    id: 'resource-1',
                    topicId: 'topic-id',
                    url: 'http://example1.com',
                    description: 'Test resource 1',
                    type: 'article',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ],
            limit: 10,
            offset: 0
        };
        const totalCount = 1;

        when(getAllResourcesUseCase.execute(limit, offset, orderBy, orderDirection)).thenResolve(mockResources);
        when(getTotalResourceCountUseCase.execute()).thenResolve(totalCount);

        const result = await resourceQueryHandler.getAllResources(limit, offset, orderBy, orderDirection);

        verify(getAllResourcesUseCase.execute(limit, offset, orderBy, orderDirection)).once();
        verify(getTotalResourceCountUseCase.execute()).once();
        expect(result).toEqual({
            resources: mockResources.resources,
            total: totalCount,
            limit,
            offset
        });
    });
});
