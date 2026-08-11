import api from './api'


export interface Borrow {

    _id: string
    user?: { name: string}
    tool?: {name: string}
    borrowedAt: string
    status: 'BORROWED' | string
}


export const seguimientoService = {
    async getBorrows(): Promise<Borrow[]>{
        const res = await api.get<Borrow[]>('/borrow')
        return res.data
    },


    async returnTool(id: string): Promise<void> {
        await api.put(`/borrow/return/${id}`)
    }
}