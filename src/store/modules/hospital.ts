// src/store/modules/hospital.ts
import { Module } from 'vuex'
import { HospitalState, RootState } from '@/types/store'
import {
    searchHospitals,
    getHospitalDetail,
    getNearbyHospitals
} from '@/api/hospital'
import { getFavoriteHospitals, addFavorite, removeFavorite } from '@/api/favorite'
import { getHospitalRatings, submitHospitalRating } from '@/api/rating'

export const hospital: Module<HospitalState, RootState> = {
    namespaced: true,

    state: {
        hospitals: [],
        currentHospital: null,
        currentDepartments: [],
        favoriteHospitals: [],
        currentHospitalRatings: [],
        loading: false,
        page: 1,
        hasMore: true,
        searchQuery: '',
        error: null,
        filters: {}
    },

    mutations: {
        SET_HOSPITALS(state, hospitals) {
            state.hospitals = hospitals
        },

        APPEND_HOSPITALS(state, hospitals) {
            state.hospitals = [...state.hospitals, ...hospitals]
        },

        SET_CURRENT_HOSPITAL(state, hospital) {
            state.currentHospital = hospital
        },

        SET_DEPARTMENTS(state, departments) {
            state.currentDepartments = departments
        },

        SET_FAVORITE_HOSPITALS(state, hospitals) {
            state.favoriteHospitals = hospitals
        },

        SET_CURRENT_HOSPITAL_RATINGS(state, ratings) {
            state.currentHospitalRatings = ratings
        },

        ADD_FAVORITE(state, hospital) {
            if (!state.favoriteHospitals.some(h => h.id === hospital.id)) {
                state.favoriteHospitals.push(hospital)
            }
        },

        REMOVE_FAVORITE(state, hospitalId) {
            state.favoriteHospitals = state.favoriteHospitals.filter(h => h.id !== hospitalId)
        },

        SET_LOADING(state, loading) {
            state.loading = loading
        },

        SET_PAGE(state, page) {
            state.page = page
        },

        SET_HAS_MORE(state, hasMore) {
            state.hasMore = hasMore
        },

        SET_SEARCH_QUERY(state, query) {
            state.searchQuery = query
        },

        SET_ERROR(state, error) {
            state.error = error
        },

        SET_FILTERS(state, filters) {
            state.filters = { ...state.filters, ...filters }
        }
    },

    actions: {
        // 搜索医院
        async searchHospitals({ commit, state }, params) {
            commit('SET_LOADING', true)
            try {
                const response = await searchHospitals({
                    ...params,
                    page: state.page,
                    size: 10
                })

                if (state.page === 1) {
                    commit('SET_HOSPITALS', response)
                } else {
                    commit('APPEND_HOSPITALS', response)
                }

                commit('SET_HAS_MORE', response.length === 10)
            } catch (error) {
                commit('SET_ERROR', error.message)
            } finally {
                commit('SET_LOADING', false)
            }
        },

        // 获取附近医院
        async getNearbyHospitals({ commit }, params) {
            commit('SET_LOADING', true)
            try {
                const hospitals = await getNearbyHospitals(params)
                commit('SET_HOSPITALS', hospitals)
            } catch (error) {
                commit('SET_ERROR', error.message)
            } finally {
                commit('SET_LOADING', false)
            }
        },

        // 获取医院详情
        async getHospitalDetail({ commit }, id) {
            commit('SET_LOADING', true)
            try {
                const hospital = await getHospitalDetail(id)
                commit('SET_CURRENT_HOSPITAL', hospital)
            } catch (error) {
                commit('SET_ERROR', error.message)
            } finally {
                commit('SET_LOADING', false)
            }
        },

        // 获取收藏的医院
        async getFavoriteHospitals({ commit }) {
            commit('SET_LOADING', true)
            try {
                const hospitals = await getFavoriteHospitals()
                commit('SET_FAVORITE_HOSPITALS', hospitals)
                return hospitals
            } catch (error) {
                commit('SET_ERROR', error.message)
                return []
            } finally {
                commit('SET_LOADING', false)
            }
        },

        // 添加收藏
        async addFavorite({ commit, state }, hospitalId) {
            try {
                await addFavorite(hospitalId)

                // 如果当前医院已加载，将其添加到收藏列表
                if (state.currentHospital && state.currentHospital.id === hospitalId) {
                    commit('ADD_FAVORITE', state.currentHospital)
                } else {
                    // 否则查找医院列表
                    const hospital = state.hospitals.find(h => h.id === hospitalId)
                    if (hospital) {
                        commit('ADD_FAVORITE', hospital)
                    }
                }

                return true
            } catch (error) {
                commit('SET_ERROR', error.message)
                return false
            }
        },

        // 取消收藏
        async removeFavorite({ commit }, hospitalId) {
            try {
                await removeFavorite(hospitalId)
                commit('REMOVE_FAVORITE', hospitalId)
                return true
            } catch (error) {
                commit('SET_ERROR', error.message)
                return false
            }
        },

        // 获取医院评分
        async getHospitalRatings({ commit }, hospitalId) {
            commit('SET_LOADING', true)
            try {
                const ratings = await getHospitalRatings(hospitalId)
                commit('SET_CURRENT_HOSPITAL_RATINGS', ratings)
                return ratings
            } catch (error) {
                commit('SET_ERROR', error.message)
                return []
            } finally {
                commit('SET_LOADING', false)
            }
        },

        // 提交医院评分
        async submitHospitalRating({ commit, dispatch }, { hospitalId, data }) {
            try {
                const result = await submitHospitalRating(hospitalId, data)
                // 刷新评分列表
                await dispatch('getHospitalRatings', hospitalId)
                // 刷新医院详情以更新总评分
                await dispatch('getHospitalDetail', hospitalId)
                return result
            } catch (error) {
                commit('SET_ERROR', error.message)
                throw error
            }
        },

        // 重置搜索状态
        resetSearch({ commit }) {
            commit('SET_PAGE', 1)
            commit('SET_HAS_MORE', true)
            commit('SET_HOSPITALS', [])
            commit('SET_SEARCH_QUERY', '')
            commit('SET_ERROR', null)
        }
    },

    getters: {
        filteredHospitals: state => {
            let hospitals = [...state.hospitals]

            // 根据级别筛选
            if (state.filters.level) {
                hospitals = hospitals.filter(h => h.level === state.filters.level)
            }

            // 根据评分筛选
            if (state.filters.rating) {
                hospitals = hospitals.filter(h => h.rating >= state.filters.rating)
            }

            // 根据距离筛选
            if (state.filters.distance) {
                hospitals = hospitals.filter(h => h.distance <= state.filters.distance)
            }

            return hospitals
        },

        isLoading: state => state.loading,
        hasMore: state => state.hasMore,
        currentHospital: state => state.currentHospital,
        favoriteHospitals: state => state.favoriteHospitals,
        currentHospitalRatings: state => state.currentHospitalRatings
    }
}