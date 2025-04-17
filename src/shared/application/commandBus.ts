import { injectable } from 'inversify';

@injectable()
export class CommandBus {
    private handlers: { [key: string]: Function } = {};

    register(commandName: string, handler: Function): void {
        this.handlers[commandName] = handler;
    }

    async execute(commandName: string, command: any): Promise<any> {
        const handler = this.handlers[commandName];
        if (!handler) {
            throw new Error(`No handler registered for command: ${commandName}`);
        }
        return await handler(command);
    }
}