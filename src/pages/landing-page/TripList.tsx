import { Button } from "@/components/ui/button";
import img from "../../assets/images/hero.jpg";
import { Plane, BedDouble } from "lucide-react";

const travelOptions = [
  {
    title: "Flights",
    description: "Search Flights & Places Hire to our most popular destinations",
    icon: <Plane className="mr-2 h-4 w-4" />,
    buttonText: "Show Flights",
    img: "bg-image-flight",
  },
  {
    title: "Hotels",
    description: "Search hotels & Places Hire to our most popular destinations",
    icon: <BedDouble className="mr-2 h-4 w-4" />,
    buttonText: "Show Hotels",
    img: "bg-image-hotel",
  },
];

export default function TripList() {
  return (
    <section className="min-h-screen font-montserrat px-5 md:px-10 py-12 md:py-40 lg:py-52 lg:px-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="font-semibold text-2xl">Plant your perfect trip</h1>
          <p className="mb-3 md:mb-0">Search Flight & Places Hire to our most popular destination</p>
        </div>
        <Button className="bg-white border border-primary text-primary hover:text-white">See more places</Button>
      </div>
      <div className="flex flex-wrap gap-y-7 md:gap-9 mt-8">
        <TripListCard />
        <TripListCard />
        <TripListCard />
        <TripListCard />
        <TripListCard />
        <TripListCard />
        <TripListCard />
        <TripListCard />
        <TripListCard />
      </div>
      <div className="w-full h-full flex flex-col md:flex-row gap-y-5 md:gap-y-0 items-center gap-x-9 justify-center mt-22 font-montserrat text-white">
        {travelOptions.map((o) => (
          <TravelOptions
            title={o.title}
            description={o.description}
            icon={o.icon}
            buttonText={o.buttonText}
            img={o.img}
          />
        ))}
      </div>
    </section>
  );
}

function TripListCard() {
  return (
    <div className="bg-white p-4 shadow-lg rounded-lg flex w-full md:w-[47.5%] lg:w-[31.3%] items-center gap-x-5 dark:bg-neutral-900">
      <div className="h-20 w-20 rounded-md overflow-hidden">
        <img
          className="h-full w-full"
          src={img}
          alt=""
        />
      </div>
      <div>
        <h1 className="font-semibold">Istanbul, Turkey</h1>
        <p className="">Flight - Hotel - Resort</p>
      </div>
    </div>
  );
}

function TravelOptions({ title, description, icon, buttonText, img }: { title: string; description: string; icon: React.ReactNode; buttonText: string; img: string }) {
  return (
    <div className={`rounded-lg py-12 px-8 flex flex-col relative items-center md:justify-end overflow-hidden w-full lg:w-[700px] lg:h-[700px] ${img}`}>
      <div className="bg-gradient-to-b z-10 absolute top-0 right-0 w-full from-black via-black opacity-40 h-[100vh]"></div>
      <h1 className="text-5xl font-semibold z-20">{title}</h1>
      <p className="my-5 text-center z-20">{description}</p>
      <Button className="text-lg w-2/3 lg:w-1/3 z-20 text-black rounded-xs py-7">
        {icon}
        {buttonText}
      </Button>
    </div>
  );
}
