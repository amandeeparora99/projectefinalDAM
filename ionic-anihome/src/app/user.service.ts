import { Injectable } from "@angular/core";
import { AngularFireAuth } from '@angular/fire/auth';
import { first } from "rxjs/operators";
import { auth } from "firebase/app";

interface user {
    username: string,
    uid: string
}

@Injectable()
export class UserService {
    private user: user

    constructor(private afAuth: AngularFireAuth) {

    }

    setUser(user: user) {
        this.user = user
    }

    getUsername(): string{
        return this.user.username
    }

    async reAuth(username: string, password: string) {
        return (await this.afAuth.currentUser).reauthenticateWithCredential(auth.EmailAuthProvider.credential(username, password))
    }

    async updatePassword(newpassword: string) {
        return (await (await this.afAuth.currentUser).updatePassword(newpassword))
    }

    async isAuthenticated() {
        if (this.user) return true

        const user = await this.afAuth.authState.pipe(first()).toPromise()

        if(user) {
            this.setUser({
                username: user.email,
                uid: user.uid
            })

            return true
        }
        return false
    }

    getUID(): string {
        return this.user.uid;
    }
}