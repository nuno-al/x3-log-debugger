import { writable, get, type Updater } from 'svelte/store'

export function storable<T>(key: string, defvalue?: T) {
   const store = writable<T>(defvalue);
   const { subscribe, set } = store;

   const stored_value = localStorage.getItem(key);
   if (stored_value) {
      set(JSON.parse(stored_value));
   }

   return {
      subscribe,
      set: (new_value: T) => {
         localStorage.setItem(key, JSON.stringify(new_value));
         set(new_value);
      },
      update: (updater: Updater<T>) => {
         const new_value = updater(get(store));

         localStorage.setItem(key, JSON.stringify(new_value));
         set(new_value);
      }
   };
}