chrome.storage.local.get(['omni-lingua-known-words'], (res) => {
  const count = (res['omni-lingua-known-words'] ?? []).length
  document.getElementById('count').textContent = count.toString()
})
