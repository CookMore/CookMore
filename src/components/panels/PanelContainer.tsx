'use client'

import { usePanel } from '@/app/providers/PanelProvider'
import { IconUser, IconSettings, IconWallet, IconCalendar, IconBell } from '@/components/ui/icons'
import { ProfilePanel } from './ProfilePanel'
import { DisplayPanel } from './DisplayPanel'
import { ConnectedPanel } from './ConnectedPanel'
import { CalendarPanel } from './CalendarPanel'
import { NotificationsPanel } from './NotificationsPanel'
import { useTheme } from '@/app/providers/ThemeProvider'
import { cn } from '@/lib/utils'

interface PanelContainerProps {
  children?: React.ReactNode
  className?: string
}

// Update the PanelType definition to include all panel types
type PanelType = 'wallet' | 'user' | 'settings' | 'calendar' | 'notifications'

export function PanelContainer({ children }: PanelContainerProps) {
  const { activePanel, setActivePanel, isExpanded, setIsExpanded } = usePanel()
  const { theme } = useTheme()

  const panels: Array<{ id: PanelType; Icon: any; Panel: React.ComponentType }> = [
    { id: 'notifications', Icon: IconBell, Panel: NotificationsPanel },
    { id: 'wallet', Icon: IconWallet, Panel: ConnectedPanel },
    { id: 'user', Icon: IconUser, Panel: ProfilePanel },
    { id: 'settings', Icon: IconSettings, Panel: DisplayPanel },
    { id: 'calendar', Icon: IconCalendar, Panel: CalendarPanel },
  ]

  return (
    <>
      <div className='w-full bg-github-canvas-default z-[45] relative'>{children}</div>
      <div
        className={cn(
          'fixed right-0 top-14 h-[calc(100vh-4rem)] bg-github-canvas-default border-l border-github-border-default transition-all duration-300 ease-in-out z-[45]',
          theme === 'neo' && [
            'neo-border border-r-0',
            'before:absolute before:inset-0 before:bg-github-canvas-default before:-z-10',
            'rotate-[0.1deg]',
            'hover:rotate-0 hover:translate-x-[2px]',
            'hover:neo-shadow',
            'relative',
            'before:pointer-events-none',
            'after:pointer-events-none',
            'z-[45]',
          ],
          theme === 'copper' && [
            'shine-effect copper-shine',
            'relative',
            'before:pointer-events-none',
            'after:pointer-events-none',
            'z-[45]',
            'before:z-[-1]',
            'after:z-[-1]',
          ],
          theme === 'steel' && 'bg-steel-gradient',
          isExpanded ? 'w-64' : 'w-12'
        )}
      >
        <div
          className={`
            transition-all duration-300 ease-in-out
            ${
              isExpanded
                ? 'flex-row border-b border-github-border-default p-2'
                : 'flex-col items-center py-4 space-y-3'
            }
            flex
          `}
        >
          {panels.map(({ id, Icon }) => (
            <button
              key={id}
              onClick={() => {
                if (activePanel === id) {
                  setIsExpanded(!isExpanded)
                } else {
                  setActivePanel(id)
                  setIsExpanded(true)
                }
              }}
              className={`
                relative group
                p-2 rounded-md
                transition-all duration-200 ease-in-out
                ${
                  activePanel === id && isExpanded
                    ? 'text-github-fg-default bg-github-canvas-default ring-2 ring-github-accent-emphasis'
                    : 'text-github-fg-muted hover:text-github-fg-default'
                }
                ${isExpanded ? 'mr-2 last:mr-0' : ''}
                hover:bg-github-canvas-default
                hover:ring-2 hover:ring-github-accent-emphasis
                hover:scale-110
                active:scale-95
                focus:outline-none
              `}
            >
              <Icon className='w-5 h-5 transform transition-transform duration-200 ease-in-out group-hover:scale-110' />

              {!isExpanded && (
                <span
                  className='
                  absolute left-full ml-2 px-2 py-1 
                  text-xs whitespace-nowrap
                  bg-github-canvas-default text-github-fg-default
                  rounded border border-github-border-default
                  opacity-0 group-hover:opacity-100
                  translate-x-2 group-hover:translate-x-0
                  pointer-events-none
                  transition-all duration-200 ease-in-out
                  z-50
                '
                >
                  {id.charAt(0).toUpperCase() + id.slice(1)}
                </span>
              )}
            </button>
          ))}
        </div>

        {isExpanded && (
          <div className='h-[calc(100%-3.5rem)] overflow-y-auto'>
            <div className='p-4'>
              {panels.map(
                ({ id, Panel }) =>
                  activePanel === id && (
                    <div key={id} className='animate-fadeIn'>
                      <Panel />
                    </div>
                  )
              )}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
