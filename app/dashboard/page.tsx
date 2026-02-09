"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { getBuilds } from "../lib/api";
import { PageLoader } from "../components/LoadingSpinner";
import Link from "next/link";
import { Search } from "lucide-react";

const CUSTOMIZER_LOAD_BUILD_KEY = "customizer-load-build";

type Build = {
  id: string;
  userId: string;
  carModel: string;
  color: string;
  selectedParts: Record<string, string>;
  createdAt: string;
};

function CarCard({
  id,
  name,
  img,
  bodyKit,
  spoiler,
  wheels,
  hexValue,
}: {
  id: string;
  name: string;
  bodyKit: string;
  spoiler: string;
  wheels: string;
  img: string;
  hexValue?: string;
}) {
  return (
    <div className="bg-white rounded-3xl border border-neutral-200 p-6 flex gap-6 relative">
      <Image
        src={img}
        alt={name}
        width={200}
        height={120}
        className="rounded-xl object-contain"
      />
      <div
        className="h-8 w-8 rounded-full absolute top-3 left-3 border border-neutral-300"
        style={{ backgroundColor: hexValue }}
      />
      <div className="flex flex-col justify-between pl-5">
        <div>
          <h3 className="text-lg font-semibold uppercase">{name}</h3>
          <p className="text-xs text-neutral-600 pb-2">#{id.slice(0, 10)}</p>
          <div className="bg-neutral-50 p-3 rounded-lg">
            <p className="text-xs text-gray-500">Body Kit - {bodyKit}</p>
            <p className="text-xs text-gray-500">Spoiler - {spoiler}</p>
            <p className="text-xs text-gray-500">Wheels - {wheels}</p>
          </div>
        </div>
        <div className="pt-2">
          <Link
            href="/dashboard/customizer"
            className="mt-2 text-xs font-normal underline"
          >
            View details
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const router = useRouter();
  const { user, fetchProfile } = useAuth();
  const [builds, setBuilds] = useState<Build[]>([]);
  const [buildsLoading, setBuildsLoading] = useState(true);
  const [latestCollections, setLatestCollections] = useState<Build[]>([]);

  const openBuildInCustomizer = (build: Build) => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(CUSTOMIZER_LOAD_BUILD_KEY, JSON.stringify(build));
    }
    router.push("/dashboard/customizer");
  };

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (!user?.id) return;
    getBuilds(user.id)
      .then((res) => {
        if (res.data.success && res.data.data) {
          setLatestCollections(res.data.data.slice(0, 3));
          setBuilds(res.data.data);
        }
      })
      .catch(() => setBuilds([]))
      .finally(() => setBuildsLoading(false));
  }, [user?.id]);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good Morning";
    if (h < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="min-h-screen bg-[#f6f7fb] flex">
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-10">
          <div>
            <p className="text-sm text-gray-500">{greeting()}</p>
            <h1 className="text-2xl font-semibold text-gray-800">
              {user?.name ?? "Dashboard"}
            </h1>
          </div>

          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              placeholder="Search here"
              className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:ring-2 focus:ring-black outline-none"
            />
          </div>
        </div>

        {latestCollections?.length !== 0 && (
          <section className="mb-12">
            <h2 className="text-lg font-semibold mb-4">
              🔥 Latest Collections
            </h2>
            <div className="grid md:grid-cols-3 gap-7">
              {latestCollections?.map((b, idx) => (
                <CarCard
                  id={b.id}
                  key={idx}
                  hexValue={b.color}
                  name={b.carModel}
                  bodyKit={b.selectedParts.bodyKit}
                  spoiler={b.selectedParts.spoiler}
                  wheels={b.selectedParts.wheels}
                  img={`/cars/${b.carModel}.png`}
                />
              ))}
            </div>
          </section>
        )}

        {latestCollections?.length === 0 && (
          <p className="pb-20 text-gray-400">
            No latest collections available.
          </p>
        )}

        <section>
          <h2 className="text-lg font-semibold mb-4">Regular Collections</h2>

          {buildsLoading ? (
            <PageLoader />
          ) : (
            <div className="bg-white rounded-3xl shadow overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                  <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
                    <th className="text-left px-6 py-4">#ID</th>
                    <th className="text-left px-6 py-4">Car Model</th>
                    <th className="text-left px-6 py-4">Body Kit</th>
                    <th className="text-left px-6 py-4">Spoiler</th>
                    <th className="text-left px-6 py-4">Wheels</th>
                    <th className="text-left px-6 py-4">Color</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {builds.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-6 py-8 text-center text-gray-500"
                      >
                        No saved builds yet.{" "}
                        <Link
                          href="/dashboard/customizer"
                          className="text-black font-semibold hover:underline"
                        >
                          Create one
                        </Link>
                      </td>
                    </tr>
                  ) : (
                    builds.map((b) => (
                      <tr key={b.id} className="border-t border-neutral-300">
                        <td className="pl-5 py-4 font-medium text-xs uppercase">
                          #{b.id.slice(0, 10)}...
                        </td>
                        <td className="px-6 py-4 font-medium uppercase">
                          {b.carModel}
                        </td>
                        <td className="px-6 py-4 uppercase">
                          {b.selectedParts.bodyKit}
                        </td>
                        <td className="px-6 py-4 uppercase">
                          {b.selectedParts.spoiler}
                        </td>
                        <td className="px-6 py-4 uppercase">
                          {b.selectedParts.wheels}
                        </td>
                        <td className="px-6 py-4">
                          <div
                            className="px-3 py-1 w-7 h-7 border border-neutral-200 rounded-full text-xs uppercase"
                            style={{ backgroundColor: b.color }}
                          />
                        </td>
                        <td className="px-6 py-4">
                          <button
                            type="button"
                            onClick={() => openBuildInCustomizer(b)}
                            className="text-sm font-medium text-black hover:underline bg-neutral-100 px-2.5 py-2 rounded-full"
                          >
                            See details
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
