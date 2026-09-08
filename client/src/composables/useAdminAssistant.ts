type AssistantMessage = {
  id: number
  text: string
  from: 'assistant' | 'user'
}





const assistantResponses: Record<string, string> = {
  usuarios: 'Puedes revisar los usuarios desde la sección de admin y verificar estado, roles y actividad reciente.',
  herramientas: 'En herramientas puedes revisar el inventario, agregar nuevos elementos y controlar el stock disponible.',
  stock: 'Para revisar el stock, revisa la lista de herramientas y confirma si hay unidades disponibles o en préstamo.',
  seguimiento: 'En seguimiento puedes ver el progreso de préstamos, devoluciones y tareas asignadas al equipo.',
  prestamo: 'Si necesitas revisar un préstamo, entra a seguimiento y filtra por herramienta o usuario.',
  admin: 'Soy tu asistente de apoyo para el panel de administración y puedo orientarte sobre usuarios, herramientas y seguimiento.'
}




export function getAssistantReply(input: string): string {
  const normalized = input.toLowerCase()

  if (normalized.includes('usuario')) return assistantResponses['usuarios'] as string
  if (normalized.includes('herramienta') || normalized.includes('stock')) return assistantResponses['herramientas'] as string
  if (normalized.includes('seguimiento')) return assistantResponses['seguimiento'] as string
  if (normalized.includes('prestamo') || normalized.includes('préstamo')) return assistantResponses['prestamo'] as string
  if (normalized.includes('admin') || normalized.includes('panel')) return assistantResponses['admin'] as string

  return 'Puedo ayudarte con la gestión del panel: usuarios, herramientas, stock y seguimiento. ¿En qué te puedo apoyar hoy?'
}

export function createInitialAssistantMessage(): AssistantMessage {
  return {
    id: Date.now(),
    text: 'Hola, soy el asistente de administración. Puedo orientarte sobre usuarios, herramientas, stock y seguimiento.',
    from: 'assistant'
  }
}

export function createUserMessage(text: string): AssistantMessage {
  return {
    id: Date.now() + Math.floor(Math.random() * 1000),
    text,
    from: 'user'
  }
}

