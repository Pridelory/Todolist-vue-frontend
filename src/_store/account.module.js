import {userService} from '../_services';
import {router} from '../_helpers';

// const user = JSON.parse(localStorage.getItem('user'));
const user = localStorage.getItem('user')
const state = user
    ? {status: {loggedIn: true}, user}
    : {status: {}, user: null};

const actions = {
    login({dispatch, commit}, {principal, credentials}) {
        commit('loginRequest', {principal});
        userService.login(principal, credentials)
            .then(
                user => {
                    if (user.success) {
                        commit('loginSuccess', user);
                        router.push('/');
                        setTimeout(() => {
                            // display success message after route change completes
                            dispatch('alert/success', 'Login successful', {root: true});
                        })
                    } else {
                        dispatch('alert/error', user.msg, {root: true});
                    }
                },
                error => {
                    commit('loginFailure', error);
                    dispatch('alert/error', error, {root: true});
                }
            );
    },
    logout({commit}) {
        userService.logout();
        commit('logout');
    },
    register({dispatch, commit}, user) {
        commit('registerRequest', user);
        userService.register(user)
            .then(
                user => {
                    if (user.success) {
                        commit('registerSuccess', user);
                        router.push('/');
                        setTimeout(() => {
                            // display success message after route change completes
                            dispatch('alert/success', 'Registration successful', {root: true});
                        })
                    } else {
                        dispatch('alert/error', user.msg, {root: true});
                    }
                },
                error => {
                    commit('registerFailure', error);
                    dispatch('alert/error', error, {root: true});
                }
            );
    }
};

const mutations = {
    loginRequest(state, user) {
        state.status = {loggingIn: false};
        state.user = user;
    },
    loginSuccess(state, user) {
        state.status = {loggedIn: true};
        state.user = user;
    },
    loginFailure(state) {
        state.status = {};
        state.user = null;
    },
    logout(state) {
        state.status = {};
        state.user = null;
    },
    registerRequest(state, user) {
        state.status = {registering: false};
    },
    registerSuccess(state, user) {
        state.status = {};
    },
    registerFailure(state, error) {
        state.status = {};
    }
};

export const account = {
    namespaced: true,
    state,
    actions,
    mutations
};