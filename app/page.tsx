
import { auth } from "@/auth";
import Landing from "@/components/pages/Landing/Landing";
import NavBar from "@/components/pages/Landing/NavBar";

export default async function Home() {
  const session = await auth()
  
  return (
    <>
      <NavBar session={session} />
      <Landing />
    </>
  );
}
