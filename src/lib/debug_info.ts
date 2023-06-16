import { storable } from "$lib/storable";

export type DebugInfo = {
    level: number,
    version: number
};

export const debug_info = storable<DebugInfo>('debug_info', {
    level: -1,
    version: 12
});
