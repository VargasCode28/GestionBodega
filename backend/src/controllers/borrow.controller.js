import Borrow from '../models/Borrow.model.js'
import Tool from '../models/Tool.model.js'

export const borrowTool = async (req, res) => {

  const { toolId } = req.body

  const tool = await Tool.findById(toolId)

  if (!tool) {
    return res.status(404).json({ message: 'Herramienta no existe' })
  }

  if (tool.status === 'BORROWED') {
    return res.status(400).json({ message: 'Herramienta ya prestada' })
  }

  // Crear préstamo
  const borrow = await Borrow.create({
    user: req.user.id,
    tool: toolId
  })

  tool.status = 'BORROWED'
  await tool.save()

  res.json(borrow)
}








export const returnTool = async (req, res) => {
  try {

    const borrow = await Borrow.findById(req.params.id)

    if (!borrow) {
      return res.status(404).json({ message: 'Prestamo no encontrado' })
    }

    borrow.status = 'RETURNED'
    
    borrow.returnedAt = new Date()
    await borrow.save()

    const tool = await Tool.findById(borrow.tool)

    if (tool) {
      tool.status = 'AVAILABLE'
      await tool.save()
    }

    res.json({ message: 'Herramienta devuelta' })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}






export const getAllBorrows = async (req, res) => {
  try {

    const borrows = await Borrow.find()
      .populate('user', 'name email')
      .populate('tool', 'name status')

    res.json(borrows)

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}


















export const getBorrows = async (req, res) => {

  const borrows = await Borrow.find()
    .populate('user', 'name email')
    .populate('tool', 'name description')
    .sort({ borrowedAt: -1 }) // ordena por fecha reciente

  res.json(borrows)
}
