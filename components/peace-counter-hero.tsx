import { MapPinned, ShieldCheck } from "lucide-react";

type ElapsedTime = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

type PeaceCounterHeroProps = {
  municipality: string;
  latestDate: string | null;
  elapsedTime: ElapsedTime | null;
  isLoading: boolean;
  hasError: boolean;
};

function formatDate(dateString: string | null) {
  if (!dateString) {
    return "Sin fecha disponible";
  }

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "Fecha no válida";
  }

  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "full",
    timeStyle: "short",
  }).format(date);
}

export function PeaceCounterHero({
  municipality,
  latestDate,
  elapsedTime,
  isLoading,
  hasError,
}: PeaceCounterHeroProps) {
  const statusLabel = isLoading
    ? "Actualizando"
    : hasError
      ? "Sin conexión"
      : elapsedTime === null
        ? "Sin registros"
        : "Último evento detectado";

  const counterItems = [
    {
      label: "Días",
      value: elapsedTime?.days ?? null,
    },
    {
      label: "Horas",
      value: elapsedTime?.hours ?? null,
    },
    {
      label: "Min",
      value: elapsedTime?.minutes ?? null,
    },
    {
      label: "Seg",
      value: elapsedTime?.seconds ?? null,
    },
  ];

  return (
    <section className="px-2 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
        <div className="inline-flex items-center gap-3 rounded-full bg-[#d9dde4] px-5 py-2 text-sm font-medium uppercase tracking-[0.18em] text-[#5b6470] dark:bg-[#252b33] dark:text-[#c5ccd6]">
          <ShieldCheck className="h-4 w-4 text-neutral-950 dark:text-white" />
          Estado de seguridad: {statusLabel}
        </div>

        <p className="mt-10 text-sm uppercase tracking-[0.4em] text-neutral-600 dark:text-neutral-400">
          Tiempo transcurrido sin homicidios
        </p>

        <div className="mt-6 grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-4">
          {counterItems.map((item) => (
            <div key={item.label} className="flex items-start justify-center gap-1">
              <span className="text-[5rem] font-semibold leading-none tracking-[-0.08em] text-neutral-950 dark:text-white sm:text-[6.5rem]">
                {isLoading
                  ? "..."
                  : item.value === null
                    ? "N/D"
                    : String(item.value)}
              </span>
              <span className="pt-2 text-2xl font-light text-neutral-700 dark:text-neutral-300 sm:pt-3 sm:text-[3rem]">
                {item.label === "Días"
                  ? "d"
                  : item.label === "Horas"
                    ? "h"
                    : item.label === "Min"
                      ? "m"
                      : "s"}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm text-neutral-500 dark:text-neutral-400">
          <span className="inline-flex items-center gap-2">
            <MapPinned className="h-4 w-4" />
            {municipality}
          </span>
          <span>{formatDate(latestDate)}</span>
        </div>
      </div>
    </section>
  );
}
