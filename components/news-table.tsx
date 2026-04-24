"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, ExternalLink, Newspaper } from "lucide-react";

type NewsItem = {
  id_unico: string;
  titulo: string;
  municipio: string;
  fecha_noticia: string;
  fuente: string;
  enlace: string;
};

type NewsTableProps = {
  news: NewsItem[];
};

const PAGE_SIZE = 10;

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

export function NewsTable({ news }: NewsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(news.length / PAGE_SIZE));

  const paginatedNews = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return news.slice(startIndex, startIndex + PAGE_SIZE);
  }, [currentPage, news]);

  useEffect(() => {
    setCurrentPage((previousPage) => Math.min(previousPage, totalPages));
  }, [totalPages]);

  if (news.length === 0) {
    return (
      <div className="flex min-h-60 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-300/80 bg-slate-50/80 px-6 text-center dark:border-slate-700 dark:bg-slate-950/30">
        <Newspaper className="h-8 w-8 text-slate-500 dark:text-slate-300" />
        <div>
          <p className="text-base font-medium text-slate-700 dark:text-slate-100">
            No hay noticias disponibles
          </p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Cuando el webhook entregue registros, aparecerán aquí.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[1.5rem] bg-white shadow-[0_12px_30px_rgba(15,23,42,0.05)] dark:bg-[#101317] dark:shadow-none">
      <div className="grid gap-4 p-4 sm:hidden">
        {paginatedNews.map((item) => (
          <article
            key={item.id_unico}
            className="rounded-[1.25rem] border border-neutral-200 bg-[#fafaf8] p-4 dark:border-white/10 dark:bg-white/5"
          >
            <p className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
              {item.titulo}
            </p>

            <dl className="mt-4 grid gap-3 text-sm">
              <div>
                <dt className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
                  Municipio
                </dt>
                <dd className="mt-1 text-neutral-700 dark:text-neutral-200">
                  {item.municipio}
                </dd>
              </div>

              <div>
                <dt className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
                  Fecha
                </dt>
                <dd className="mt-1 text-neutral-700 dark:text-neutral-200">
                  {formatDate(item.fecha_noticia)}
                </dd>
              </div>

              <div>
                <dt className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
                  Fuente
                </dt>
                <dd className="mt-1 text-neutral-700 dark:text-neutral-200">
                  {item.fuente}
                </dd>
              </div>
            </dl>

            <a
              href={item.enlace}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-neutral-900 underline decoration-neutral-300 underline-offset-4 transition-colors hover:text-neutral-600 dark:text-neutral-100 dark:decoration-neutral-600 dark:hover:text-neutral-300"
            >
              Ver fuente
              <ExternalLink className="h-4 w-4" />
            </a>
          </article>
        ))}
      </div>

      <div className="hidden overflow-x-auto sm:block">
        <table className="min-w-full divide-y divide-neutral-200 dark:divide-white/10">
          <thead className="bg-[#f7f7f5] dark:bg-white/5">
            <tr className="text-left text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
              <th className="px-4 py-4">Titular</th>
              <th className="px-4 py-4">Municipio</th>
              <th className="px-4 py-4">Fecha</th>
              <th className="px-4 py-4">Fuente</th>
              <th className="px-4 py-4">Enlace</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 bg-white dark:divide-white/10 dark:bg-transparent">
            {paginatedNews.map((item) => (
              <tr
                key={item.id_unico}
                className="transition-colors hover:bg-[#fafaf8] dark:hover:bg-white/5"
              >
                <td className="max-w-xl px-4 py-4 text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  {item.titulo}
                </td>
                <td className="whitespace-nowrap px-4 py-4 text-sm text-neutral-600 dark:text-neutral-300">
                  {item.municipio}
                </td>
                <td className="whitespace-nowrap px-4 py-4 text-sm text-neutral-600 dark:text-neutral-300">
                  {formatDate(item.fecha_noticia)}
                </td>
                <td className="whitespace-nowrap px-4 py-4 text-sm text-neutral-600 dark:text-neutral-300">
                  {item.fuente}
                </td>
                <td className="px-4 py-4 text-sm">
                  <a
                    href={item.enlace}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 font-medium text-neutral-900 underline decoration-neutral-300 underline-offset-4 transition-colors hover:text-neutral-600 dark:text-neutral-100 dark:decoration-neutral-600 dark:hover:text-neutral-300"
                  >
                    Ver fuente
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-4 border-t border-neutral-200 bg-[#f7f7f5] px-4 py-4 dark:border-white/10 dark:bg-white/5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-6 text-neutral-600 dark:text-neutral-300">
          Mostrando{" "}
          <span className="font-medium text-neutral-900 dark:text-white">
            {(currentPage - 1) * PAGE_SIZE + 1}
          </span>{" "}
          a{" "}
          <span className="font-medium text-neutral-900 dark:text-white">
            {Math.min(currentPage * PAGE_SIZE, news.length)}
          </span>{" "}
          de{" "}
          <span className="font-medium text-neutral-900 dark:text-white">
            {news.length}
          </span>{" "}
          noticias
        </p>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            disabled={currentPage === 1}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-700 dark:bg-[#101317] dark:text-neutral-200 dark:hover:bg-[#1a1f24]"
          >
            <ChevronLeft className="h-4 w-4" />
            Anterior
          </button>

          <span className="text-center text-sm font-medium text-neutral-700 dark:text-neutral-200 sm:min-w-24">
            Página {currentPage} de {totalPages}
          </span>

          <button
            type="button"
            onClick={() =>
              setCurrentPage((page) => Math.min(totalPages, page + 1))
            }
            disabled={currentPage === totalPages}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-700 dark:bg-[#101317] dark:text-neutral-200 dark:hover:bg-[#1a1f24]"
          >
            Siguiente
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
