import { SignIn } from "@clerk/nextjs"; // If needed for authentication
import Image from "next/image"; // Consider if you are using it
import Header from "./_components/Header";
import CategoryList from "./_components/CategoryList";
import ResturentList from "./_components/ResturentList";


export default function Home() {
  return (
    <div >
     
      <Header />

      <div className="container mx-auto p-4">
        <CategoryList />
      </div>

      <div className="container mx-auto p-4">
        <ResturentList />
      </div>
    </div>
  );
}
