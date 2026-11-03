const target = {};
let depth = 0;

const proxy = new Proxy(target, {
    get(t, p, receiver) {
        depth++;
        if (depth > 50000) {
            throw new Error(`[🔥] Límite de profundidad alcanzado en recursión: ${depth}`);
        }
        return Reflect.get(t, p, receiver);
    }
});

function recurse(obj) {
    return obj.nonExistentProperty;
}

try {
    %PrepareFunctionForOptimization(recurse);
    recurse(proxy);
} catch (e) {
    console.log("[⚡] Excepción capturada:", e.message);
    console.log("[⚡] Profundidad evaluada:", depth);
    try {
        %DebugPrint(proxy);
    } catch (err) {
        console.log("[!] DebugPrint bloqueado:", err.message);
    }
}
