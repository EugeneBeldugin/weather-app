import {
  createBrowserRouter,
  LoaderFunction,
  redirect,
} from "react-router-dom";
import WeatherPage from "./pages/WeatherPage";
import HistoryPage from "./pages/HistoryPage";

const getCurrentCity = async (): Promise<string> => {
  try {
    if (!navigator.geolocation) {
      return "Kyiv";
    }

    const position = await new Promise<GeolocationPosition>(
      (resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      },
    );

    const { latitude, longitude } = position.coords;
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/weather/coordinates?lat=${latitude}&lon=${longitude}`,
    );

    if (!response.ok) {
      throw new Error("Failed to get weather by coordinates");
    }

    const data = await response.json();
    return data.name || "Kyiv";
  } catch (error) {
    console.error("Error getting location:", error);
    return "Kyiv";
  }
};

export const weatherLoader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  let city = url.searchParams.get("city");

  if (!city) {
    city = await getCurrentCity();
    return redirect(`/?city=${city}`);
  }

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/weather?city=${city}`,
    );
    if (!response.ok) {
      throw new Error("Failed to fetch weather data");
    }
    const data = await response.json();
    return { weather: data };
  } catch (error) {
    throw new Error("Failed to fetch weather data");
  }
};

export const historyLoader: LoaderFunction = async () => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/weather/history`,
  );
  const data = await response.json();
  return { history: data };
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <WeatherPage />,
    loader: weatherLoader,
    errorElement: <div>Error loading weather data!</div>,
  },
  {
    path: "/history",
    element: <HistoryPage />,
    loader: historyLoader,
    errorElement: <div>Error loading history!</div>,
  },
]);
