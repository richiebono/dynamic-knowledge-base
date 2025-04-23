import { CommandBus } from '@shared/application/commandBus';

describe('CommandBus', () => {
  let commandBus: CommandBus;

  beforeEach(() => {
    commandBus = new CommandBus();
  });

  it('should register and execute command handlers', async () => {
    // Arrange
    const mockHandler = jest.fn().mockResolvedValue({ result: 'success' });
    const commandName = 'CreateTopic';
    const commandData = { name: 'Test Topic', content: 'Test Content' };
    
    // Act
    commandBus.register(commandName, mockHandler);
    const result = await commandBus.execute(commandName, commandData);
    
    // Assert
    expect(mockHandler).toHaveBeenCalledWith(commandData);
    expect(result).toEqual({ result: 'success' });
  });

  it('should throw error when executing unregistered command', async () => {
    // Arrange
    const unregisteredCommandName = 'UnregisteredCommand';
    
    // Act & Assert
    await expect(commandBus.execute(unregisteredCommandName, {}))
      .rejects
      .toThrow(`No handler registered for command: ${unregisteredCommandName}`);
  });

  it('should allow overriding a previously registered handler', async () => {
    // Arrange
    const commandName = 'UpdateTopic';
    const firstHandler = jest.fn().mockResolvedValue({ version: 1 });
    const secondHandler = jest.fn().mockResolvedValue({ version: 2 });
    
    // Act
    commandBus.register(commandName, firstHandler);
    commandBus.register(commandName, secondHandler);
    const result = await commandBus.execute(commandName, {});
    
    // Assert
    expect(firstHandler).not.toHaveBeenCalled();
    expect(secondHandler).toHaveBeenCalled();
    expect(result).toEqual({ version: 2 });
  });
});
