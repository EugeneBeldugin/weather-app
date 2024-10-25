import React, { memo, useMemo } from "react";
import sun from "../assets/sun.png";
import snowy from "../assets/snowy.png";
import heavyRain from "../assets/heavy-rain.png";
import thunderstorm from "../assets/thunderstorm.png";
import cloudy from "../assets/cloudy.png";

type WeatherType = "clear" | "rain" | "clouds" | "thunder" | "snow";

interface IconConfig {
  src: string;
  alt: string;
}

interface IconProps {
  type: string;
  size: number;
  className?: string;
}

const WEATHER_ICONS: Record<WeatherType, IconConfig> = {
  clear: {
    src: sun,
    alt: "Sunny weather icon",
  },
  rain: {
    src: heavyRain,
    alt: "Rainy weather icon",
  },
  clouds: {
    src: cloudy,
    alt: "Cloudy weather icon",
  },
  thunder: {
    src: thunderstorm,
    alt: "Storm weather icon",
  },
  snow: {
    src: snowy,
    alt: "Snow weather icon",
  },
};

const DEFAULT_ICON = WEATHER_ICONS.clear;

const Icon: React.FC<IconProps> = memo(({ type, size, className = "" }) => {
  const iconConfig = useMemo(() => {
    const normalizedType = type.toLowerCase() as WeatherType;
    return WEATHER_ICONS[normalizedType] || DEFAULT_ICON;
  }, [type]);

  return (
    <div className="inline-block">
      <img
        src={iconConfig.src}
        alt={iconConfig.alt}
        style={{
          width: `${size}px`,
          height: `${size}px`,
        }}
        className={`object-contain animate-fade-in opacity-0 ${className}`}
        loading="lazy"
      />
    </div>
  );
});

Icon.displayName = "Icon";

export default Icon;
