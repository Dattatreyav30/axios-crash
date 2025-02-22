// GET REQUEST
function getTodos() {
  // axios({
  //   method: 'get',
  //   url: 'https://jsonplaceholder.typicode.com/todos',
  //   params: {
  //     _limit: 5
  //   }
  // })
  //   .then(res => showOutput(res))
  //   .catch(err => console.log(err));
  axios
    .get('https://jsonplaceholder.typicode.com/todos?_limit=5')
    .then(res => showOutput(res))
    .catch(err => console.log(err));
}

// POST REQUEST
function addTodo() {
  // axios({
  //   method: 'post',
  //   url: ' https://jsonplaceholder.typicode.com/todos',
  //   data: {
  //     title: "post one",
  //     completed : false
  //   }
  // })
  // .then(res => showOutput(res))
  // .catch(err => console.log(err));
  axios
    .post('https://jsonplaceholder.typicode.com/todos', { title: 'new todo', completed: false })
    .then(res => showOutput(res))
    .catch(err => console.error(err));
}

// PUT/PATCH REQUEST
function updateTodo() {
  axios
    .patch('https://jsonplaceholder.typicode.com/todos/1', { title: 'updated new todo', completed: true })
    .then(res => showOutput(res))
    .catch(err => console.error(err));
}

// DELETE REQUEST
function removeTodo() {
  axios
    .delete('https://jsonplaceholder.typicode.com/todos/1')
    .then(res => showOutput(res))
    .catch(err => console.error(err));
}

// SIMULTANEOUS DATA
function getData() {
  axios.all([axios
    .get('https://jsonplaceholder.typicode.com/todos?_limit=5'), axios
      .get('https://jsonplaceholder.typicode.com/posts?_limit=5')])
    // .then(res => {
    //   console.log(res[0]);
    //   console.log(res[1]);
    //   showOutput(res[1]);
    // })
    // .catch(err => console.error(err));
    .then(axios.spread((todos, posts) => showOutput(todos)))
    .catch(err => console.error(err));
}

// CUSTOM HEADERS
function customHeaders() {
  const config = {
    headers: {
      'content-type': 'application/json',
      authorization: 'some token'
    }
  };

  axios
    .post('https://jsonplaceholder.typicode.com/todos', { title: 'new todo', completed: false }, config)
    .then(res => showOutput(res))
    .catch(err => console.error(err));
}
// Axious globals

axios.defaults.headers.common['X-AUTH-TOKEN'] = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
// TRANSFORMING REQUESTS & RESPONSE
function transformResponse() {
  const options = {
    method: 'post',
    url: 'https://jsonplaceholder.typicode.com/todos',
    data: {
      title: 'hello world'
    },
    transformResponse: axios.defaults.transformResponse.concat(data => {
      data.title = data.title.toUpperCase();
      return data;
    })
  }

  axios(options).then(res => showOutput(res))
}

// ERROR HANDLING
function errorHandling() {
  axios
    .get('https://jsonplaceholder.typicode.com/todoss',{
      validateStatus:function(status){
        return (status<500); // reject if status greater than 500
      }
    })
    .then(res => showOutput(res))
    .catch(err => {
      if (err.response) {
        // sserver respond to other than 200 status
        console.log(err.response.data);
        console.log(err.response.status);
        console.log(err.response.headers);
        if (err.response.status === 404) {
          alert('ERROR: page not found')
        }
        else if (err.request) {
          // request was made but no response
          console.error(err.request);
        }
        else {
          console.error(err.message);
        }
      }
    });
}

// CANCEL TOKEN
function cancelToken() {

  const source = axios.CancelToken.source();
  axios
    .get('https://jsonplaceholder.typicode.com/todos', { cancelToken: source.token })
    .then(res => showOutput(res))
    .catch(thrown => {
      if (axios.isCancel(thrown)) {
        console.log('requestCancelled', thrown.message)
      }
    });
  if (true) {
    source.cancel('request canceleld!')
  }
}

// INTERCEPTING REQUESTS & RESPONSES
axios.interceptors.request.use(config => {
  console.log(`${config.method.toUpperCase()} request sent to ${config.url} at ${new Date().getTime()}`);
  return config;
}, error => {
  return Promise.reject(error)
})



// AXIOS INSTANCES
const axiosInstance = axios.create({
  // other custom settings
  baseURL: 'https://jsonplaceholder.typicode.com'
});
axiosInstance.get('/comments').then(res=> showOutput(res))

// Show output in browser
function showOutput(res) {
  document.getElementById('res').innerHTML = `
  <div class="card card-body mb-4">
    <h5>Status: ${res.status}</h5>
  </div>

  <div class="card mt-3">
    <div class="card-header">
      Headers
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.headers, null, 2)}</pre>
    </div>
  </div>

  <div class="card mt-3">
    <div class="card-header">
      Data
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.data, null, 2)}</pre>
    </div>
  </div>

  <div class="card mt-3">
    <div class="card-header">
      Config
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.config, null, 2)}</pre>
    </div>
  </div>
`;
}

// Event listeners
document.getElementById('get').addEventListener('click', getTodos);
document.getElementById('post').addEventListener('click', addTodo);
document.getElementById('update').addEventListener('click', updateTodo);
document.getElementById('delete').addEventListener('click', removeTodo);
document.getElementById('sim').addEventListener('click', getData);
document.getElementById('headers').addEventListener('click', customHeaders);
document
  .getElementById('transform')
  .addEventListener('click', transformResponse);
document.getElementById('error').addEventListener('click', errorHandling);
document.getElementById('cancel').addEventListener('click', cancelToken);
