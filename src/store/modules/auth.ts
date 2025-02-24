// src/store/modules/auth.ts
import { Module } from 'vuex'
import Taro from '@tarojs/taro'
import { AuthState, RootState } from '@/types/store'
import { wxLogin, getUserInfo } from '@/api/auth'

export const auth: Module<AuthState, RootState> = {
    namespaced: true,

    state: {
        user: null,
        token: Taro.getStorageSync('token'),
        isAuthenticated: false,
        loading: false,
        error: null
    },

    mutations: {
        SET_USER(state, user) {
            state.user = user
            state.isAuthenticated = !!user
        },

        SET_TOKEN(state, token) {
            state.token = token
            if (token) {
                Taro.setStorageSync('token', token)
            } else {
                Taro.removeStorageSync('token')
            }
        },

        SET_LOADING(state, loading) {
            state.loading = loading
        },

        SET_ERROR(state, error) {
            state.error = error
        },

        CLEAR_AUTH(state) {
            state.user = null
            state.token = null
            state.isAuthenticated = false
            state.error = null
            Taro.removeStorageSync('token')
        }
    },

    actions: {
        // 微信登录
        async wxLogin({ commit }, { code, userInfo }) {
            commit('SET_LOADING', true)
            commit('SET_ERROR', null)

            try {
                console.log('微信登录', code, userInfo)
                const response = await wxLogin(code, userInfo)
                commit('SET_TOKEN', response.token)
                commit('SET_USER', response.user)
                return response
            } catch (error) {
                commit('SET_ERROR', error.message)
                throw error
            } finally {
                commit('SET_LOADING', false)
            }
        },

        // 加载用户信息
        async loadUser({ commit, state }) {
            if (!state.token) return

            commit('SET_LOADING', true)
            try {
                const user = await getUserInfo()
                commit('SET_USER', user)
            } catch (error) {
                console.error('获取用户信息失败:', error)
                commit('CLEAR_AUTH')
            } finally {
                commit('SET_LOADING', false)
            }
        },

        // 退出登录
        logout({ commit }) {
            commit('CLEAR_AUTH')
        }
    },

    getters: {
        isAuthenticated: state => state.isAuthenticated,
        currentUser: state => state.user,
        isLoading: state => state.loading
    }
}