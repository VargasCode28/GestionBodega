import Loan from '../models/Loan.model.js'
import Tool from '../models/Tool.model.js'

export const borrowTool = async (req, res) => {

    const tool = await Tool.findById(req.params.toolId)

    if(tool.status === 'BORROWED')
        return res.status(400).json({message: 'Herramienta no disponible'})

    const loan = await Loan.create({
        worker: req.user.id,
        tool: tool._id
    })

    tool.status = 'BORROWED'
    await tool.save()

    res.json(loan)
}

export const returnTool = async (req, res) => {

    const loan = await Loan.findById(req.params.loanId)

    loan.status = 'RETURNED'
    loan.returnDate = new Date()
    await loan.save()

    const tool = await Tool.findById(loan.tool)
    tool.status = 'AVAILABLE'
    await tool.save()

    res.json(loan)
}
