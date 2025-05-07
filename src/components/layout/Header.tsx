import Image from 'next/image';
import Logo from '../../../public/logo/Desc Softlab Logo.png';
import Link from 'next/link';


export default function Header () {

     return (
          <header className='w-full flex items-center justify-between p-[16px] px-[2%] bg-white'>
               <div className='w-auto flex items-center justify-start gap-[16px]'>
                    <Image src={Logo} alt='Desc Softlab logo' width={150} height={150} className='rounded-full w-[60px] aspect-square object-cover' /> 
                    <h1 className='text-[1.8rem] text-black font-bold'>Business Name</h1>
               </div>
               <nav className='w-auto flex items-center gap-[8px]'>
                    <h2 className='text-[1.2rem] font-bold text-black'>Navigation bar</h2>
                    <Link href={`/auth/login`} className='p-[8px] px-[16px] rounded-[8px] text-white bg-black hover:bg-gray-800'>Login</Link>
               </nav>
          </header>
     )
}