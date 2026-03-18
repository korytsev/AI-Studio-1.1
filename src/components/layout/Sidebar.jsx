import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { ChevronDown, Globe, Home, LogOut, Mail, Settings, Users } from 'lucide-react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { ROUTES, PRODUCT_SECTIONS } from '@/lib/routes'
import { useState, useEffect } from 'react'

function NavItem({ to, children, end = false }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
          isActive
            ? 'bg-[#1C84FC] text-white'
            : 'text-foreground/80 hover:bg-[#e2f98e]/10 hover:text-foreground'
        )
      }
    >
      {children}
    </NavLink>
  )
}

function SidebarUserMenu() {
  const user = { name: 'Andrei Korytsev', email: 'korytsev@gmail.com', initials: 'AK' }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex w-full cursor-pointer items-center gap-3 rounded-md px-4 py-2.5 text-left transition-colors hover:bg-[#e2f98e]/10 focus:outline-none"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-700 text-xs font-semibold text-white">
            {user.initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">{user.name}</p>
            <p className="truncate text-xs text-[var(--color-sidebar-foreground)]">{user.email}</p>
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        side="top"
        sideOffset={8}
        className="min-w-[14rem] rounded-lg border-border bg-popover p-0 shadow-lg backdrop-blur-sm"
      >
        <DropdownMenuLabel className="py-2.5 text-xs font-normal text-muted-foreground">
          {user.email}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <NavLink to="/upgrade" className="flex cursor-pointer items-center">
            Upgrade your plan
          </NavLink>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <NavLink to="/settings" className="flex w-full cursor-pointer items-center">
            Settings
            <span className="ml-auto pl-4 text-xs text-muted-foreground">⌘ ,</span>
          </NavLink>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <NavLink to="/logout" className="flex cursor-pointer items-center">
            <LogOut className="mr-2 h-4 w-4" />
            Log Out
          </NavLink>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function Sidebar() {
  const location = useLocation()
  const pathname = location.pathname
  const navigate = useNavigate()

  const [openIds, setOpenIds] = useState(() => {
    const initial = new Set()
    PRODUCT_SECTIONS.forEach((s) => {
      if (s.tabs.some((t) => pathname === t.path || pathname.startsWith(t.path + '/'))) {
        initial.add(s.id)
      }
    })
    return initial
  })

  const isSectionActive = (section) =>
    pathname === section.overviewPath ||
    pathname.startsWith(section.base + '/') ||
    section.tabs.some((t) => pathname === t.path)

  // Ensure the active section is always expanded when navigating via links
  useEffect(() => {
    const matched = PRODUCT_SECTIONS.find((s) => isSectionActive(s))
    if (matched) {
      setOpenIds((prev) => {
        if (prev.has(matched.id)) return prev
        const next = new Set(prev)
        next.add(matched.id)
        return next
      })
    }
  }, [pathname])

  const handleChevronClick = (e, section) => {
    e.preventDefault()
    e.stopPropagation()
    const isOpen = openIds.has(section.id)
    if (isOpen) {
      if (isSectionActive(section)) return
      setOpenIds((prev) => { const next = new Set(prev); next.delete(section.id); return next })
    } else {
      setOpenIds((prev) => new Set([...prev, section.id]))
    }
  }

  return (
    <aside className="flex h-full w-[20.2rem] shrink-0 flex-col overflow-y-auto bg-[var(--color-sidebar)]">
      <div className="px-6 pt-[30px] pb-10">
        <NavLink to={ROUTES.HOME} end className="block">
          <img src="/Doppol-logo.svg" alt="Doppol" width={120} className="h-auto" />
        </NavLink>
      </div>
      <div className="flex flex-col px-3 pb-2">
        <NavItem to={ROUTES.HOME} end>
          <Home className="h-4 w-4 shrink-0" />
          Home
        </NavItem>

        {PRODUCT_SECTIONS.map((section) => {
          const isOpen = openIds.has(section.id)
          const isActive = isSectionActive(section)
          const isOverview = pathname === section.overviewPath
          const SectionIcon = {
            'brand-protection': Globe,
            'human-risk': Users,
            'email-protection': Mail,
          }[section.id]

          return (
            <Collapsible key={section.id} open={isOpen}>
              {/* Unified row: clicking label navigates to overview, clicking chevron toggles expand */}
              <div className={cn(
                'flex w-full items-center rounded-md transition-colors',
                isOverview
                  ? 'bg-[#1C84FC] text-white'
                  : isActive
                    ? 'text-[#e2f98e] hover:bg-[#e2f98e]/10'
                    : 'text-foreground/80 hover:bg-[#e2f98e]/10 hover:text-foreground'
              )}>
                <NavLink
                  to={section.overviewPath}
                  onClick={() => {
                    if (!isOpen) setOpenIds((prev) => new Set([...prev, section.id]))
                  }}
                  className="flex flex-1 items-center gap-3 px-3 py-2.5 text-sm font-medium cursor-pointer"
                >
                  {SectionIcon && <SectionIcon className="h-4 w-4 shrink-0" />}
                  <span className="truncate">{section.label}</span>
                </NavLink>
                <button
                  type="button"
                  onClick={(e) => handleChevronClick(e, section)}
                  className="flex shrink-0 cursor-pointer items-center px-2 py-2.5"
                >
                  <ChevronDown className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-180')} />
                </button>
              </div>
              <CollapsibleContent>
                <div className="mt-0.5 flex flex-col gap-0.5 py-1">
                  {section.tabs.map((tab) => (
                    <NavLink
                      key={tab.path}
                      to={tab.path}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center justify-between rounded-md py-2 pr-3 text-sm font-medium transition-colors',
                          'pl-[40px]',
                          isActive
                            ? 'bg-[#1C84FC] text-white'
                            : 'text-foreground/50 hover:bg-[#e2f98e]/10 hover:text-foreground/80'
                        )
                      }
                    >
                      <span>{tab.label}</span>
                      {tab.badge != null && (
                        <span className="ml-auto rounded-full bg-[#e2f98e] px-1.5 py-0.5 text-[10px] font-semibold leading-none text-black">
                          {tab.badge}
                        </span>
                      )}
                    </NavLink>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          )
        })}
      </div>

      <div className="mt-auto px-3 pb-4">
        <div className="mb-3 h-px bg-[var(--color-sidebar-border)]" />
        <SidebarUserMenu />
      </div>
    </aside>
  )
}
