import Footer from "./Footer";
import Header from "./Header";

export default function ClientPage ({children}:{children: React.ReactNode}) {
     return (
          <>
               <Header />
               <main className="w-full relative">
                    {children}
               </main>
               <Footer />
          </>
     )
}