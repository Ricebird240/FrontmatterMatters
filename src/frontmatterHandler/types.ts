export enum CommandTypes {
    CreateWhen = "createWhen",
    Create = "create",
    RemoveValue = "removeValue",
    RemoveKey = "removeKey",
    Replace = "replace",
}

export class Command {
    file: string;
    command: CommandTypes;
    args: string | string[];
}