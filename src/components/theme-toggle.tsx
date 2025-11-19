import { Moon, Sun } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"
import { useState } from "react"

export function ThemeToggle() {
  const { setTheme } = useTheme()
  const [isDark, setIsDark] = useState(true)

  const handleThemeChange=()=>{
    setIsDark(!isDark)
    if(isDark) setTheme('light')
    else setTheme('dark')
  }

  return (
    <div onClick={handleThemeChange}>
      {
        isDark ?
        (<Button variant='outline' >
          <Moon />
        </Button>) :
        (<Button variant='outline'>
          <Sun />
        </Button>)
      }
    </div>
  )
}