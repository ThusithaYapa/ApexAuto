"use client";

import Image from "next/image";
import Container from "./components/Container";
import { Gauge, Paintbrush, Wrench } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "./context/AuthContext";
import { useEffect, useState } from "react";
import { getServices } from "./lib/api";
import { PageLoader } from "./components/LoadingSpinner";

type ServiceItem = {
  id: string;
  name: string;
  description: string;
  price: number;
};

const iconByIndex = [
  <Gauge key="0" className="w-10 h-10 text-black" />,
  <Paintbrush key="1" className="w-10 h-10 text-black" />,
  <Wrench key="2" className="w-10 h-10 text-black" />,
];

export default function Home() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [servicesLoading, setServicesLoading] = useState(true);

  useEffect(() => {
    getServices()
      .then((res) => {
        if (res.data.success && res.data.data) setServices(res.data.data);
      })
      .catch(() => setServices([]))
      .finally(() => setServicesLoading(false));
  }, []);

  return (
    <main className="font-sans text-gray-800 bg-[#f6f7fb]">
      <nav className="bg-white shadow-sm">
        <Container>
          <div className="flex justify-between items-center py-6">
            <h1 className="text-xl font-bold tracking-tight">Apex Auto Mods</h1>

            <div className="hidden md:flex space-x-8 items-center">
              {!authLoading && user ? (
                <>
                  <span className="text-sm text-gray-600">{user.name}</span>
                  <button
                    onClick={() => router.push("/dashboard")}
                    className="bg-black text-white px-5 py-2 rounded-xl font-medium hover:bg-gray-800 transition"
                  >
                    Dashboard
                  </button>
                </>
              ) : (
                <>
                  <a
                    href="/auth/login"
                    className="text-sm text-gray-600 hover:text-black cursor-pointer"
                  >
                    Login
                  </a>
                  <button
                    onClick={() => router.push("/dashboard")}
                    className="bg-black text-white px-5 py-2 rounded-xl font-medium hover:bg-gray-800 transition"
                  >
                    Get started
                  </button>
                </>
              )}
            </div>
          </div>
        </Container>
      </nav>

      <section className="py-24">
        <Container>
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight">
                Upgrade Your Car Into a{" "}
                <span className="text-black font-bold">Beast</span>
              </h1>

              <p className="mt-6 text-lg text-gray-500 max-w-xl">
                Apex Auto Mods Garage brings years of performance tuning and
                aesthetic upgrades into a powerful digital experience.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <button
                  onClick={() => router.push("/dashboard/customizer")}
                  className="bg-black text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 transition"
                >
                  Customize your car
                </button>

                <button
                  onClick={() => router.push("/dashboard")}
                  className="bg-white border border-gray-200 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition"
                >
                  View services
                </button>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-xl">
              <Image
                src="/cars/carland-r.png"
                alt="car"
                width={600}
                height={400}
                className="rounded-2xl w-full"
              />
            </div>
          </div>
        </Container>
      </section>

      <section className="py-24">
        <Container>
          <h2 className="text-3xl font-semibold mb-14 text-center">
            Our services
          </h2>

          {servicesLoading ? (
            <div className="flex justify-center py-12">
              <PageLoader />
            </div>
          ) : services.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((s, i) => (
                <div
                  key={s.id}
                  className="bg-white p-8 rounded-3xl shadow-md hover:shadow-xl transition"
                >
                  <div className="mb-5">{iconByIndex[i % 3]}</div>
                  <h3 className="text-lg font-semibold">{s.name}</h3>
                  <p className="text-gray-500 mt-3 text-sm">{s.description}</p>
                  <p className="text-black font-semibold mt-2">${s.price}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {fallbackServices.map((s, i) => (
                <div
                  key={i}
                  className="bg-white p-8 rounded-3xl shadow-md hover:shadow-xl transition"
                >
                  <div className="mb-5">{s.icon}</div>
                  <h3 className="text-lg font-semibold">{s.title}</h3>
                  <p className="text-gray-500 mt-3 text-sm">{s.desc}</p>
                </div>
              ))}
            </div>
          )}
        </Container>
      </section>

      <section className="py-28 bg-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-semibold">
              Build your dream car online
            </h2>
            <p className="mt-6 text-gray-500">
              Choose wheels, body kits, paint jobs and preview your customized
              car before visiting the garage.
            </p>
            <button
              onClick={() => router.push("/dashboard/customizer")}
              className="mt-10 bg-black text-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-800 transition"
            >
              Launch car builder
            </button>
          </div>
        </Container>
      </section>

      <section className="py-24">
        <Container>
          <h2 className="text-3xl font-semibold text-center mb-14">
            Why Apex Auto Mods?
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl p-8 shadow text-center"
              >
                <h3 className="text-4xl font-bold text-black">{s.value}</h3>
                <p className="text-gray-500 mt-2 text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-24 bg-white">
        <Container>
          <div className="text-center">
            <h2 className="text-4xl font-semibold">
              Ready to transform your ride?
            </h2>
            <p className="mt-4 text-gray-500">
              Create an account and start building today.
            </p>
            <button
              onClick={() => router.push("/auth/register")}
              className="mt-8 bg-black text-white px-10 py-4 rounded-xl text-lg font-semibold hover:bg-gray-800 transition"
            >
              Create account
            </button>
          </div>
        </Container>
      </section>

      <footer className="bg-black text-white py-8 text-center text-sm">
        © 2026 Apex Auto Mods Garage — Colombo & Negombo
      </footer>
    </main>
  );
}

const fallbackServices = [
  {
    icon: <Gauge className="w-10 h-10 text-black" />,
    title: "Performance tuning",
    desc: "ECU remapping, turbo upgrades and exhaust systems.",
  },
  {
    icon: <Paintbrush className="w-10 h-10 text-black" />,
    title: "Aesthetic mods",
    desc: "Wraps, paint jobs, body kits and detailing.",
  },
  {
    icon: <Wrench className="w-10 h-10 text-black" />,
    title: "Wheels & suspension",
    desc: "Alloy wheels and suspension tuning.",
  },
];

const stats = [
  { value: "6+", label: "Years experience" },
  { value: "1200+", label: "Cars modified" },
  { value: "2", label: "Locations" },
  { value: "100%", label: "Satisfied clients" },
];
