/* global google */
import { useEffect, useState } from 'react';
import { apiCall } from '../helpers/helpers';

const useGoogleOAuth = (callback) => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [client, setClient] = useState(null);

  useEffect(() => {
    setClient(google.accounts.oauth2.initTokenClient({
      client_id: '155679089529-vgjnspusl7a28vt5m4r0jsu2o31rvdhq.apps.googleusercontent.com',
      scope: 'https://www.googleapis.com/auth/fitness.activity.read https://www.googleapis.com/auth/fitness.activity.write https://www.googleapis.com/auth/fitness.nutrition.write',
      callback: handleCredentialResponse,
    }));
  }, []);

  async function handleCredentialResponse (response) {
    console.log(response);
    if (response.error) {
      setIsSignedIn(false);
    } else {
      const mvuser = localStorage.getItem('mvuser')

      const body = {
        token: response.access_token,
        expires_in: response.expires_in,
        id: mvuser,
      }

      const data = await apiCall('/fitness/token/store', 'POST', body)
      console.log(data);
      setIsSignedIn(true);
      if (callback) callback();
    }
  }

  return {
    isSignedIn,
    client
  };
}

export default useGoogleOAuth;
