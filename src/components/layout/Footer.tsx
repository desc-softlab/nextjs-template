import Link from "next/link";

  export default function Footer () {
     return (
          <footer className="w-full flex items-center justify-center p-[16px] bg-black">
               <p className="text-[0.9rem] text-white">All rights research &copy;{new Date().getFullYear()}. Powered by <Link href={'https://descsoftlab.com'}>Desc Softlab Ltd</Link> </p>
          </footer>
     )
  }