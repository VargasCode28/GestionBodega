import api from './api'

export interface Worker {
_id: string
name: string
email: string
active: boolean
[key: string]: any
}

export interface WorkerPayload {
name: string
email: string
password?: string
}

export const dashboardService = {
async getWorkers(): Promise<Worker[]> {
    const res = await api.get<Worker[]>('/users')
    return res.data
},

async createWorker(payload: Required<WorkerPayload>): Promise<Worker> {
    const res = await api.post<Worker>('/users', payload)
    return res.data
},

async updateWorker(id: string, payload: Omit<WorkerPayload, 'password'>): Promise<Worker> {
    const res = await api.put<Worker>(`/users/${id}`, payload)
    return res.data
},

async toggleWorker(id: string): Promise<void> {
    await api.put(`/users/${id}/toggle`)
},

async deleteWorker(id: string): Promise<void> {
    await api.delete(`/users/${id}`)
}
}



export default dashboardService