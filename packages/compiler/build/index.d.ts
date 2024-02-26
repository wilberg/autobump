declare type Adapter<T = string> = (program: Program) => T;

declare type AstNode<T extends string> = {
    type: T
    from: number
    to: number
}

export declare function compile<T = string>(source: string, adapter?: Adapter<T>): T;

declare type Fragment = AstNode<"Fragment"> & {
    content: AstNode<string>[]
}

export declare const JSAdapter: Adapter<string>;

declare type Program = AstNode<"Program"> & {
    fragment: Fragment;
}

export { }
