import {
  useLoaderData,
  useSubmit,
  useNavigation,
  Link,
} from "react-router-dom";
import { Loader2 } from "lucide-react";
import React, { useState, memo, useEffect } from "react";
import Icon from "../components/Icon";

interface WeatherData {
  name: string;
  sys: { country: string };
  main: { temp: number };
  weather: Array<{ main: string; description: string }>;
}

interface LoaderData {
  weather: WeatherData | null;
}

const WeatherInfo = memo(({ weather }: { weather: WeatherData }) => (
  <div className="text-center flex flex-col gap-4 md:gap-36">
    <div className="mx-auto w-fit">
      <Icon type={weather.weather[0]?.main} size={200} />
    </div>
    <div>
      <h2 className="text-2xl font-bold">
        {weather.name}, {weather.sys.country}
      </h2>
      <p className="text-6xl font-bold my-2">
        {Math.round(weather.main.temp)}°
      </p>
      <p className="text-gray-600">{weather.weather[0]?.main}</p>
    </div>
  </div>
));

const WeatherForm = memo(
  ({
    onSubmit,
    isLoading,
    onKeyboardChange,
  }: {
    onSubmit: (city: string) => void;
    isLoading: boolean;
    onKeyboardChange: (isOpen: boolean) => void;
  }) => {
    const [city, setCity] = useState("");

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (city.trim()) {
        onSubmit(city);
      }
    };

    return (
      <form className="space-y-4 p-4" onSubmit={handleSubmit}>
        <div className="relative">
          <input
            type="text"
            name="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onFocus={() => onKeyboardChange(true)}
            onBlur={() => onKeyboardChange(false)}
            placeholder="Enter the city"
            className="w-full p-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !city.trim()}
          className="w-full p-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-blue-300"
        >
          {isLoading ? "Loading..." : "SUBMIT"}
        </button>
      </form>
    );
  },
);

export default function WeatherPage() {
  const { weather } = useLoaderData() as LoaderData;
  const submit = useSubmit();
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleSubmit = (city: string) => {
    const formData = new FormData();
    formData.append("city", city);
    submit(formData);
  };

  const shouldHideWeather = isMobile && isKeyboardOpen;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
      <div className="min-h-screen max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 items-center">
        <div className="m-x-auto">
          {isLoading ? (
            <div className="flex justify-center">
              <Loader2 className="w-32 h-32 animate-spin text-blue-500" />
            </div>
          ) : (
            weather && !shouldHideWeather && <WeatherInfo weather={weather} />
          )}
        </div>
        <div className="m-x-auto flex flex-col justify-between">
          <WeatherForm
            onSubmit={handleSubmit}
            isLoading={isLoading}
            onKeyboardChange={setIsKeyboardOpen}
          />
          <Link
            to="/history"
            className="w-full text-center text-gray-500 hover:text-gray-700 block underline underline-offset-4"
          >
            Show history
          </Link>
        </div>
      </div>
    </div>
  );
}
