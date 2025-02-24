// src/store/index.ts
import { createStore } from 'vuex'
import { RootState } from '@/types/store'
import { app } from './modules/app'
import { auth } from './modules/auth'
import { hospital } from './modules/hospital'

export default createStore<RootState>({
    modules: {
        app,
        auth,
        hospital
    }
})