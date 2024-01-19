import { UserCircle } from '@phosphor-icons/react/dist/ssr'

export function Header() {
  return (
    <header className='fixed w-full p-5 max-w-screen-lg'>
      <div className='navbar light:bg-slate-100 dark:bg-slate-500 rounded-xl'>
        <div className='flex-1'>
          <a className='btn btn-ghost text-xl text-neutral'>Grammar Buddy</a>
        </div>
        <div className='flex-none gap-2'>
          <div className='dropdown dropdown-end'>
            <div tabIndex={0} role='button' className='btn btn-ghost btn-circle avatar'>
              <div className='w-10 rounded-full'>
                <UserCircle size={32} weight='thin' className='w-full h-full ' />
              </div>
            </div>
            <ul
              tabIndex={0}
              className='mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52'>
              <li>
                <a>Settings</a>
              </li>
              <li>
                <a>Logout</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  )
}
