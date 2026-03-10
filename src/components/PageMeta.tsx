import { Helmet } from "react-helmet-async";

const SITE_NAME = "CARPI";
const BASE_URL = "http://carpi.cs.rpi.edu";
const OG_IMAGE = `${BASE_URL}/carpi-black.png`;

const PAGE_META = {
  "/": {
    title: "Course Planner",
    description:
      "Plan your RPI courses with CARPI — browse the course catalog and build your semester schedule.",
  },
  "/catalog": {
    title: "Course Catalog",
    description:
      "Search and browse RPI courses by name, subject, or credit hours.",
  },
  "/planner": {
    title: "My Planner",
    description:
      "Build and manage your RPI semester plan — add courses, organize semesters, and track your progress.",
  },
} as const;

type PagePath = keyof typeof PAGE_META;

export default function PageMeta({ path }: { path: PagePath }) {
  const { title: pageTitle, description } = PAGE_META[path];
  const fullTitle = `${pageTitle} | ${SITE_NAME}`;
  const url = `${BASE_URL}${path}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={OG_IMAGE} />
      <meta property="og:site_name" content={SITE_NAME} />
    </Helmet>
  );
}
