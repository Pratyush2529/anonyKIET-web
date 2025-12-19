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
import { Bug } from 'lucide-react';

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
    <Disclosure as="nav" className="sticky top-0 z-50 bg-cyan-900">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">
          {/* LEFT — Logo */}
          {user ? (
            <div className="flex items-center gap-3">
      {/* Mobile menu button */}
      <DisclosureButton className="sm:hidden inline-flex items-center justify-center rounded-md p-2 text-gray-300 hover:bg-white/10 hover:text-white">
        <Bars3Icon className="h-6 w-6 data-open:hidden" />
        <XMarkIcon className="hidden h-6 w-6 data-open:block" />
      </DisclosureButton>
      <Link to="/">

      <img
        src={logo}
        alt="AnonyKIET"
        className="h-16 w-auto"
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
                    'rounded-md px-3 py-2 text-sm font-medium'
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

          {/* RIGHT — User */}
          {user && (
            <div className="flex items-center gap-3">
              <span className="hidden sm:block text-sm text-gray-300">
                {user.username}
              </span>

              <Menu as="div" className="relative">
                <MenuButton className="flex rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <img
                    src={user.photoUrl}
                    alt=""
                    className="h-10 w-10 rounded-full bg-gray-800 object-cover"
                  />
                </MenuButton>

                <MenuItems className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-gray-800 py-1 shadow-lg ring-1 ring-black/5">
                  <MenuItem>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/10"
                    >
                      Profile
                    </Link>
                  </MenuItem>
                  <MenuItem>
                    <Link
                      to="/editProfile"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/10"
                    >
                      Edit Profile
                    </Link>
                  </MenuItem>
                  <MenuItem>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/10"
                    >
                      Logout
                    </button>
                  </MenuItem>
                </MenuItems>
              </Menu>
            </div>
          )}
        </div>
      </div>

      {/* MOBILE MENU */}
      <DisclosurePanel className="sm:hidden px-4 pb-3">
        {user && (
          <>
            {navigation.map((item) => (
              <DisclosureButton
                key={item.name}
                as={Link}
                to={item.to}
                className="block rounded-md px-3 py-2 text-base text-gray-300 hover:bg-white/10 hover:text-white"
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
              className="flex items-center gap-2 rounded-md px-3 py-2 text-base text-gray-300 hover:bg-red-500/20 hover:text-red-200"
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