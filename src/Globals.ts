import { SudoUtilities } from "./SudoUtilities/Sudo";

export class Globals {

    public static registerGlobals() {

        (globalThis as any).IncludeSudoUtilities = () => {
           (globalThis as any).SudoUtilities = SudoUtilities;
        }


    }

}