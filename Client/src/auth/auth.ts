import { getRedirectResult, GithubAuthProvider, GoogleAuthProvider, signInWithRedirect } from "firebase/auth";
import Cookies from "js-cookie";
import { auth, githubAuthProvider, googleAuthProvider } from "src/services/firebase";

export const signOut = () => {
    Cookies.set("auth-token", "");
    window.location.href = "/";
}


const signInWithEmailLink = async () => {

}

const signInWithGoogle = async () => {
    await signInWithRedirect(auth, googleAuthProvider);
    const result = await getRedirectResult(auth);
    if (!result) throw new Error("Redirect result (google) is null");
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) throw new Error("credential (google) is null");
    Cookies.set("auth-token", credential.accessToken);
}

const signInWithGithub = async () => {
    await signInWithRedirect(auth, githubAuthProvider);
    const result = await getRedirectResult(auth);
    if (!result) throw new Error("Redirect result (github) is null");
    const credential = GithubAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) throw new Error("credential (github) is null");
    Cookies.set("auth-token", credential.accessToken);
}

export const signIn = {
    withEmailLink: signInWithEmailLink,
    withGoogle: signInWithGoogle,
    withGithub: signInWithGithub
}