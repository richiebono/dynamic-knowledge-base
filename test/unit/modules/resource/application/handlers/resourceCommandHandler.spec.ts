import 'reflect-metadata';
import { ResourceCommandHandler } from '@resource/application/handlers/resourceCommandHandler';
import { CreateResource } from '@resource/application/useCases/createResource';
import { UpdateResource } from '@resource/application/useCases/updateResource';
import { DeleteResource } from '@resource/application/useCases/deleteResource';
import { DeleteResourcesByTopicId } from '@resource/application/useCases/deleteResourcesByTopicId';
import { ResourceDTO } from '@resource/application/DTOs/resourceDTO';
import { mock, instance, verify, when } from 'ts-mockito';

describe('ResourceCommandHandler', () => {
    let createResourceUseCase: CreateResource;
    let updateResourceUseCase: UpdateResource;
    let deleteResourceUseCase: DeleteResource;
    let deleteResourcesByTopicIdUseCase: DeleteResourcesByTopicId;
    let resourceCommandHandler: ResourceCommandHandler;

    beforeEach(() => {
        createResourceUseCase = mock(CreateResource);
        updateResourceUseCase = mock(UpdateResource);
        deleteResourceUseCase = mock(DeleteResource);
        deleteResourcesByTopicIdUseCase = mock(DeleteResourcesByTopicId);

        resourceCommandHandler = new ResourceCommandHandler(
            instance(createResourceUseCase),
            instance(updateResourceUseCase),
            instance(deleteResourceUseCase),
            instance(deleteResourcesByTopicIdUseCase)
        );
    });

    it('should call execute on CreateResource use case when createResource is called', async () => {
        const dto: ResourceDTO = {
            id: 'resource-id',
            topicId: 'topic-id',
            url: 'http://example.com',
            description: 'Test resource',
            type: 'article',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        await resourceCommandHandler.createResource(dto);

        verify(createResourceUseCase.execute(dto)).once();
    });

    it('should call execute on UpdateResource use case when updateResource is called', async () => {
        const id = 'resource-id';
        const dto: ResourceDTO = {
            id: 'resource-id',
            topicId: 'topic-id',
            url: 'http://example.com',
            description: 'Updated resource',
            type: 'video',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        await resourceCommandHandler.updateResource(id, dto);

        verify(updateResourceUseCase.execute(id, dto)).once();
    });

    it('should call execute on DeleteResource use case when deleteResource is called', async () => {
        const resourceId = 'resource-id';

        await resourceCommandHandler.deleteResource(resourceId);

        verify(deleteResourceUseCase.execute(resourceId)).once();
    });

    it('should call execute on DeleteResourcesByTopicId use case when deleteResourcesByTopicId is called', async () => {
        const topicId = 'topic-id';

        await resourceCommandHandler.deleteResourcesByTopicId(topicId);

        verify(deleteResourcesByTopicIdUseCase.execute(topicId)).once();
    });
});
