"use client"

import React, { useEffect, useState } from 'react'
import HeroImage from '@/assets/hero.png'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation';
import axios from 'axios';

const HeroSection = () => {
  const [jobSearch, setJobSearch] = useState("");
  const [result, setResult] = useState([]);
  const [showSuggestion, setShowSuggestion] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const delayBounce = setTimeout(() => {
      if (jobSearch.trim()) {
        fetchSuggestion();
      } else {
        setResult([]);
        setShowSuggestion(false);
      }
    }, 300);
    return () => clearTimeout(delayBounce);
  }, [jobSearch]);


  const fetchSuggestion = async () => {
    try {
      const query = jobSearch.trim();
      if(!query) return;

      console.log("Searching:", query);
      const res = await axios.get(`/api/job/SearchBar?searchTerm=${encodeURIComponent(query)}`);
      setResult(res.data.jobs);
      setShowSuggestion(true);

    } catch (error) {
      console.log(error)
    }
  };
  const handleSuggestion = (job: any) => {
    setJobSearch(job.title);
    setShowSuggestion(false)
    router.push(`/details/${job._id}`);
  };
  return (
    <section className='relative'>
      <div className='absolute inset-0 overflow-hidden'>
        <img src={HeroImage.src} alt='Hero Banner Image' className='w-full h-full object-cover object-top'></img>
        <div className='absolute inset-0  bg-linear-to-r from-blue-900/90 to-blue-600/70 '></div>
      </div>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative py-20'>
        <div className='max-w-2xl'>
          <h1 className='text-5xl font-bold text-white mb-4-'>Find our Dream Job</h1>
          <p className='text-xl text-blue-100 mb-8'>connect with over 20,000 employer and discover opportunities that match your skills</p>

          {/*Search Box*/}
          <div className='relative w-full max-w-2xl bg-white/80 backdrop-blur-lg border border-gray-200 rounded-xl shadow-lg'>
            <div className='relative'>
              <i className='fa-solid fa-search absolute left-4 top-1/2  transform  translate-y-1/2 text-gray-400'></i>
              <Input
                id='job-search'
                type='text'
                placeholder='search for jobs like frontend developer'
                className='pl-10 py-3 text-lg rounded-xl border-gray-300 w-full transition-all duration-200 focus:ring-2 focus: ring-blue-500 focus:outline-none'
                onChange={(e) => setJobSearch(e.target.value)}
                onFocus={() => setShowSuggestion(true)} />
            </div>
            {showSuggestion && result.length > 0 && (
              <ul className='absolute z-10 mt-2 w-full bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-y-auto'
              >
                {result.map((job: any) => (
                  <li 
                  key={job._id} className='px-4 hover:bg-blue-100 hover:text-blue-900 cursor-pointer transition-all duration-150' onClick={() => handleSuggestion(job)}>
                    {job.title}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
