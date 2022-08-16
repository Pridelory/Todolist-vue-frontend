import config from 'config';
import {authHeader} from '../_helpers';

export const userService = {
    login,
    logout,
    register,
    getAll,
    getById,
    update,
    deleteTask: _delete,
    getTodayTodolist,
    addTask
};

function login(principal, credentials) {
    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({principal, credentials})
    };

    return fetch(`${config.apiUrl}/api/user/login`, requestOptions)
        .then(handleResponse)
        .then(res => {
            // login successful if there's a jwt token in the response
            // if (user.token) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            if (res.success) {
                var token = res.data.accessToken.split("login:token:")[1]
                localStorage.setItem('user', token);
            }
            return res;
        });
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
}

function register(user) {
    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(user)
    };

    return fetch(`${config.apiUrl}/api/user/register`, requestOptions)
        .then(handleResponse)
        .then(res => {
            if (res.success) {
                var token = res.data.accessToken.split("login:token:")[1]
                localStorage.setItem('user', token);
            }
            return res;
        });
}

function getTodayTodolist() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`/api/todolist/getTodayList`, requestOptions).then(handleResponse);
}

function addTask(task) {
    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json', 'Authorization': localStorage.getItem('user')},
        body: JSON.stringify(task)
    };

    return fetch(`api/todolist/addTask`, requestOptions).then(handleResponse);
}

function getAll() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${config.apiUrl}/users`, requestOptions).then(handleResponse);
}


function getById(id) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${config.apiUrl}/users/${id}`, requestOptions).then(handleResponse);
}

function update(task) {
    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json', 'Authorization': localStorage.getItem('user')},
        body: JSON.stringify(task)
    };

    return fetch(`/api/todolist/updateTask`, requestOptions).then(handleResponse);
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(task) {
    const requestOptions = {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json', 'Authorization': localStorage.getItem('user')},
        body: JSON.stringify(task)
    };
    return fetch(`/api/todolist/deleteTask`, requestOptions).then(handleResponse);
}

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {
                // auto logout if 401 response returned from api
                logout();
                location.reload(true);
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}