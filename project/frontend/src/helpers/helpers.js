import config from './config.json';

export async function apiCall (path, method, body) {
    const options = {
      method,
      headers: {
        'Content-type': 'application/json',
        'Accept': 'application/json'
      },
    };
  
    if (method !== 'GET') {
      options.body = JSON.stringify(body);
    }
  
    if (localStorage.getItem('token')) {
      options.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
    }
  
    const response = await fetch(`http://localhost:${config.BACKEND_PORT}/` + path, options);
    return await response.json();
  }
  
  export async function getSessionId ({ quizId }) {
    const startGameData = await apiCall('admin/quiz/' + quizId + '/start', 'POST', {});
    if (startGameData.error) {
      console.log(startGameData.error);
    }
    const quizData = await apiCall('admin/quiz/' + quizId, 'GET', {});
    if (quizData.error) {
      console.log(quizData.error);
    } else {
      return quizData.active;
    }
  }