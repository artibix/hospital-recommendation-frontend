import { Module } from 'vuex'
import {AppState, RootState} from '@/types/store'
import '@nutui/nutui-taro/dist/style.css';
import '@nutui/icons-vue-taro/dist/style_iconfont.css';

export const app: Module<AppState, RootState> = {
    namespaced: true,

    state: {
        location: null,
        systemInfo: null,
        networkType: '',
        theme: 'light',
        loading: false,
        error: null
    },

    mutations: {
        SET_LOCATION(state, location) {
            state.location = location
        },
        SET_SYSTEM_INFO(state, info) {
            state.systemInfo = info
        }
    },

    actions: {
        updateLocation({ commit }, location) {
            commit('SET_LOCATION', location)
        },
        updateSystemInfo({ commit }, info) {
            commit('SET_SYSTEM_INFO', info)
        }
    }
}