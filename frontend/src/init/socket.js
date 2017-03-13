import Vue from 'vue'
import VueSocketio from 'vue-socket.io'
import {CONFIG} from '@/config'

Vue.use(VueSocketio, `${CONFIG.SOCKET_REMOTE}:${CONFIG.SOCKET_PORT}`)
