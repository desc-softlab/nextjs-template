import Image from "next/image";
import Logo from '../../../public/logo/Desc Softlab Logo.png'
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <>
      <div className="bg-black w-full h-auto py-6 flex items-center justify-center">
        <div className="w-auto flex flex-col items-center justify-center gap-[10px]">
          <Image src={Logo} alt="Desc softlab Ltd" width={200} height={200} className="rounded-full w-[150px] aspect-square object-cover " />
          <h1 className="text-[1.2rem] font-bold">Desc Softlab Nextjs Template</h1>
          <Link href={'https://descsoftlab.com'} target="_blank" className="text-blue-600">Visit Our Site for products</Link>
          <button type="button" className="border-[1.2px] text-white border-white rounded-[8px] px-[16px] py-[8px] text-[0.9rem]">Show notification</button>
          <Button>New button</Button>
        </div>
      </div>
    </>
  );
}
