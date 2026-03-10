import { Helmet } from "react-helmet-async";

const BASE_URL = "http://carpi.cs.rpi.edu";
const OG_IMAGE = `${BASE_URL}/carpi-black.png`;

interface PageMetaProps {
  title: string;
  description: string;
  path: string;
}

export default function PageMeta({ title, description, path }: PageMetaProps) {
  const url = `${BASE_URL}${path}`;
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={OG_IMAGE} />
    </Helmet>
  );
}
