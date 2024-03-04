const backendURL = process.env.BACKEND_URL;

export async function apiCall (path, method, body) {
  const options = {
    method,
    headers: {
      'Content-type': 'application/json',
      Accept: 'application/json'
    },
  };

  if (method !== 'GET') {
    options.body = JSON.stringify(body);
  }

  if (localStorage.getItem('token')) {
    options.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
  }

  const response = await fetch(backendURL + path, options);
  return await response.json();
}
