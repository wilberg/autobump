export type AstNode<T extends string> = {
    type: T
    from: number
    to: number
}