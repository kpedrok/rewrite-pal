export default function CoolButton({ children, ...props }: { children: React.ReactNode; [x: string]: any }) {
  return (
    <button
      {...props}
      className='px-8 py-0.5 h-8 hover:border-4 border-2 border-black dark:border-white uppercase bg-white text-neutral-700 transition duration-200 text-xs shadow-[1px_1px_rgba(0,0,0),2px_2px_rgba(0,0,0),3px_3px_rgba(0,0,0),4px_4px_rgba(0,0,0),5px_5px_0px_0px_rgba(0,0,0)] dark:shadow-[1px_1px_rgba(255,255,255),2px_2px_rgba(255,255,255),3px_3px_rgba(255,255,255),4px_4px_rgba(255,255,255),5px_5px_0px_0px_rgba(255,255,255)] '>
      {children}
    </button>
  )
}
