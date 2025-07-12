export function getBreadcrumbs(
  pathname: string,
): { title: string; href: string }[] {
  const parts = pathname.split("/").filter(Boolean);
  const breadcrumbs: { title: string; href: string }[] = [];
  let currentHref = "";

  parts.forEach((part, index) => {
    currentHref += `/${part}`;
    const title = part.charAt(0).toUpperCase() + part.slice(1);
    breadcrumbs.push({ title, href: currentHref });
  });

  return breadcrumbs;
}
