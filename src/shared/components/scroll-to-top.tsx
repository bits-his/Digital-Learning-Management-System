import * as React from "react"
import { useLocation } from "react-router-dom"

/**
 * Reset main content scroll on route change.
 * Does not touch the nav sidebar scroll position.
 */
export function ScrollToTop() {
  const { pathname, search } = useLocation()

  React.useEffect(() => {
    window.scrollTo(0, 0)
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0

    document
      .querySelectorAll<HTMLElement>('[data-slot="app-scroll"]')
      .forEach((node) => {
        node.scrollTop = 0
      })
  }, [pathname, search])

  return null
}
