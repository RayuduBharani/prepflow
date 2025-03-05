import DSASheet from "@/components/DSA/DSASheet";
import { getCarouselsData } from "@/actions/adminActions";
import { auth } from "@/auth";
import type { Metadata } from "next";

export const metadata : Metadata = {
  title : 'PrepFlow - DSA Sheets'
}


const DSAPage = async () => {
  const session = await auth()
  const carouselData = await getCarouselsData(session?.user.id)
  return (
    <div className="w-full h-full pt-[4rem] px-6 max-sm:px-3">
      {carouselData.map((carousel) => (
      <DSASheet key={carousel.id} carousel = {carousel} />
      ))}
    </div>
  );
}

export default DSAPage;
