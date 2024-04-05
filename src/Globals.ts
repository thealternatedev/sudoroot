import { SudoUtilities } from "./SudoUtilities/Sudo";
import { MAX_ASSIGNED_MEM, MAX_MEM, alloc, clearMemory, getMemory, globalMemory, malloc, mallocI } from "./memory/Memory";

function getGlobalThis() {
    return (globalThis as any);
}

export class Globals {

    public static registerGlobals() {

        getGlobalThis().IncludeSudoUtilities = () => {
           getGlobalThis().SudoUtilities = SudoUtilities;
        }

        getGlobalThis().malloc = malloc;
        getGlobalThis().mallocI = mallocI;
        getGlobalThis().getMemory = getMemory;
        getGlobalThis().memory = globalMemory;
        getGlobalThis().clearMemory = clearMemory;
        getGlobalThis().MAX_ASSIGNED_MEM = MAX_ASSIGNED_MEM;
        getGlobalThis().MAX_MEM = MAX_MEM;
        getGlobalThis().alloc = alloc;


    }

}