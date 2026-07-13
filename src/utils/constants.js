// Co the dung import.meta.env
let apiRoot = ''
if (process.env.BUILD_MODE === 'dev') {
  apiRoot = 'http://localhost:8017'
}

if (process.env.BUILD_MODE === 'production') {
  apiRoot = 'https://trello-backend-rdgn.onrender.com'
}

export const API_ROOT = apiRoot