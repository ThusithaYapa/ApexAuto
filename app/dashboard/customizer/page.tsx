"use client";

import { useState, useEffect } from "react";
import { HexColorPicker } from "react-colorful";
import { useAuth } from "../../context/AuthContext";
import { saveBuild } from "../../lib/api";
import LoadingSpinner from "../../components/LoadingSpinner";
import Image from "next/image";

const CUSTOMIZER_LOAD_BUILD_KEY = "customizer-load-build";

type LoadBuild = {
  carModel: string;
  color: string;
  selectedParts: Record<string, string>;
};

const wheelsOptions = [
  { name: "Standard", img: "/wheels/standard.png" },
  { name: "Sport", img: "/wheels/sport.png" },
  { name: "Offroad", img: "/wheels/offroad.png" },
];

const bodyKitOptions = [
  { name: "Default", img: "/cars/carbkit1-r.png" },
  { name: "Sport", img: "/cars/carbkit2-r.png" },
  { name: "Racing", img: "/cars/carbkit3.png" },
];

const spoilerOptions = [
  { name: "None", img: "/spoiler/None.png" },
  { name: "Sport", img: "/spoiler/Sport.png" },
  { name: "Racing", img: "/spoiler/Racing.png" },
];

const carKeys = ["Porsche", "BMW", "Lamborghini"];

function indexOfOption(options: { name: string }[], name: string): number {
  if (!name) return 0;
  const i = options.findIndex((o) => o.name === name);
  return i >= 0 ? i : 0;
}

export default function Customizer() {
  const { user } = useAuth();
  const [color, setColor] = useState("#fffffff");
  const [selectedCar, setSelectedCar] = useState("bmw");
  const [selectedWheels, setSelectedWheels] = useState(0);
  const [selectedBodyKit, setSelectedBodyKit] = useState(0);
  const [selectedSpoiler, setSelectedSpoiler] = useState(0);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    /**
     * When coming from dashboard with "Edit in customizer",
     *  we store the build to load in sessionStorage and read it here.
     * This is needed to avoid issues with Next.js page caching and back/forward navigation
     */
    if (typeof window === "undefined") return;
    const raw = sessionStorage.getItem(CUSTOMIZER_LOAD_BUILD_KEY);
    sessionStorage.removeItem(CUSTOMIZER_LOAD_BUILD_KEY);
    if (!raw) return;
    try {
      const build = JSON.parse(raw) as LoadBuild;
      if (build.color) setColor(build.color);
      if (build.carModel && carKeys.includes(build.carModel))
        setSelectedCar(build.carModel);
      const parts = build.selectedParts || {};
      setSelectedBodyKit(indexOfOption(bodyKitOptions, parts.bodyKit));
      setSelectedSpoiler(indexOfOption(spoilerOptions, parts.spoiler));
      setSelectedWheels(indexOfOption(wheelsOptions, parts.wheels));
    } catch {
      // ignore invalid stored build
      console.warn("Failed to load build for customizer");
    }
  }, []);

   

  const cars: Record<string, { name: string; img: string }> = {
    porsche: { name: "Porsche", img: "/cars/Porsche.png" },
    bmw: { name: "BMW", img: "/cars/bmw.png" },
    lamborghini: { name: "Lamborghini", img: "/cars/Lamborghini.png" },
  };

  const renderOptionButtons = (
    options: { name: string; img?: string }[],
    selectedIndex: number,
    setSelected: (i: number) => void
  ) => (
    <div className="flex flex-wrap justify-center gap-3">
      {options.map((opt, i) => (
        <button
          key={i}
          onClick={() => setSelected(i)}
          className={`px-4 py-2 rounded-lg font-medium text-sm sm:text-base transition-all duration-150 border ${
            selectedIndex === i
              ? "bg-gray-900 text-white border-gray-900"
              : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
          }`}
        >
          {opt.name}
        </button>
      ))}
    </div>
  );

  const handleSave = async () => {
    if (!user) return;
    setSaveMessage(null);
    setSaveLoading(true);
    try {
      const selectedParts = {
        bodyKit: bodyKitOptions[selectedBodyKit].name,
        spoiler: spoilerOptions[selectedSpoiler].name,
        wheels: wheelsOptions[selectedWheels].name,
      };
      const res = await saveBuild(selectedCar, color, selectedParts);
      if (res.data.success) {
        setSaveMessage({ type: "success", text: "Configuration saved!" });
      } else {
        setSaveMessage({
          type: "error",
          text: (res.data as { message?: string }).message || "Failed to save",
        });
      }
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to save configuration";
      setSaveMessage({ type: "error", text: msg });
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-10 flex flex-col lg:flex-row gap-6 lg:gap-8">
      <div className="bg-white rounded-2xl shadow-lg flex-1 relative h-96 sm:h-125 lg:h-150 overflow-hidden flex items-end justify-center">
        <div
          style={{ backgroundColor: color }}
          className="absolute top-0 left-0 w-full h-full rounded-2xl mix-blend-multiply pointer-events-none transition-colors duration-300"
        />
        <Image
          src={cars[selectedCar].img}
          alt={cars[selectedCar].name}
          width={600}
          height={400}
          className="relative z-10 w-full max-w-150 object-contain select-none"
        />
        <div className="absolute top-5 left-1/2 transform -translate-x-1/2 flex flex-row gap-10 items-end pointer-events-none select-none z-20">
          <Image
            src={bodyKitOptions[selectedBodyKit].img}
            alt="Body kit"
            width={100}
            height={100}
            className="object-contain w-full max-w-150 z-10"
          />
          <Image
            src={spoilerOptions[selectedSpoiler].img}
            alt="Spoiler"
            width={300}
            height={600}
            className="object-contain w-full min-w-32.5 z-10"
          />
          <Image
            src={wheelsOptions[selectedWheels].img}
            alt="Wheels"
            width={100}
            height={100}
            className="object-contain w-full min-w-20 z-10 mt-10"
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl flex-1 p-8 flex flex-col gap-8 overflow-auto">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Customize your car
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Choose model, color and upgrades
          </p>
        </div>

        <section>
          <h2 className="text-sm font-semibold text-gray-700 mb-3">
            Car model
          </h2>
          {renderOptionButtons(
            Object.keys(cars).map((k) => ({ name: cars[k].name })),
            Object.keys(cars).indexOf(selectedCar),
            (i: number) => setSelectedCar(Object.keys(cars)[i])
          )}
        </section>

        <section>
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Color</h2>
          <div className="flex justify-center">
            <HexColorPicker
              color={color}
              onChange={setColor}
              className="rounded-xl border"
            />
          </div>
          <p className="text-xs text-gray-500 text-center mt-2">
            Selected: <span className="font-medium">{color}</span>
          </p>
        </section>

        <section>
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Body kit</h2>
          {renderOptionButtons(
            bodyKitOptions,
            selectedBodyKit,
            setSelectedBodyKit
          )}
        </section>

        <section>
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Spoiler</h2>
          {renderOptionButtons(
            spoilerOptions,
            selectedSpoiler,
            setSelectedSpoiler
          )}
        </section>

        <section>
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Wheels</h2>
          {renderOptionButtons(
            wheelsOptions,
            selectedWheels,
            setSelectedWheels
          )}
        </section>

        {saveMessage && (
          <div
            className={`p-3 rounded-xl text-sm ${
              saveMessage.type === "success"
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-600"
            }`}
          >
            {saveMessage.text}
          </div>
        )}

        <div className="pt-4">
          <button
            onClick={handleSave}
            disabled={saveLoading}
            className="w-full py-3 rounded-xl bg-black text-white font-semibold hover:bg-gray-800 transition disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {saveLoading ? (
              <>
                <LoadingSpinner className="h-5 w-5 border-2 border-t-white border-gray-400" />
                Saving...
              </>
            ) : (
              "Save configuration"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
