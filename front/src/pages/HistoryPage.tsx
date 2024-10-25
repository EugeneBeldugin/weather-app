import { useEffect, useState, memo } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, RefreshCw } from "lucide-react";
import { useCache } from "../hooks/useCache";
import Icon from "../components/Icon";

interface WeatherHistory {
  city: string;
  weatherData: {
    sys: { country: string };
    main: { temp: number };
    weather: Array<{ main: string }>;
  };
  createdAt: string;
}

const HistoryCard = memo(({ item }: { item: WeatherHistory }) => (
  <div className="bg-white rounded-lg p-4 space-y-2 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div>
        <h3 className="font-medium">
          {item.city}, {item.weatherData.sys.country}
        </h3>
        <p className="text-gray-600">{item.weatherData.weather[0]?.main}</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-xl font-bold">
          {Math.round(item.weatherData.main.temp)}°
        </div>
        <Icon size={50} type={item.weatherData.weather[0]?.main} />
      </div>
    </div>
  </div>
));

const Header = memo(
  ({
    onBack,
    onRefresh,
    lastUpdate,
    isLoading,
  }: {
    onBack: () => void;
    onRefresh: () => void;
    lastUpdate: Date | null;
    isLoading: boolean;
  }) => (
    <div className="flex items-center justify-between mb-6">
      <button
        onClick={onBack}
        className="text-gray-600 hover:text-gray-800 flex items-center gap-2"
      >
        ← Back
      </button>
      <div className="flex items-center gap-4">
        {lastUpdate && (
          <span className="text-sm text-gray-500">
            Updated: {lastUpdate.toLocaleTimeString()}
          </span>
        )}
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="p-2 text-gray-600 hover:text-gray-800 rounded-full hover:bg-gray-100 transition-colors"
          title="Refresh"
        >
          <RefreshCw size={20} className={isLoading ? "animate-spin" : ""} />
        </button>
      </div>
    </div>
  ),
);

export default function HistoryPage() {
  const [history, setHistory] = useState<WeatherHistory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const { getFromCache, setToCache } =
    useCache<WeatherHistory[]>("weatherHistory");

  const fetchHistory = async (forceFetch: boolean = false) => {
    setIsLoading(true);
    setError(null);

    try {
      if (!forceFetch) {
        const cachedData = getFromCache();
        if (cachedData?.length) {
          setHistory(cachedData);
          setLastUpdate(new Date());
          setIsLoading(false);
          return;
        }
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/weather/history`,
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setHistory(data);
      setToCache(data);
      setLastUpdate(new Date());
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to fetch history",
      );
      setHistory(getFromCache() || []);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white p-6">
      <div className="w-[95%] md:w-[80%] mx-auto">
        <Header
          onBack={() => navigate("/")}
          onRefresh={() => fetchHistory(true)}
          lastUpdate={lastUpdate}
          isLoading={isLoading}
        />

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg mb-4">
            {error}
          </div>
        )}

        {isLoading && history.length === 0 ? (
          <div className="flex justify-center my-12">
            <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {history.map((item, index) => (
              <HistoryCard
                key={`${item.city}-${item.createdAt}-${index}`}
                item={item}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
