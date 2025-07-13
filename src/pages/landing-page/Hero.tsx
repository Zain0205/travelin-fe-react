import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plane, BedDouble } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function Hero() {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    amount: 0.5,
    once: false,
  });

  return (
    <>
      <section className="h-screen">
        <div className="h-screen lg:h-screen w-full z-20 bg-image flex items-center justify-center">
          <div className="bg-gradient-to-b z-10 absolute top-0 right-0 w-full from-black via-black opacity-40 h-[100vh]"></div>
          <div className="text-center w-full text-white z-20">
            <h1 className="text-3xl lg:text-6xl">Helping Other</h1>
            <h1 className="text-4xl lg:text-9xl my-3 font-semibold tracking-wide">LIVE & TRAVEL</h1>
            <p className="text-xl">Special offers to suit your plan</p>
          </div>

          <motion.div
            ref={ref}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-[90%] bg-white py-5 px-5 shadow-md absolute z-20 hidden md:block -bottom-32 lg:-bottom-40
           rounded-lg dark:bg-neutral-900"
          >
            <Tabs
              defaultValue="flight"
              className="w-full"
            >
              <TabsList className="h-auto bg-transparent border-b border-gray-200 rounded-none justify-start p-0">
                <TabsTrigger
                  value="flight"
                  className="relative cursor-pointer rounded-none border-none bg-transparent px-6 py-4 font-medium text-gray-500 shadow-none transition-none data-[state=active]:bg-transparent data-[state=active]:text-gray-900 data-[state=active]:shadow-none data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:right-0 data-[state=active]:after:h-0.5 data-[state=active]:after:bg-primary data-[state=active]:after:content-['']"
                >
                  <Plane className="w-4 h-4 mr-2" />
                  Flights
                </TabsTrigger>
                <TabsTrigger
                  value="stays"
                  className="relative cursor-pointer rounded-none border-none bg-transparent px-6 py-4 font-medium text-gray-500 shadow-none transition-none data-[state=active]:bg-transparent data-[state=active]:text-gray-900 data-[state=active]:shadow-none data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:right-0 data-[state=active]:after:h-0.5 data-[state=active]:after:bg-primary data-[state=active]:after:content-['']"
                >
                  <BedDouble className="w-4 h-4 mr-2" />
                  Stays
                </TabsTrigger>
              </TabsList>
              <TabsContent
                value="flight"
                className=""
              >
                <div className="p-4 text-gray-600">
                  <FlightSearchForm />
                </div>
              </TabsContent>
              <TabsContent
                value="stays"
                className=""
              >
                <div className="p-4 text-gray-600">
                  <HotelSearchForm />
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </section>
    </>
  );
}

function FlightSearchForm() {
  return (
    <div className="flex flex-col justify-center items-end">
      <div className="flex flex-col md:flex-row justify-between gap-x-5 items-center w-full">
        <div className="w-full md:w-1/3">
          <Label
            className="text-md"
            htmlFor="from"
          >
            From
          </Label>
          <Input
            id="from"
            placeholder="From"
            className="mt-1 mb-4 rounded-md py-5 shadow-none border-2 border-gray-300"
          />
        </div>
        <div className="w-full md:w-1/3">
          <Label
            className="text-md"
            htmlFor="to"
          >
            to
          </Label>
          <Input
            id="to"
            placeholder="to"
            className="mt-1 mb-4 rounded-md py-5 shadow-none border-2 border-gray-300"
          />
        </div>
        <div className="w-full md:w-1/3">
          <Label
            className="text-md"
            htmlFor="airlane-name"
          >
            Airlanes Name
          </Label>
          <Input
            id="airlane-name"
            placeholder="Airline Name"
            className="mt-1 mb-4 rounded-md py-5 shadow-none border-2 border-gray-300"
          />
        </div>
      </div>
      <div className="flex">
        <Button className="py-5">
          <Plane /> Show FLight
        </Button>
      </div>
    </div>
  );
}

function HotelSearchForm() {
  return (
    <div className="flex flex-col justify-center items-end">
      <div className="flex flex-col md:flex-row justify-between gap-x-5 items-center w-full">
        <div className="w-full md:w-1/2">
          <Label
            className="text-md"
            htmlFor="hotel-location-hero"
          >
            Location
          </Label>
          <Input
            id="hotel-location-hero"
            placeholder="Location"
            className="mt-1 mb-4 rounded-md py-5 shadow-none border-2 border-gray-300"
          />
        </div>
        <div className="w-full md:w-1/2">
          <Label
            className="text-md"
            htmlFor="hotel-name-hero"
          >
            Name
          </Label>
          <Input
            id="hotel-name-hero"
            placeholder="Hotel Name"
            className="mt-1 mb-4 rounded-md py-5 shadow-none border-2 border-gray-300"
          />
        </div>
      </div>
      <div className="flex">
        <Button className="py-5">
          <BedDouble /> Show Hotel
        </Button>
      </div>
    </div>
  );
}
