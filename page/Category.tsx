
"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

type Company = {
  _id: string;
  name: string;
  logo?: string;
};

const Category = () => {
  const [company, setCompany] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCategory = async () => {
    try {
      const res = await axios.get("/api/company/getcompanylist");

      // 🔥 SAFE & CORRECT
      const companies = Array.isArray(res.data?.data)
        ? res.data.data
        : [];

      setCompany(companies);
    } catch (error) {
      console.log("Company fetch error:", error);
      setCompany([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  return (
    <div className="px-6 py-10 flex flex-col items-center">
      <h2 className="text-2xl font-semibold mb-5 text-center">
        Browse By Company
      </h2>

      {/* Loading State */}
      {loading && <p>Loading companies...</p>}

      {/* Company List */}
      <div className="flex flex-wrap justify-center gap-3">
        {company.map((cat) => (
          <Card
            key={cat._id}
            className="w-36 flex flex-col items-center justify-center p-6 rounded-xl bg-gray-100 hover:shadow-md transition-shadow"
          >
            <CardContent className="flex flex-col items-center space-y-2">
              <Image
                src={cat.logo || "/company.png"}
                alt={cat.name || "/company.png"}
                width={40}
                height={40}
              />
              <span className="text-sm font-medium text-center">
                {cat.name}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {!loading && company.length === 0 && (
        <p className="text-gray-500 mt-4">No companies found</p>
      )}
    </div>
  );
};

export default Category;
