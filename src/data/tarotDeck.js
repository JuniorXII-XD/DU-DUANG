/**
 * tarotDeck.js
 * Major Arcana card definitions.
 * Art assets are not included in this prototype — cards render as placeholders.
 * The structure is ready to accept image paths or generated art later.
 */

export const MAJOR_ARCANA = [
  { id: 0,  name: 'The Fool',        symbol: '☽', keywords: ['beginnings', 'innocence', 'spontaneity'] },
  { id: 1,  name: 'The Magician',    symbol: '∞', keywords: ['willpower', 'skill', 'resourcefulness'] },
  { id: 2,  name: 'High Priestess',  symbol: '☾', keywords: ['intuition', 'mystery', 'inner knowledge'] },
  { id: 3,  name: 'The Empress',     symbol: '♀', keywords: ['fertility', 'nature', 'abundance'] },
  { id: 4,  name: 'The Emperor',     symbol: '♂', keywords: ['authority', 'structure', 'stability'] },
  { id: 5,  name: 'The Hierophant',  symbol: '⛪', keywords: ['tradition', 'conformity', 'morality'] },
  { id: 6,  name: 'The Lovers',      symbol: '♡', keywords: ['love', 'harmony', 'choices'] },
  { id: 7,  name: 'The Chariot',     symbol: '⊕', keywords: ['control', 'willpower', 'victory'] },
  { id: 8,  name: 'Strength',        symbol: '∞', keywords: ['courage', 'patience', 'inner strength'] },
  { id: 9,  name: 'The Hermit',      symbol: '☀', keywords: ['solitude', 'guidance', 'inner wisdom'] },
  { id: 10, name: 'Wheel of Fortune',symbol: '⊗', keywords: ['cycles', 'fate', 'turning points'] },
  { id: 11, name: 'Justice',         symbol: '⚖', keywords: ['fairness', 'truth', 'law'] },
  { id: 12, name: 'The Hanged Man',  symbol: '♆', keywords: ['suspension', 'surrender', 'perspective'] },
  { id: 13, name: 'Death',           symbol: '⚰', keywords: ['endings', 'change', 'transformation'] },
  { id: 14, name: 'Temperance',      symbol: '△', keywords: ['balance', 'moderation', 'patience'] },
  { id: 15, name: 'The Devil',       symbol: '⛧', keywords: ['shadow', 'addiction', 'restriction'] },
  { id: 16, name: 'The Tower',       symbol: '⚡', keywords: ['chaos', 'revelation', 'upheaval'] },
  { id: 17, name: 'The Star',        symbol: '★', keywords: ['hope', 'inspiration', 'serenity'] },
  { id: 18, name: 'The Moon',        symbol: '◑', keywords: ['illusion', 'fear', 'subconscious'] },
  { id: 19, name: 'The Sun',         symbol: '☀', keywords: ['joy', 'success', 'vitality'] },
  { id: 20, name: 'Judgement',       symbol: '☆', keywords: ['reflection', 'reckoning', 'awakening'] },
  { id: 21, name: 'The World',       symbol: '○', keywords: ['completion', 'integration', 'accomplishment'] },
]

/** Shuffle a copy of the deck */
export function shuffleDeck(deck = MAJOR_ARCANA) {
  const copy = [...deck]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}
