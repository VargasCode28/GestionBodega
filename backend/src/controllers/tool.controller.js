import Tool from '../models/Tool.model.js'

export const getTools = async (req, res) => {
  const tools = await Tool.find()
  res.json(tools)
}

// export const createTool = async (req, res) => {
//   const tool = new Tool(req.body)
//   await tool.save()
//   res.json(tool)
// }






export const createTool = async (req, res) => {

  const { name, description } = req.body

  if(!name || !description){
    return res.status(400).json({
      message: "Nombre y descripción son obligatorios"
    })
  }

  const tool = new Tool({
    name,
    description
  })

  await tool.save()

  res.json(tool)
}







export const updateTool = async (req, res) => {
  const tool = await Tool.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  )

  res.json(tool)
}

export const deleteTool = async (req, res) => {
  await Tool.findByIdAndDelete(req.params.id)
  res.json({ message: 'Herramienta eliminada' })
}
