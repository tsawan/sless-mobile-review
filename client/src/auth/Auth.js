import auth0 from 'auth0-js';
import { authConfig } from '../config';

// set this flag to true and add tokens from auth0 to 
// run the application with fixed auth session.
// this will speed up the development by avoiding login
const NO_AUTH = false;

const _ACCESS_TOKEN = "";
const _ID_TOKEN = "";

export default class Auth {
  accessToken;
  idToken;
  expiresAt;
  auth0;

  constructor(history) {
    this.history = history

    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.getAccessToken = this.getAccessToken.bind(this);
    this.getIdToken = this.getIdToken.bind(this);
    this.renewSession = this.renewSession.bind(this);

    if (NO_AUTH) {
      this.accessToken = _ACCESS_TOKEN
      this.idToken = _ID_TOKEN
    }
    else {
      this.auth0 = new auth0.WebAuth({
        domain: authConfig.domain,
        clientID: authConfig.clientId,
        redirectUri: authConfig.callbackUrl,
        responseType: 'token id_token',
        scope: 'openid'
      });
    }
  }

  login() {
    if (!NO_AUTH) this.auth0.authorize();
  }

  handleAuthentication() {
    if (NO_AUTH) {
      this.setSession({})
      return;
    }
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        console.log('Access token: ', authResult.accessToken)
        console.log('id token: ', authResult.idToken)
        this.setSession(authResult);
      } else if (err) {
        this.history.replace('/');
        console.log(err);
        alert(`Error: ${err.error}. Check the console for further details.`);
      }
    });
  }

  getAccessToken() {
    return this.accessToken;
  }

  getIdToken() {
    return this.idToken;
  }

  setSession(authResult) {
    // Set isLoggedIn flag in localStorage
    localStorage.setItem('isLoggedIn', 'true');

    // Set the time that the access token will expire at
    if (NO_AUTH) {
      this.accessToken = "10WLCnWJ_CNeTngu3D3D7AJKIRn7lbpn"
      this.idToken = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlEwTTVPRFZGTVRBek5qbEZORU16UTBJM05UWkdOelJGTkRFMk1EUTFPRE14T0RGRE9EazVRdyJ9.eyJpc3MiOiJodHRwczovL3RhaGlyLXNsZXNzLmF1dGgwLmNvbS8iLCJzdWIiOiJnb29nbGUtb2F1dGgyfDExNDIzOTMxOTE0NTI4OTAzMzIzNSIsImF1ZCI6ImN3dlFaYUtSYUdjMmRQTUhiRTNEOWN4SmlMNkxOSnZiIiwiaWF0IjoxNTg2NDIwNjQwLCJleHAiOjE1ODY0NTY2NDAsImF0X2hhc2giOiJrSmloZEFiLVhvWjJTUkdhYURJd0VRIiwibm9uY2UiOiJaVnc1TGdvOGJ3RUYxNHFVMElicWYxVn5PVkxDaHZaMyJ9.dWlkJGQ1A7WjPlmOb6q-M_hM_TNfpu9JYosUWALofmsW8o3A8nBHq5u_WqI-Q51J9iHyg6F7U-JKJIuII4dlq-h-kwt_-KO9_pDm3RWb1GMJLwwQ4HgY00cOFoaSy03YFYetp9A-y3yojkWXUWkv8yo_GetPZJ3hTcdkrh9TF782mP-XQEY2x2LlBk-5L1Cc5ZuJTf4zyfb2klv2M-KvcBVVP6Qi9pwcupah5uBA2Y9xRyWeHndJRCEacXwSb5SVkYe1JJGRjWJjMuZ8USDrjtdqWb3aEh6iSpgosZqm1JM4QVELkGTwFdJe14lKUdbsuAj1daZ_9SafWarPmq7mhw"
  
    }
    else {
    let expiresAt = (authResult.expiresIn * 1000) + new Date().getTime();
    this.accessToken = authResult.accessToken;
    this.idToken = authResult.idToken;
    this.expiresAt = expiresAt;
    }
    // navigate to the home route
    this.history.replace('/');
  }

  renewSession() {
    console.log('called renewSession')
    this.auth0.checkSession({}, (err, authResult) => {
       if (authResult && authResult.accessToken && authResult.idToken) {
         this.setSession(authResult);
       } else if (err) {
         this.logout();
         console.log(err);
         alert(`Could not get a new token (${err.error}: ${err.error_description}).`);
       }
    });
  }

  logout() {
    if (NO_AUTH) return;

    // Remove tokens and expiry time
    this.accessToken = null;
    this.idToken = null;
    this.expiresAt = 0;

    // Remove isLoggedIn flag from localStorage
    localStorage.removeItem('isLoggedIn');

    this.auth0.logout({
      return_to: window.location.origin
    });

    // navigate to the home route
    this.history.replace('/');
  }

  isAuthenticated() {
    // Check whether the current time is past the
    // access token's expiry time
    if (NO_AUTH) return true;

    let expiresAt = this.expiresAt;
    return new Date().getTime() < expiresAt;
  }
}
