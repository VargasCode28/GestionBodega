import { describe, expect, it } from 'vitest'
import { getAssistantReply } from '../useAdminAssistant'

describe('getAssistantReply', () => {
  it('responde a preguntas sobre usuarios', () => {
    const reply = getAssistantReply('¿Cómo veo los usuarios del sistema?')

    expect(reply).toContain('usuarios')
    expect(reply).toContain('admin')
  })

  it('responde a preguntas sobre herramientas y stock', () => {
    const reply = getAssistantReply('¿Qué pasa con el stock de herramientas?')

    expect(reply).toContain('herramientas')
    expect(reply).toContain('stock')
  })

  it('da una respuesta general para temas no específicos', () => {
    const reply = getAssistantReply('Cuéntame algo interesante')

    expect(reply).toContain('gestión')
  })
})
