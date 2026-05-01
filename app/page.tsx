"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { NewsTable } from "@/components/news-table";
import { PeaceCounterHero } from "@/components/peace-counter-hero";
import { RecentStreaks } from "@/components/recent-streaks";
import { ThemeToggle } from "@/components/theme-toggle";

type NewsItem = {
  id_unico: string;
  titulo: string;
  municipio: string;
  fecha_noticia: string;
  fuente: string;
  enlace: string;
};

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

function getElapsedTime(dateString: string): ElapsedTime | null {
  const publishedDate = new Date(dateString);

  if (Number.isNaN(publishedDate.getTime())) {
    return null;
  }

  const diffInMs = Math.max(0, Date.now() - publishedDate.getTime());
  const totalSeconds = Math.floor(diffInMs / 1000);

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds };
}

function getElapsedTimeBetween(
  newerDateString: string,
  olderDateString: string,
): ElapsedTime | null {
  const newerDate = new Date(newerDateString);
  const olderDate = new Date(olderDateString);

  if (
    Number.isNaN(newerDate.getTime()) ||
    Number.isNaN(olderDate.getTime())
  ) {
    return null;
  }

  const diffInMs = Math.max(0, newerDate.getTime() - olderDate.getTime());
  const totalSeconds = Math.floor(diffInMs / 1000);

  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

export default function Page() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [elapsedTime, setElapsedTime] = useState<ElapsedTime | null>(null);

  useEffect(() => {
    const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK;

    if (!webhookUrl) {
      setError(
        "Falta configurar la key para consultar las noticias.",
      );
      setIsLoading(false);
      return;
    }

    const resolvedWebhookUrl = webhookUrl;
    const controller = new AbortController();

    async function loadNews() {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(resolvedWebhookUrl, {
          method: "GET",
          signal: controller.signal,
          headers: {
            Accept: "application/json",
          },
          cache: "no-store",
        });

        const responseText = await response.text();

        if (!response.ok) {
          const details = responseText.trim();
          throw new Error(
            details
              ? `Error ${response.status}: ${details}`
              : `Error ${response.status}: no fue posible cargar datos desde n8n.`,
          );
        }

        const payload = responseText ? JSON.parse(responseText) : [];
        const rawNews = Array.isArray(payload) ? payload : payload?.data;

        if (!Array.isArray(rawNews)) {
          throw new Error("La respuesta del webhook no tiene un formato válido.");
        }

        const normalizedNews = rawNews
          .filter((item): item is NewsItem => {
            return Boolean(
              item?.id_unico &&
                item?.titulo &&
                item?.municipio &&
                item?.fecha_noticia &&
                item?.fuente &&
                item?.enlace,
            );
          })
          .sort((a, b) => {
            return (
              new Date(b.fecha_noticia).getTime() -
              new Date(a.fecha_noticia).getTime()
            );
          });

        setNews(normalizedNews);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        setError(
          err instanceof Error
            ? err.message
            : "Ocurrió un error inesperado al consultar el webhook.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadNews();

    return () => controller.abort();
  }, []);

  const latestNews = useMemo(() => news[0] ?? null, [news]);
  const recentStreaks = useMemo<StreakItem[]>(() => {
    return news
      .slice(0, 8)
      .map((item, index, items) => {
        const previousItem = items[index + 1];

        if (!previousItem) {
          return null;
        }

        const elapsed = getElapsedTimeBetween(
          item.fecha_noticia,
          previousItem.fecha_noticia,
        );

        if (!elapsed) {
          return null;
        }

        return {
          id: `${item.id_unico}-${previousItem.id_unico}`,
          startDate: previousItem.fecha_noticia,
          endDate: item.fecha_noticia,
          elapsedTime: elapsed,
          currentTitle: item.titulo,
          previousTitle: previousItem.titulo,
        };
      })
      .filter((item): item is StreakItem => item !== null)
      .slice(0, 7);
  }, [news]);

  useEffect(() => {
    if (!latestNews?.fecha_noticia) {
      setElapsedTime(null);
      return;
    }

    const updateElapsedTime = () => {
      setElapsedTime(getElapsedTime(latestNews.fecha_noticia));
    };

    updateElapsedTime();

    const intervalId = window.setInterval(updateElapsedTime, 1000);
    return () => window.clearInterval(intervalId);
  }, [latestNews]);

  return (
    <main className="min-h-screen bg-[#f4f4f2] text-neutral-950 dark:bg-[#101215] dark:text-neutral-100">
      <div className="mx-auto flex min-h-screen w-full max-w-[1360px] flex-col gap-10 px-6 py-7 sm:px-8 lg:px-10">
        <header className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[2rem] font-semibold tracking-[-0.05em] text-neutral-950 dark:text-white">
              Monitor de Seguimiento 
            </p>
          </div>
          <ThemeToggle />
        </header>

        <PeaceCounterHero
          municipality={latestNews?.municipio ?? "Malambo"}
          latestDate={latestNews?.fecha_noticia ?? null}
          elapsedTime={elapsedTime}
          isLoading={isLoading}
          hasError={Boolean(error)}
        />

        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.6fr] lg:items-start">
          <RecentStreaks streaks={recentStreaks} />

          <section className="rounded-[1.8rem] bg-[#efefed] p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] dark:bg-[#15191d] dark:shadow-none">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-[2rem] font-semibold tracking-[-0.04em] text-neutral-950 dark:text-white">
                  Últimos Reportes
                </h2>
              </div>
            </div>

            {isLoading ? (
              <div className="flex min-h-60 items-center justify-center rounded-[1.5rem] bg-white/80 dark:bg-slate-950/30">
                <div className="flex items-center gap-3 text-sm text-neutral-600 dark:text-neutral-300">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Cargando noticias desde n8n...
                </div>
              </div>
            ) : error ? (
              <div className="flex min-h-60 flex-col items-center justify-center gap-3 rounded-[1.5rem] bg-rose-50 px-6 text-center dark:bg-rose-950/30">
                <AlertTriangle className="h-8 w-8 text-rose-600 dark:text-rose-300" />
                <p className="max-w-2xl text-sm text-rose-700 dark:text-rose-200">
                  {error}
                </p>
              </div>
            ) : (
              <NewsTable news={news} />
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
