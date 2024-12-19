// src/store/index.ts
import { createStore } from 'vuex'
import { RootState } from '@/types/store'
import { app } from './modules/app'

export default createStore<RootState>({
    modules: {
        app
    }
})