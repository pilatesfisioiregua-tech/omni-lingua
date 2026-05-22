// Omni-Lingua Subtitle Companion · content script.
// Diferenciador #8 · Refold/MIA sentence mining sobre Netflix/YouTube.

const STOP_WORDS = new Set([
  'a', 'an', 'the', 'is', 'are', 'was', 'were', 'be', 'been', 'and', 'or', 'but', 'of',
  'in', 'on', 'at', 'to', 'for', 'with', 'as', 'by', 'this', 'that', 'these', 'those',
  'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them', 'my',
  'your', 'his', 'its', 'our', 'their', 'do', 'does', 'did', 'have', 'has', 'had',
  'will', 'would', 'can', 'could', 'should', 'so', 'not', 'no', 'yes', 'if',
])

const STORAGE_KEY = 'omni-lingua-known-words'

let knownWords = new Set()

chrome.storage.local.get([STORAGE_KEY], (res) => {
  knownWords = new Set(res[STORAGE_KEY] ?? [])
})

const subtitleSelectors = [
  '.player-timedtext-text-container',
  '.ytp-caption-segment',
  '.ytp-caption-window-container',
]

function findSubtitleNodes() {
  const nodes = []
  for (const sel of subtitleSelectors) {
    document.querySelectorAll(sel).forEach((n) => nodes.push(n))
  }
  return nodes
}

function decorateNode(node) {
  if (node.dataset.omniDecorated) return
  node.dataset.omniDecorated = '1'
  const text = node.innerText
  const tokens = text.split(/(\s+|[.,!?;:"'-])/)
  const html = tokens
    .map((t) => {
      const word = t.toLowerCase().replace(/[^a-z']/g, '')
      if (!word || STOP_WORDS.has(word)) return escapeHtml(t)
      const known = knownWords.has(word)
      const cls = known ? 'omni-known' : 'omni-unknown'
      return `<span class="${cls}" data-word="${word}">${escapeHtml(t)}</span>`
    })
    .join('')
  node.innerHTML = html
}

function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

// Observe subtitle changes
const observer = new MutationObserver(() => {
  findSubtitleNodes().forEach(decorateNode)
})

observer.observe(document.body, { childList: true, subtree: true })

// Click handler to add word to deck
document.addEventListener('click', async (e) => {
  const target = e.target
  if (!(target instanceof HTMLElement)) return
  const word = target.dataset.word
  if (!word) return
  e.preventDefault()
  e.stopPropagation()

  // Toggle known
  if (knownWords.has(word)) {
    knownWords.delete(word)
  } else {
    knownWords.add(word)
  }
  chrome.storage.local.set({ [STORAGE_KEY]: [...knownWords] })

  // Visual feedback
  target.classList.add('omni-flash')
  setTimeout(() => target.classList.remove('omni-flash'), 300)

  // Toast
  showToast(`"${word}" añadida a deck. (${knownWords.size} palabras conocidas)`)
})

function showToast(text) {
  let el = document.querySelector('.omni-toast')
  if (!el) {
    el = document.createElement('div')
    el.className = 'omni-toast'
    document.body.appendChild(el)
  }
  el.textContent = text
  el.classList.add('omni-toast-visible')
  clearTimeout(showToast._t)
  showToast._t = setTimeout(() => el.classList.remove('omni-toast-visible'), 1500)
}
