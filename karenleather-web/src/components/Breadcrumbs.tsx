import { Link } from "react-router-dom";

export interface BreadcrumbItem {
  label: string;
  to?: string;
}

interface Props {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className = "" }: Props) {
  if (items.length === 0) return null;

  return (
    <nav className={`breadcrumbs ${className}`.trim()} aria-label="مسیر صفحه">
      <ol>
        {items.map((item, i) => (
          <li key={`${item.label}-${i}`}>
            {item.to && i < items.length - 1 ? (
              <Link to={item.to}>{item.label}</Link>
            ) : (
              <span aria-current={i === items.length - 1 ? "page" : undefined}>{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
