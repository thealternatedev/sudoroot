/*

    Memory Configuration

    This is the memory configuration that has functions like: getMemory(), clearMemory(), malloc(), mallocI()
    It will configure and manage memory based on how much you allocate or how much the object has allocated from memory.
    This file is not configured by the system memory so the amount of memory wont be minded unless it's under 64 GB of memory.

    The list line will check how much assigned memory given and if it's over 64 GB then it will throw a error.
*/

export type Memory = number;
export type MemoryArray = Memory[];

export let globalMemory: MemoryArray = [];
export const MAX_ASSIGNED_MEM = 16_000;
export const MAX_MEM = 64_000;

export function getMemory(): number {
    let i = 0;
    for (const x of globalMemory) i+=x;
    return i;
}

export function clearMemory() {
    globalMemory = [];
}

export function malloc(m: number) {
    if (getMemory() >= MAX_ASSIGNED_MEM) throw new Error("Memory Overflow: Max Memory has been exceeded.");
    if (m >= MAX_ASSIGNED_MEM) throw new Error("Memory Overflow: Allocated value has exceeded the Max Memory Assigned.");
    globalMemory.push(m);
}

export function alloc(o: object) {
    const size = Buffer.byteLength(JSON.stringify(o));
    malloc(size);
}

export function mallocI(I: number, m: number) {
    if (getMemory() >= MAX_ASSIGNED_MEM) throw new Error("Memory Overflow: Max Memory has been exceeded.");
    if (m >= MAX_ASSIGNED_MEM) throw new Error("Memory Overflow: Allocated value has exceeded the Max Memory Assigned.");
    globalMemory[I] = m;
}

/* * */
if (MAX_ASSIGNED_MEM >= MAX_MEM) throw new Error("Memory Maximum: Maximum memory has been reached, please lower the MAX_ASSIGNED_MEM to under 64 GB (64_000)")