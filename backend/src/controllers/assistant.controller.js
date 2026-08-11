const fallbackReply = (input) => {
  const normalized = input.toLowerCase()

  if (normalized.includes('usuario')) {
    return 'Puedes revisar los usuarios desde la sección de administración y verificar su estado, rol y actividad reciente.'
  }

  if (normalized.includes('herramienta') || normalized.includes('stock')) {
    return 'En herramientas puedes revisar el inventario, agregar elementos nuevos y confirmar el stock disponible.'
  }

  if (normalized.includes('seguimiento')) {
    return 'En seguimiento puedes ver el avance de préstamos, devoluciones y tareas asignadas al equipo.'
  }

  if (normalized.includes('prestamo') || normalized.includes('préstamo')) {
    return 'Si necesitas revisar un préstamo, entra a seguimiento y filtra por herramienta o usuario.'
  }

  if (normalized.includes('admin') || normalized.includes('panel')) {
    return 'Soy tu asistente para apoyar al panel de administración con usuarios, herramientas, stock y seguimiento.'
  }

  return 'Puedo ayudarte con la gestión del panel: usuarios, herramientas, stock y seguimiento. ¿En qué te puedo apoyar hoy?'
}

const getApiKey = () => {
  const key = process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY

  if (!key) {
    return null
  }

  return key.replace(/\s+/g, '')
}

const callRemoteModel = async (message) => {
  const apiKey = getApiKey()

  if (process.env.OPENAI_API_KEY && apiKey) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0.7,
        messages: [
          {
            role: 'system',
            content: 'Eres un asistente útil para un panel de administración de bodega. Responde en español, breve y práctico.'
          },
          {
            role: 'user',
            content: message
          }
        ]
      })
    })

    if (!response.ok) {
      throw new Error(`OpenAI request failed: ${response.status}`)
    }

    const data = await response.json()
    return data.choices?.[0]?.message?.content?.trim() || null
  }

  if (process.env.GEMINI_API_KEY && apiKey) {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Responde en español, breve y útil para un panel de administración de bodega. ${message}`
                }
              ]
            }
          ]
        })
      }
    )

    if (!response.ok) {
      throw new Error(`Gemini request failed: ${response.status}`)
    }

    const data = await response.json()
    return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || null
  }

  return null
}

export const chatWithAssistant = async (req, res) => {
  const message = req.body?.message?.trim()

  if (!message) {
    return res.status(400).json({ error: 'El mensaje es obligatorio' })
  }

  try {
    const aiReply = await callRemoteModel(message)

    if (aiReply) {
      return res.json({ reply: aiReply, source: 'ai' })
    }

    return res.json({ reply: fallbackReply(message), source: 'fallback' })
  } catch (error) {
    console.error('Assistant error:', error)
    return res.json({ reply: fallbackReply(message), source: 'fallback' })
  }
}
