"use client"
import React, { useEffect, useState } from "react";
import image1 from "@/assets/11.png";
import image2 from "@/assets/22.jpg";
import image3 from "@/assets/33.png";
import image4 from "@/assets/44.jpg";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import axios from "axios";
import toast from "react-hot-toast";
import { LoaderCircle } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";


type Job = {
  _id: string;
  title: string;
  salary: number;
  jobType: string;
  company: {
    _id: string;
    name: string;
    logo: string;
  }
};


const FeaturedJob = () => {
  const [job, setJob] = useState<Job[]>([]);
  const [visibleCount, setvisibleCount] = useState(4);
  console.log("Job",job);

  const{id}=useParams();
  const router = useRouter();

 useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axios.get("/api/job/joblist");

        setJob(res.data.jobs);
      } catch (error) {
        console.error(error);
      
      }
    };
    fetchJob();
  }, []);

  const handleRedirect = (jobId:string) =>{router.push(`/details/${jobId}`)
  }

  const handleLoadMore = () => {
    setvisibleCount((prev) => prev + 3);
  };

  const visibleJob = job?.slice(0, visibleCount);
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl text-gray-900 font-bold mb-1.5">Featured Job</h2>
            <p className="text-gray-600">Latest Job Listed Here</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {job?.length > 0 ? (
            visibleJob?.map((job) => (
              <Card key={job._id} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-center">
                    <Image src={job.company?.logo || "/company.png"} alt={job.title} width={12} height={12} className="w-12 h-12 rounded-md mr-4 " />
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">{job.title}</h3>
                      {<p className="text-gray-600">{job.company?.name}</p>}
                      
                    </div>
                  </div>
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center text-gray-500">
                      <i className="fa-solid  fa-money-bill w-5 text-center mr-2"></i>
                      <span>{job.salary ? `₹${Number(job.salary).toLocaleString()}` : "Not disclosed"}</span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <i className="fa-solid  fa-location-dot w-5 text-center mr-2"></i>
                      <span>{job.jobType}</span>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-between items-center">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">New</Badge>
                    <Button  onClick ={() => handleRedirect(job?._id)} className="bg-blue-600 hover:bg-blue-700 text-white rounded-button whitespace-nowrap cursor-pointer">Details</Button>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <>
              <LoaderCircle />
            </>
          )}
        </div>
        {visibleCount < job?.length && (
          <div className="mt-12 text-center">
            <Button onClick={handleLoadMore} className="bg-blue-600 hover:bg-blue-700 text-white rounded-button whitespace-nowrap cursor-pointer">
              Load More <i className="fa-solid fa-arrow-right"></i>
            </Button>
          </div>
        )}
      </div>
</section>
  );
};
export default FeaturedJob;

