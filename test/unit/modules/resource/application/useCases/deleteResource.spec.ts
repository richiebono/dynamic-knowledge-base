import 'reflect-metadata';
import { DeleteResource } from '@resource/application/useCases/deleteResource';
import { IResourceRepository } from '@resource/domain/interfaces/resourceRepository';
import { mock, instance, verify, when } from 'ts-mockito';

describe('DeleteResource UseCase', () => {
  let resourceRepository: IResourceRepository;
  let deleteResource: DeleteResource;
  
  beforeEach(() => {
    resourceRepository = mock<IResourceRepository>();
    deleteResource = new DeleteResource(instance(resourceRepository));
  });
  
  it('should delete a resource by ID', async () => {
    const resourceId = 'resource-id';
    
    when(resourceRepository.delete(resourceId)).thenResolve();
    
    await deleteResource.execute(resourceId);
    
    verify(resourceRepository.delete(resourceId)).once();
  });
});
