import axios from './axios'

export const messageRequest = (decoded) => axios.post(`/prompt`, decoded)