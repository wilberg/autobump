declare module "*.tu" {
    const value: (data: Record<string, unknown>) => string;
    export default value;
  }