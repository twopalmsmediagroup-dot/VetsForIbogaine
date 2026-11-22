import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement> & { size?: number };
const base = (size = 18): SVGProps<SVGSVGElement> => ({
  width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor",
  strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true,
});
const icon = (d: string) => function Icon({ size, ...p }: P) { return <svg {...base(size)} {...p}><path d={d} /></svg>; };

export const IHome = icon("M3 11l9-7 9 7M5 10v10h5v-6h4v6h5V10");
export const INews = icon("M4 5h13v14H6a2 2 0 0 1-2-2zM17 9h3v8a2 2 0 0 1-2 2M8 9h5M8 13h5M8 17h3");
export const IBook = icon("M12 6.5C10 5 7 4.5 3 5v13c4-.5 7 0 9 1.5 2-1.5 5-2 9-1.5V5c-4-.5-7 0-9 1.5zM12 6.5v13");
export const IBuilding = icon("M4 21V7l8-4 8 4v14M9 21v-5h6v5M8 10h.01M12 10h.01M16 10h.01M8 13h.01M12 13h.01M16 13h.01M2 21h20");
export const IQuote = icon("M7 7h4v4c0 3-1.5 5-4 6M15 7h4v4c0 3-1.5 5-4 6");
export const IClock = icon("M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z");
export const IPage = icon("M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h6");
export const ISliders = icon("M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0M14 4v4M8 10v4M16 16v4");
export const IInbox = icon("M3 13l3-8h12l3 8v6H3zM3 13h5l1 2h6l1-2h5");
export const IUsers = icon("M16 19v-1a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v1M9.5 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM21 19v-1a4 4 0 0 0-3-3.9M15 4.1a3 3 0 0 1 0 5.8");
export const IUser = icon("M20 21v-1a5 5 0 0 0-5-5H9a5 5 0 0 0-5 5v1M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z");
export const IPlus = icon("M12 5v14M5 12h14");
export const IExternal = icon("M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5");
export const IArrow = icon("M5 12h14M13 6l6 6-6 6");
export const ICheck = icon("M5 12.5l4.5 4.5L19 7.5");
export const IPencil = icon("M4 20h4L19 9l-4-4L4 16zM14 6l4 4");
export const IMail = icon("M3 6h18v12H3zM3 7l9 6 9-6");
export const ISearch = icon("M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-4-4");
export const ISpark = icon("M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6");
export const ILogout = icon("M15 4h4v16h-4M10 8l-4 4 4 4M6 12h10");

/** Icon per content type key in lib/admin/entities.ts. */
export const ENTITY_ICONS: Record<string, (p: P) => React.JSX.Element> = {
  articles: INews, resources: IBook, organizations: IBuilding, stories: IQuote, timeline: IClock, pages: IPage,
};
