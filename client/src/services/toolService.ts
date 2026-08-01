import api from './api'

export interface Tool {
_id: string
name: string
description: string
}



export interface ToolDto {
name: string
description: string
}

const toolService = {
async getAll(): Promise<Tool[]> {
    const { data } = await api.get<Tool[]>('/tools')
    return data
},

async create(tool: ToolDto) {
    const { data } = await api.post('/tools', tool)
    return data
},

async update(id: string, tool: ToolDto) {
    const { data } = await api.put(`/tools/${id}`, tool)
    return data
},

async remove(id: string) {
    const { data } = await api.delete(`/tools/${id}`)
    return data
}
}

export default toolService

