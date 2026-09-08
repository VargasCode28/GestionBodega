import api from './api'

const apiOrigin = new URL(import.meta.env.VITE_API_URL).origin

const normalizeImageUrl = (imageUrl?: string) => {
    if (!imageUrl) return imageUrl

    try {
        const image = new URL(imageUrl, apiOrigin)
        if (image.pathname.startsWith('/uploads/')) {
            return `${apiOrigin}${image.pathname}${image.search}`
        }
    } catch {
        return imageUrl
    }

    return imageUrl
}


export interface Tool {
_id: string
name: string
description: string
imageUrl?: string
}



export interface ToolDto {
name: string
description: string
imageFile?: File | null
}



const toolService = {
async getAll(): Promise<Tool[]> {
    const { data } = await api.get<Tool[]>('/tools')
    return data.map(tool => ({
        ...tool,
        imageUrl: normalizeImageUrl(tool.imageUrl)
    }))
},



async create(tool: ToolDto) {
    const formData = new FormData()
    formData.append('name', tool.name)
    formData.append('description', tool.description)
    if (tool.imageFile) formData.append('image', tool.imageFile)

    const { data } = await api.post('/tools', formData)
    return data
},


async update(id: string, tool: ToolDto) {
    const formData = new FormData()
    formData.append('name', tool.name)
    formData.append('description', tool.description)
    if (tool.imageFile) formData.append('image', tool.imageFile)

    const { data } = await api.put(`/tools/${id}`, formData)
    return data
},

async remove(id: string) {
    const { data } = await api.delete(`/tools/${id}`)
    return data
}
}





export default toolService













