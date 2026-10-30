import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement> & { size?: number };
const base = (size = 24): SVGProps<SVGSVGElement> => ({
  width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor",
  strokeWidth: 1.4, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true,
});

export const ArrowRight = ({ size = 14, ...p }: P) => (<svg {...base(size)} {...p}><path d="M4 12h15M13 6l6 6-6 6" /></svg>);
export const External = ({ size = 13, ...p }: P) => (<svg {...base(size)} {...p}><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" /></svg>);
export const Menu = ({ size = 24, ...p }: P) => (<svg {...base(size)} {...p}><path d="M3 6h18M3 12h18M3 18h18" /></svg>);
export const Close = ({ size = 24, ...p }: P) => (<svg {...base(size)} {...p}><path d="M5 5l14 14M19 5L5 19" /></svg>);
export const Megaphone = ({ size = 34, ...p }: P) => (<svg {...base(size)} {...p}><path d="M3 10v4a1 1 0 0 0 1 1h3l6 4V5L7 9H4a1 1 0 0 0-1 1zM16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" /></svg>);
export const People = ({ size = 34, ...p }: P) => (<svg {...base(size)} {...p}><circle cx="12" cy="7.5" r="3" /><circle cx="5.5" cy="9.5" r="2.2" /><circle cx="18.5" cy="9.5" r="2.2" /><path d="M6.5 20v-2.5a5.5 5.5 0 0 1 11 0V20M1.5 19v-1.5a4 4 0 0 1 4-4M22.5 19v-1.5a4 4 0 0 0-4-4" /></svg>);
export const Book = ({ size = 34, ...p }: P) => (<svg {...base(size)} {...p}><path d="M12 6.5C10 5 7 4.5 3 5v13c4-.5 7 0 9 1.5 2-1.5 5-2 9-1.5V5c-4-.5-7 0-9 1.5zM12 6.5v13" /></svg>);
export const Shield = ({ size = 34, ...p }: P) => (<svg {...base(size)} {...p}><path d="M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6l8-3z" /><path d="M12 8l1.2 2.5 2.8.4-2 2 .5 2.7L12 14.3l-2.5 1.3.5-2.7-2-2 2.8-.4z" /></svg>);
export const Network = ({ size = 34, ...p }: P) => (<svg {...base(size)} {...p}><circle cx="12" cy="12" r="2.2" /><circle cx="12" cy="3.5" r="1.5" /><circle cx="12" cy="20.5" r="1.5" /><circle cx="4" cy="8" r="1.5" /><circle cx="20" cy="8" r="1.5" /><circle cx="4" cy="16" r="1.5" /><circle cx="20" cy="16" r="1.5" /><path d="M12 5v4.8M12 14.2V19M5.3 8.8l4.8 2.2M18.7 8.8l-4.8 2.2M5.3 15.2l4.8-2.2M18.7 15.2l-4.8-2.2" /></svg>);
export const Microscope = ({ size = 34, ...p }: P) => (<svg {...base(size)} {...p}><path d="M9 3l4 2-3 6-4-2zM8 9.5L6.5 12.5M4 21h16M7 21a6 6 0 0 1 6-9.5M14 18h-4M17 21a6 6 0 0 0-2.5-7.5" /></svg>);
export const Layers = ({ size = 34, ...p }: P) => (<svg {...base(size)} {...p}><path d="M12 3l9 4.5-9 4.5-9-4.5zM3 12l9 4.5 9-4.5M3 16.5L12 21l9-4.5" /></svg>);
export const Columns = ({ size = 34, ...p }: P) => (<svg {...base(size)} {...p}><path d="M3 9l9-5 9 5zM4 21h16M5 9v9M9.5 9v9M14.5 9v9M19 9v9M3.5 18h17" /></svg>);
export const Handshake = ({ size = 34, ...p }: P) => (<svg {...base(size)} {...p}><path d="M2 9l4-3 4 1.5L13 6l4 1.5 5 1.5M2 9v6l3 1M22 9v6l-3 1M8.5 11.5l3-2.5 6 5.5a1.2 1.2 0 0 1-1.7 1.7L13 13.5M12.5 15.5l1.8 1.8a1.2 1.2 0 0 1-1.7 1.7l-1.8-1.8M10.5 17l1 1a1.2 1.2 0 0 1-1.7 1.7L5 16" /></svg>);
export const Search = ({ size = 18, ...p }: P) => (<svg {...base(size)} {...p}><circle cx="11" cy="11" r="6.5" /><path d="M20 20l-4.3-4.3" /></svg>);

export const AREA_ICONS: Record<string, (p: P) => React.JSX.Element> = {
  microscope: Microscope, shield: Shield, people: People, layers: Layers,
  columns: Columns, handshake: Handshake, megaphone: Megaphone, book: Book, network: Network,
};
