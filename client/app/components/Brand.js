import Image from "next/image";

export function NepalFlag({ label = "नेपालको झण्डा" }) {
  return (
    <Image
      className="nepal-flag"
      src="/nepal-flag.png"
      alt={label}
      width={405}
      height={493}
    />
  );
}

export function NationalEmblem({ label = "नेपालको राष्ट्रिय चिन्ह" }) {
  return (
    <Image
      className="national-emblem"
      src="/nepal-emblem.png"
      alt={label}
      width={909}
      height={768}
    />
  );
}
