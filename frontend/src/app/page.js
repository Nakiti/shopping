import Link from 'next/link';

export default function Home() {
   return (
      <main className="overflow-x-hidden overflow-y-hidden h-[calc(100vh-4.05rem)]">
         <section className="bg-white h-screen w-screen flex items-center justify-center">
            <div className="max-w-7xl h-full mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center font-serif">
               <h1 className="text-4xl font-bold text-color3">Welcome to Shopping Site</h1>
               <p className="mt-4 text-lg text-color3">Your one-stop shop for all your needs</p>
               <div className="flex flex-row justify-around items-center max-w-md mx-auto">
                  <Link href={"/login"} className="mt-8 inline-block bg-color6 text-white py-3 px-8 hover:bg-blue-700">
                        Login
                  </Link>
                  <Link href={"/shop?page=1"} className="mt-8 inline-block bg-color6 text-white py-3 px-8 hover:bg-blue-700">
                        Shop
                  </Link>
               </div>
            </div>
         </section>
      </main>
   );
}
