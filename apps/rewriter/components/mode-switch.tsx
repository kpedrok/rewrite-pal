import { Switch } from '@repo/ui/components/ui/switch'
import { cn } from '@repo/ui/lib/utils'

export function ModeSwitch({ checked, onChecked }: any) {
  return (
    <section className='flex justify-center items-center w-fit gap-2'>
      <div className='w-1/3'>
        <div className='flex justify-end items-center gap-1'>
          <div
            className={cn('text-[26px]', {
              'opacity-50': checked,
            })}>
            🧠
          </div>
          <span className={`font-medium ${checked ? 'text-gray-400' : 'text-gray-900'}`}>Pro</span>
        </div>
      </div>
      <div className='w-1/4 text-center'>
        <Switch className='text-slate-200 bg-slate-200' checked={checked} onCheckedChange={onChecked}></Switch>
      </div>
      <div className='w-1/3'>
        <div className='flex flex-1 justify-start items-center gap-2'>
          <div
            className={cn('text-[26px]', {
              'opacity-50': !checked,
            })}>
            👾
          </div>
          <span
            className={cn('font-medium text-slate-800', {
              'text-gray-400': !checked,
            })}>
            Fun
          </span>{' '}
        </div>
      </div>
    </section>
  )
}
