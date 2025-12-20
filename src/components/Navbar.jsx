import { BASE_URL } from '@/utils/constants'
import { removeUser } from '@/utils/userSlice'
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import logo from "../assets/anonyKIET.png"
import { Bug, ChevronDown } from 'lucide-react';

const navigation = [
  // { name: 'Dashboard', to: '/', current: true },
  // { name: 'Team', to: '#', current: false },
  // { name: 'Projects', to: '#', current: false },
  // { name: 'Calendar', to: '#', current: false },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function NavBar() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector((store) => store.user)

  const handleLogout = async () => {
    try {
      await axios.post(`${BASE_URL}/logout`, {}, { withCredentials: true })
      dispatch(removeUser())
      navigate('/login')
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <Disclosure as="nav" className="sticky top-0 z-50 bg-gradient-to-r from-cyan-900 to-cyan-800 shadow-lg">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">
          {/* LEFT — Logo */}
          {user ? (
            <div className="flex items-center gap-3">
              {/* Mobile menu button */}
              <DisclosureButton className="sm:hidden inline-flex items-center justify-center rounded-md p-2 text-gray-300 hover:bg-white/10 hover:text-white transition-colors">
                <Bars3Icon className="h-6 w-6 data-open:hidden" />
                <XMarkIcon className="hidden h-6 w-6 data-open:block" />
              </DisclosureButton>
              <Link to="/" className="flex items-center">
                <img
                  src={logo}
                  alt="AnonyKIET"
                  className="h-16 w-auto hover:opacity-90 transition-opacity"
                />
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <img
                src={logo}
                alt="AnonyKIET"
                className="h-16 w-auto"
              />
            </div>
          )}

          {/* CENTER — Navigation */}
          {user && (
            <div className="hidden sm:flex items-center gap-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.to}
                  className={classNames(
                    item.current
                      ? 'bg-gray-950/50 text-white'
                      : 'text-gray-300 hover:bg-white/10 hover:text-white',
                    'rounded-md px-3 py-2 text-sm font-medium transition-colors'
                  )}
                >
                  {item.name}
                </Link>
              ))}

              {/* === REPORT BUG BUTTON (DESKTOP) === */}
              <a
                href="mailto:pratyushsharma25feb@gmail.com?subject=Bug Report: AnonyKIET"
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-red-500/20 hover:text-red-200 transition-colors"
                target="_blank"
                rel="noreferrer"
              >
                <Bug className="h-4 w-4" />
                <span>Report Bug</span>
              </a>
            </div>
          )}

          {/* RIGHT — User Profile Section (Enhanced) */}
          {user && (
            <div className="flex items-center">
              <Menu as="div" className="relative">
                <MenuButton className="flex items-center gap-3 rounded-full bg-white/5 hover:bg-white/10 transition-all duration-200 pl-1 pr-3 py-1 group">
                  {/* Profile Picture with Ring */}
                  <div className="relative">
                    <img
                      src={user.photoUrl.url}
                      alt={user.username}
                      className="h-9 w-9 rounded-full bg-gray-800 object-cover ring-2 ring-cyan-400/50 group-hover:ring-cyan-300 transition-all"
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-400 border-2 border-cyan-900"></div>
                  </div>
                  
                  {/* Username (Hidden on mobile) */}
                  <div className="hidden sm:flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-100 group-hover:text-white transition-colors">
                      {user.username}
                    </span>
                    <ChevronDown className="h-4 w-4 text-gray-400 group-hover:text-gray-300 transition-transform group-data-[open]:rotate-180" />
                  </div>
                </MenuButton>

                <MenuItems className="absolute right-0 mt-2 w-56 origin-top-right rounded-lg bg-gray-800 shadow-xl ring-1 ring-white/10 overflow-hidden">
                  {/* User Info Header */}
                  <div className="px-4 py-3 bg-gradient-to-br from-cyan-900/50 to-transparent border-b border-white/10">
                    <p className="text-sm font-medium text-white">{user.username}</p>
                    <p className="text-xs text-gray-400 truncate">{user.emailId || 'user@example.com'}</p>
                  </div>

                  {/* Menu Items */}
                  <div className="py-1">
                    <MenuItem>
                      {({ focus }) => (
                        <Link
                          to="/profile"
                          className={classNames(
                            focus ? 'bg-white/10 text-white' : 'text-gray-300',
                            'block px-4 py-2.5 text-sm transition-colors'
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Profile
                          </div>
                        </Link>
                      )}
                    </MenuItem>
                    
                    <MenuItem>
                      {({ focus }) => (
                        <Link
                          to="/editProfile"
                          className={classNames(
                            focus ? 'bg-white/10 text-white' : 'text-gray-300',
                            'block px-4 py-2.5 text-sm transition-colors'
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit Profile
                          </div>
                        </Link>
                      )}
                    </MenuItem>
                    
                    <div className="border-t border-white/10 my-1"></div>
                    
                    <MenuItem>
                      {({ focus }) => (
                        <button
                          onClick={handleLogout}
                          className={classNames(
                            focus ? 'bg-red-500/20 text-red-200' : 'text-gray-300',
                            'block w-full text-left px-4 py-2.5 text-sm transition-colors'
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Logout
                          </div>
                        </button>
                      )}
                    </MenuItem>
                  </div>
                </MenuItems>
              </Menu>
            </div>
          )}
        </div>
      </div>

      {/* MOBILE MENU */}
      <DisclosurePanel className="sm:hidden px-4 pb-3 border-t border-white/10">
        {user && (
          <>
            {navigation.map((item) => (
              <DisclosureButton
                key={item.name}
                as={Link}
                to={item.to}
                className="block rounded-md px-3 py-2 text-base text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
              >
                {item.name}
              </DisclosureButton>
            ))}

            {/* === REPORT BUG BUTTON (MOBILE) === */}
            <DisclosureButton
              as="a"
              href="mailto:pratyushsharma25feb@gmail.com?subject=Bug Report: AnonyKIET"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-base text-gray-300 hover:bg-red-500/20 hover:text-red-200 transition-colors"
            >
              <Bug className="h-5 w-5" />
              Report Bug
            </DisclosureButton>
          </>
        )}
      </DisclosurePanel>
    </Disclosure>
  )
}