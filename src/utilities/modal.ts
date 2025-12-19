export function openModal(id: string) {
    const el = document.getElementById(id)
    const panel = document.getElementById(`${id}-panel`)
  
    if (el) {
      el.classList.remove('opacity-0', 'pointer-events-none')
      el.classList.add('opacity-100', 'pointer-events-auto')
    }
  
    if (panel) {
      panel.classList.remove('translate-x-full')
      panel.classList.add('translate-x-0')
    }
  
    document.body.classList.add('overflow-hidden')
  }
  
  export function closeModal(id: string) {
    const el = document.getElementById(id)
    const panel = document.getElementById(`${id}-panel`)
  
    if (el) {
      el.classList.remove('opacity-100', 'pointer-events-auto')
      el.classList.add('opacity-0', 'pointer-events-none')
    }
  
    if (panel) {
      panel.classList.remove('translate-x-0')
      panel.classList.add('translate-x-full')
    }
  
    document.body.classList.remove('overflow-hidden')
  }