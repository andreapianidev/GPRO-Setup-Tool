// Clipboard utility hook for copying setup data
import { useState, useCallback } from 'react'

interface ClipboardState {
  copied: boolean
  error: string | null
}

export function useClipboard() {
  const [state, setState] = useState<ClipboardState>({
    copied: false,
    error: null
  })

  const copyToClipboard = useCallback(async (text: string): Promise<boolean> => {
    try {
      // Reset state
      setState({ copied: false, error: null })

      // Use modern Clipboard API if available
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text)
      } else {
        // Fallback for older browsers or non-HTTPS contexts
        const textArea = document.createElement('textarea')
        textArea.value = text
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        textArea.style.top = '-999999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        
        const successful = document.execCommand('copy')
        textArea.remove()
        
        if (!successful) {
          throw new Error('Copy command failed')
        }
      }

      setState({ copied: true, error: null })
      
      // Reset copied state after 2 seconds
      setTimeout(() => {
        setState(prev => ({ ...prev, copied: false }))
      }, 2000)
      
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to copy to clipboard'
      setState({ copied: false, error: errorMessage })
      return false
    }
  }, [])

  const reset = useCallback(() => {
    setState({ copied: false, error: null })
  }, [])

  return {
    copied: state.copied,
    error: state.error,
    copyToClipboard,
    reset
  }
}