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
    <section className="px-0 py-6 sm:px-4 sm:py-10 lg:px-6 lg:py-14">
      <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
        <div className="inline-flex max-w-full items-center gap-2 rounded-full bg-[#d9dde4] px-4 py-2 text-[0.65rem] font-medium uppercase tracking-[0.14em] text-[#5b6470] dark:bg-[#252b33] dark:text-[#c5ccd6] sm:gap-3 sm:px-5 sm:text-sm sm:tracking-[0.18em]">
          <ShieldCheck className="h-4 w-4 text-neutral-950 dark:text-white" />
          <span className="truncate">Estado de seguridad: {statusLabel}</span>
        </div>

        <p className="mt-8 text-[0.72rem] uppercase tracking-[0.24em] text-neutral-600 dark:text-neutral-400 sm:mt-10 sm:text-sm sm:tracking-[0.4em]">
          Tiempo transcurrido sin homicidios
        </p>

        <div className="mt-6 grid w-full grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-4 sm:gap-x-8 sm:gap-y-6">
          {counterItems.map((item) => (
            <div key={item.label} className="flex min-w-0 items-start justify-center gap-1">
              <span className="text-[3.5rem] font-semibold leading-none tracking-[-0.08em] text-neutral-950 dark:text-white sm:text-[5rem] lg:text-[6.5rem]">
                {isLoading
                  ? "..."
                  : item.value === null
                    ? "N/D"
                    : String(item.value)}
              </span>
              <span className="pt-1.5 text-xl font-light text-neutral-700 dark:text-neutral-300 sm:pt-2 sm:text-2xl lg:pt-3 lg:text-[3rem]">
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

        <div className="mt-8 flex flex-col items-center justify-center gap-3 text-sm text-neutral-500 dark:text-neutral-400 sm:flex-row sm:flex-wrap sm:gap-4">
          <span className="inline-flex items-center gap-2">
            <MapPinned className="h-4 w-4" />
            {municipality}
          </span>
          <span className="max-w-[28rem] text-center">{formatDate(latestDate)}</span>
        </div>
      </div>
    </section>
  );
}
