import DSASheet from "@/components/DSA/DSASheet";
import { getCarouselsData } from "@/app/actions/adminActions";
import { auth } from "@/auth";

const DSAPage = async () => {
  const session = await auth()
  const carouselData = await getCarouselsData(session?.user.id)
  return (
    <div className="w-full h-full pt-[4rem] px-6">
      {carouselData.map((carousel) => (
      <DSASheet key={carousel.id} carousel = {carousel} />
      ))}
    </div>
  );
};

export default DSAPage;
