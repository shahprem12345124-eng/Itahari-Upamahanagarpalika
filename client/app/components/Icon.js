const paths = {
  home: "M3 10.5 12 3l9 7.5V21h-6v-6H9v6H3z",
  news: "M4 4h16v16H4z M8 8h8M8 12h8M8 16h5",
  info: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Zm0-14v.1M12 11v5",
  form: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6M8 13h8M8 17h5",
  admin: "M12 3 4 6v5c0 5 3.4 8.7 8 10 4.6-1.3 8-5 8-10V6zm-3 9 2 2 4-4",
  menu: "M4 6h16M4 12h16M4 18h16",
  close: "m6 6 12 12M18 6 6 18",
  sun: "M12 3v2m0 14v2M3 12h2m14 0h2M5.6 5.6 7 7m10 10 1.4 1.4m0-12.8L17 7M7 17l-1.4 1.4M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z",
  moon: "M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5 8.5 8.5 0 1 0 20.5 14.2Z",
  phone: "M22 16.9v3a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 3.1 5.2 2 2 0 0 1 5.1 3h3a2 2 0 0 1 2 1.7l.5 2.8a2 2 0 0 1-.6 1.7l-1.3 1.3a16 16 0 0 0 5.8 5.8l1.3-1.3a2 2 0 0 1 1.7-.6l2.8.5a2 2 0 0 1 1.7 2Z",
  send: "m22 2-7 20-4-9-9-4Zm0 0L11 13",
  arrow: "M5 12h14m-7-7 7 7-7 7",
  check: "m5 12 4 4L19 6",
  chevron: "m9 18 6-6-6-6",
  upload: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4m4-5 5-5 5 5m-5-5v12",
  image: "M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm4 5h.01M22 15l-5-5L5 20",
  search: "m21 21-4.3-4.3M19 10.5a8.5 8.5 0 1 1-17 0 8.5 8.5 0 0 1 17 0Z",
  edit: "M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z",
  trash: "M3 6h18m-2 0-.9 14H5.9L5 6m4 0V4h6v2m-5 4v7m4-7v7",
  eye: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Zm10 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
  clock: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Zm0-16v6l4 2",
  users: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m7-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm13 10v-2a4 4 0 0 0-3-3.9m-1-12a4 4 0 0 1 0 7.8",
  building: "M3 21h18M5 21V7l7-4 7 4v14M9 10h.01M15 10h.01M9 14h.01M15 14h.01M10 21v-4h4v4",
  heart: "M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z",
};

export default function Icon({ name, size = 20, className = "" }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={paths[name] || paths.info} />
    </svg>
  );
}
