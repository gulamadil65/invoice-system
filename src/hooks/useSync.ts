// import { useState, useEffect } from 'react';
// import { initializeApp } from 'firebase/app';
// import { getDatabase, ref, set, get } from 'firebase/database';
// import { openDB, IDBPDatabase } from 'idb';
// // import { SyncData } from '../types/syncTypes';

// // Initialize Firebase (replace with your config)
// const firebaseConfig = {
//   // Your Firebase configuration
// };

// const app = initializeApp(firebaseConfig);
// const db = getDatabase(app);

// export function useSync() {
//   const [isOnline, setIsOnline] = useState(navigator.onLine);
//   const [localDb, setLocalDb] = useState<IDBPDatabase | null>(null);

//   useEffect(() => {
//     const handleOnline = () => setIsOnline(true);
//     const handleOffline = () => setIsOnline(false);

//     window.addEventListener('online', handleOnline);
//     window.addEventListener('offline', handleOffline);

//     // Initialize IndexedDB
//     openDB('invoiceDB', 1, {
//       upgrade(db) {
//         db.createObjectStore('syncData');
//       },
//     }).then(setLocalDb);

//     return () => {
//       window.removeEventListener('online', handleOnline);
//       window.removeEventListener('offline', handleOffline);
//     };
//   }, []);

//   const syncData = async (userId: string, data: SyncData): Promise<void> => {
//     if (isOnline) {
//       // Sync with Firebase
//       const userRef = ref(db, `users/${userId}`);
//       await set(userRef, data);
//     } else {
//       // Store locally
//       if (localDb) {
//         const tx = localDb.transaction('syncData', 'readwrite');
//         await tx.store.put(data, userId);
//       }
//     }
//   };

//   const getData = async (userId: string): Promise<SyncData | null> => {
//     if (isOnline) {
//       // Get data from Firebase
//       const userRef = ref(db, `users/${userId}`);
//       const snapshot = await get(userRef);
//       return snapshot.val();
//     } else {
//       // Get data from local storage
//       if (localDb) {
//         return await localDb.get('syncData', userId);
//       }
//     }
//     return null;
//   };

//   return { syncData, getData, isOnline };
// }

