import { Clock3, Milestone } from "lucide-react";

type ElapsedTime = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

type StreakItem = {
  id: string;
  startDate: string;
  endDate: string;
  elapsedTime: ElapsedTime;
  currentTitle: string;
  previousTitle: string;
};

type RecentStreaksProps = {
  streaks: StreakItem[];
};

function formatDate(dateString: string) {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "Fecha no válida";
  }

  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function formatElapsedTime(elapsedTime: ElapsedTime) {
  const parts = [
    `${elapsedTime.days}d`,
    `${elapsedTime.hours}h`,
    `${elapsedTime.minutes}m`,
    `${elapsedTime.seconds}s`,
  ];

  return parts.join(" ");
}

export function RecentStreaks({ streaks }: RecentStreaksProps) {
  return (
    <section>
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-[1.5rem] font-semibold tracking-[-0.04em] text-neutral-950 dark:text-white sm:text-[2rem]">
            Estado Actual
          </h2>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
            Últimas 7 rachas calculadas por fecha entre noticias consecutivas.
          </p>
        </div>
        <Milestone className="mt-1 h-6 w-6 text-neutral-500" />
      </div>

      {streaks.length === 0 ? (
        <div className="rounded-[1.5rem] bg-white px-5 py-8 text-center text-sm text-neutral-600 shadow-[0_12px_30px_rgba(15,23,42,0.06)] dark:bg-[#15191d] dark:text-neutral-300 sm:px-6 sm:py-10">
          Se necesitan al menos dos noticias válidas para calcular rachas.
        </div>
      ) : (
        <div className="grid gap-4">
          {streaks.map((streak, index) => (
            <article
              key={streak.id}
              className={`rounded-[1.5rem] p-4 shadow-[0_12px_30px_rgba(15,23,42,0.06)] transition-colors sm:p-5 ${
                index === 0
                  ? "bg-[#101317] text-white"
                  : "bg-white text-neutral-950 dark:bg-[#15191d] dark:text-white"
              }`}
            >
              <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
                <span
                  className={`text-xs font-semibold uppercase tracking-[0.22em] ${
                    index === 0
                      ? "text-neutral-400"
                      : "text-neutral-500 dark:text-neutral-400"
                  }`}
                >
                  Racha {index + 1}
                </span>
                <div
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${
                    index === 0
                      ? "bg-white/10 text-white"
                      : "bg-neutral-100 text-neutral-800 dark:bg-white/10 dark:text-neutral-200"
                  }`}
                >
                  <Clock3 className="h-3.5 w-3.5" />
                  {formatElapsedTime(streak.elapsedTime)}
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <div>
                  <p
                    className={`text-xs uppercase tracking-[0.18em] ${
                      index === 0
                        ? "text-neutral-500"
                        : "text-neutral-400 dark:text-neutral-500"
                    }`}
                  >
                    Inicio de la racha
                  </p>
                  <p className="mt-1 text-sm font-medium">
                    {formatDate(streak.startDate)}
                  </p>
                  <p
                    className={`mt-1 line-clamp-2 text-sm ${
                      index === 0
                        ? "text-neutral-300"
                        : "text-neutral-600 dark:text-neutral-400"
                    }`}
                  >
                    {streak.previousTitle}
                  </p>
                </div>

                <div>
                  <p
                    className={`text-xs uppercase tracking-[0.18em] ${
                      index === 0
                        ? "text-neutral-500"
                        : "text-neutral-400 dark:text-neutral-500"
                    }`}
                  >
                    Fin de la racha
                  </p>
                  <p className="mt-1 text-sm font-medium">
                    {formatDate(streak.endDate)}
                  </p>
                  <p
                    className={`mt-1 line-clamp-2 text-sm ${
                      index === 0
                        ? "text-neutral-300"
                        : "text-neutral-600 dark:text-neutral-400"
                    }`}
                  >
                    {streak.currentTitle}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
