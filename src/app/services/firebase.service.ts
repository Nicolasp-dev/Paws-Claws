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
import { getFirestore, setDoc, doc, getDoc } from '@angular/fire/firestore';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  auth = inject(AngularFireAuth);
  firestore = inject(AngularFirestore);
  utilsSvc = inject(UtilsService);

  // ============ AUTH =============== //
  getAuth() {
    return getAuth();
  }

  // ========= SIGN-IN =========== //
  signIn(user: User): Promise<UserCredential> {
    return signInWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  signUp(user: User): Promise<UserCredential> {
    return createUserWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  updateUser(displayName: string) {
    return updateProfile(getAuth().currentUser!!, { displayName });
  }

  sendRecoveryEmail(email: string) {
    return sendPasswordResetEmail(getAuth(), email);
  }

  // === DB === //
  setDocument(path: string, data: any) {
    return setDoc(doc(getFirestore(), path), data);
  }

  async getDocument(path: string): Promise<DocumentData | undefined> {
    return (await getDoc(doc(getFirestore(), path))).data();
  }

  signOut() {
    getAuth().signOut();
    localStorage.removeItem('user');
    this.utilsSvc.routerLink('/auth');
  }
}
