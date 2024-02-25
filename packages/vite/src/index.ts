import { compile, JSAdapter } from '@tagup/compiler';
import { type Plugin } from "vite";

export default (): Plugin => ({
    name: "Tagup Plugin",
    transform(code, id) {
        if (id.split('/').pop()?.split('.').pop() === 'tu') {
            return `export default ${compile(code, JSAdapter)}`
        }
        return code;
    }
})