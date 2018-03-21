import * as firebase from 'firebase';

export async function login (email, pass) {
    try {
        await firebase.auth()
            .signInWithEmailAndPassword(email, pass);
            firebase.auth();

    } catch (error) {
        console.log(error.toString())
    }    
}

export async function signUp(email, pass) {
    try {
        await firebase.auth()
            .createUserWithEmailAndPassword(email, pass);

    } catch (error) {
        console.log(error.toString())
    }
}

const promiseLogin = (email,pass) => {
    new Promise((resolve, reject) => {
        this.login(email,pass)
        resolve('Login succed')
        reject('errooooooooor')
    });
}

export {promiseLogin} ; 