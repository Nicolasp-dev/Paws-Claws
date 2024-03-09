import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  sendPasswordResetEmail,
  updateProfile,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  getAuth,
  UserCredential,
} from 'firebase/auth';
import { User } from '../models/user.model';
import { AngularFirestore, DocumentData } from '@angular/fire/compat/firestore';
import {
  getFirestore,
  setDoc,
  doc,
  getDoc,
  addDoc,
  collection,
} from '@angular/fire/firestore';
import { UtilsService } from './utils.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import {
  getStorage,
  uploadString,
  ref,
  getDownloadURL,
} from 'firebase/storage';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  auth = inject(AngularFireAuth);
  firestore = inject(AngularFirestore);
  utilsSvc = inject(UtilsService);
  storage = inject(AngularFireStorage);

  // ============ AUTH =============== //
  getAuth() {
    return getAuth();
  }

  // ========= SIGN-IN =========== //
  signIn(user: User): Promise<UserCredential> {
    return signInWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  // === SIGN-UP === //

  signUp(user: User): Promise<UserCredential> {
    return createUserWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  updateUser(displayName: string) {
    return updateProfile(getAuth().currentUser!!, { displayName });
  }

  sendRecoveryEmail(email: string) {
    return sendPasswordResetEmail(getAuth(), email);
  }

  // ============= DB ============= //

  //  === SET DOCUMENT === //
  setDocument(path: string, data: any) {
    return setDoc(doc(getFirestore(), path), data);
  }

  // === RETRIEVE DATA === //
  async getDocument(path: string): Promise<DocumentData | undefined> {
    return (await getDoc(doc(getFirestore(), path))).data();
  }

  // === LOGOUT === //
  signOut() {
    getAuth().signOut();
    localStorage.removeItem('user');
    this.utilsSvc.routerLink('/auth');
  }

  // === ADD NEW DOCUMENT === //
  addDocument(path: string, data: any) {
    return addDoc(collection(getFirestore(), path), data);
  }

  // ============ STORAGE ============= //
  async uploadImage(path: string, data_url: string) {
    return uploadString(ref(getStorage(), path), data_url, 'data_url').then(
      () => {
        return getDownloadURL(ref(getStorage(), path));
      }
    );
  }
}
