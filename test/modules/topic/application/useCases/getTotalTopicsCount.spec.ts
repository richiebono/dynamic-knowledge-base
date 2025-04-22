import 'reflect-metadata';
import { GetTotalTopicsCount } from '@topic/application/useCases/getTotalTopicsCount';
import { ITopicRepository } from '@topic/domain/interfaces/topicRepository';
import { mock, instance, when, verify } from 'ts-mockito';

describe('GetTotalTopicsCount', () => {
  let topicRepository: ITopicRepository;
  let getTotalTopicsCount: GetTotalTopicsCount;

  beforeEach(() => {
    topicRepository = mock<ITopicRepository>();
    getTotalTopicsCount = new GetTotalTopicsCount(instance(topicRepository));
  });

  it('should return the total number of topics', async () => {
    // Arrange
    const expectedCount = 42;
    when(topicRepository.getTotalTopicsCount()).thenResolve(expectedCount);

    // Act
    const result = await getTotalTopicsCount.execute();

    // Assert
    verify(topicRepository.getTotalTopicsCount()).once();
    expect(result).toBe(expectedCount);
  });

  it('should return zero when there are no topics', async () => {
    // Arrange
    when(topicRepository.getTotalTopicsCount()).thenResolve(0);

    // Act
    const result = await getTotalTopicsCount.execute();

    // Assert
    expect(result).toBe(0);
  });
});
