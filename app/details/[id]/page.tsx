

"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import { LoaderCircle } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootType } from "@/store";

// ✅ Job interface stays same
interface Job {
  _id: string;
  title: string;
  description: string;
  location: string;
  jobType: string;
  experinceLevel?: number;
  salary: number;
  position: number;
  requirement: string[];
  company: {
    title: string;
    logo?: string;
    description?: string;
  };
}

// ✅ Make sure your Redux user has _id
interface User {
  _id: string;
  name: string;
  email: string;
}

const JobDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [jobDetail, setJobDetail] = useState<Job | null>(null);
  const user = useSelector((state: RootType) => state.auth.user as User | null); // ✅ cast user
  const [hasApplied, setHasApplied] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const applyJob = async () => {
    if (!user || !user._id) {  // ✅ login check fixed
      router.push("/sign-in");
      return;
    }

    if (hasApplied) {
      toast("You have already applied for this job");
      return;
    }

    try {
      setLoading(true);
      await axios.post("/api/application/applyjob", {
        jobId: id,
        applicantId: user._id, // ✅ user._id works now
      });
      setHasApplied(true);
      toast.success("Applied job");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const jobDetailsFetch = async () => {
      try {
        const res = await axios.get(`/api/job/jobbyid/${id}`);
        setJobDetail(res.data.job);
      } catch (error) {
        console.log(error);
      }
    };
    jobDetailsFetch();
  }, [id]);

  if (!jobDetail) {
    return (
      <div>
        <LoaderCircle />
      </div>
    );
  }

  return (
    <div className="mb-8 bg-white px-4 py-10 flex justify-center">
      <div className="w-full max-w-3xl space-x-6">
        <div className="flex items-center space-x-4">
          <img src={jobDetail?.company.logo} alt={jobDetail?.company.title} />
          <div>
            <h1 className="text-3xl font-bold">{jobDetail?.title}</h1>
            <p className="text-lg">{jobDetail?.company.title}</p>
          </div>
        </div>

        {/* job metadata */}
        <div className="rid grid-cols-1 sm:grid-cols-2 text-sm">
          <p>
            <span className="font-semibold">Location</span>
            {jobDetail?.location}
          </p>
          <p>
            <span className="font-semibold">Type</span>
            {jobDetail?.jobType}
          </p>
          <p>
            <span className="font-semibold">Salary</span>
            {""} ${jobDetail?.salary}
          </p>
          {jobDetail.experinceLevel && (
            <p>
              <span className="font-semibold">Experince Level :</span>
              {jobDetail.experinceLevel} years
            </p>
          )}
        </div>

        {/* requirement*/}
        {jobDetail.requirement.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-2 mt-2">Requirement</h2>
            <ul className="list-disc list-inside space-y-1">
              {jobDetail.requirement.map((req, idx) => (
                <li key={idx}>{req}</li>
              ))}
            </ul>
          </div>
        )}

        {/*description */}
        <div className="text-base leading-relaxed">
          <h2 className="text-xl font-semibold mb-2 mt-2">Job Description</h2>
          <p>{jobDetail.description}</p>
        </div>

        {/* company info*/}
        {jobDetail.company.description && (
          <div>
            <h2 className="text-2xl font-semibold mb-2 mt-2">About the company</h2>
            <p>{jobDetail.company.description}</p>
          </div>
        )}

        <Button
          className="bg-blue-800 mt-4 text-white px-6 py-2 rounded cursor-pointer hover:bg-blue-900"
          onClick={() => {
            if (!user) {
              router.push("/sign-in");
            } else if (!hasApplied) {
              applyJob();
            }
          }}
          disabled={loading || hasApplied} // ✅ prevent multiple clicks
        >
          {loading ? "Applying..." : hasApplied ? "Applied" : "Apply"}
        </Button>
      </div>
    </div>
  );
};

export default JobDetails;
