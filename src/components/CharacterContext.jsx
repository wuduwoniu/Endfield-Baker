import { createContext, useContext, useState, useCallback } from 'react'
import { getCharacter } from './characters'

const CharacterContext = createContext(null)

export function CharacterProvider({ children }) {
  const [characterId, setCharacterId] = useState('zhuang-fangyi')

  const selectCharacter = useCallback((id) => {
    setCharacterId(id)
  }, [])

  const character = getCharacter(characterId)

  return (
    <CharacterContext.Provider value={{ characterId, character, selectCharacter }}>
      {children}
    </CharacterContext.Provider>
  )
}

export function useCharacter() {
  const ctx = useContext(CharacterContext)
  if (!ctx) throw new Error('useCharacter must be used within CharacterProvider')
  return ctx
}
