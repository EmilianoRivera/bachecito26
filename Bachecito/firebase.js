import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { ReactNativeAsyncStorage } from '@react-native-async-storage/async-storage';
import { firebaseConfig } from './firebase-config';
import { getFirestore } from 'firebase/firestore';

const app = initializeApp(firebaseConfig);
const Auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
const db = getFirestore(app);

export { app, Auth, db };