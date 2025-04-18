import Image from "next/image";
import Logo from '../../public/logo/Desc Softlab Logo.png'
import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-black w-screen h-screen flex items-center justify-center">
      <div className="w-auto flex flex-col items-center justify-center gap-[10px]">
        <Image src={Logo} alt="Desc softlab Ltd" width={200} height={200} className="rounded-full " />
        <h1 className="text-[1.2rem] font-bold">Desc Softlab Nextjs Template</h1>
        <Link href={'https://descsoftlab.com'} target="_blank" className="">Visit Our Site from products</Link>
      </div>
    </div>
  );
}
