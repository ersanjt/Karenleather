import { useState } from "react";
import { allProducts } from "../data";
import { slugMatches, type ShopCategoryGroup } from "../lib/shop";

interface Props {
  groups: ShopCategoryGroup[];
  activeSlug: string;
  onSelect: (slug: string | null) => void;
  compact?: boolean;
}

export function ShopSidebar({ groups, activeSlug, onSelect, compact }: Props) {
  const [openGroups, setOpenGroups] = useState<Record<number, boolean>>(() => {
    const initial: Record<number, boolean> = {};
    for (const group of groups) {
      const isActive =
        slugMatches(activeSlug, group.slug) ||
        group.children.some(
          (c) =>
            slugMatches(activeSlug, c.slug) ||
            c.children.some((l) => slugMatches(activeSlug, l.slug)),
        );
      initial[group.id] = isActive || group.id !== 40;
    }
    return initial;
  });

  const toggleGroup = (id: number) => {
    setOpenGroups((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <aside className={`shop-sidebar ${compact ? "compact" : ""}`}>
      <div className="shop-sidebar-head">
        <h3>دسته‌بندی</h3>
        {activeSlug && (
          <button type="button" className="shop-sidebar-clear" onClick={() => onSelect(null)}>
            پاک کردن
          </button>
        )}
      </div>

      <button
        type="button"
        className={`shop-cat-row shop-cat-root ${!activeSlug ? "active" : ""}`}
        onClick={() => onSelect(null)}
      >
        <span>همه محصولات</span>
        <span className="shop-cat-count">{allProducts.length.toLocaleString("fa-IR")}</span>
      </button>

      {groups.map((group) => {
        const groupActive =
          slugMatches(activeSlug, group.slug) ||
          group.children.some(
            (c) =>
              slugMatches(activeSlug, c.slug) ||
              c.children.some((l) => slugMatches(activeSlug, l.slug)),
          );

        return (
          <div key={group.id} className={`shop-cat-group ${groupActive ? "is-active" : ""}`}>
            <button
              type="button"
              className="shop-cat-group-toggle"
              aria-expanded={openGroups[group.id]}
              onClick={() => toggleGroup(group.id)}
            >
              <span>{group.title}</span>
              <span className="shop-cat-meta">
                <span className="shop-cat-count">{group.total.toLocaleString("fa-IR")}</span>
                <span className="shop-cat-chevron" aria-hidden>
                  {openGroups[group.id] ? "−" : "+"}
                </span>
              </span>
            </button>

            {openGroups[group.id] && (
              <div className="shop-cat-group-body">
                <button
                  type="button"
                  className={`shop-cat-row ${slugMatches(activeSlug, group.slug) ? "active" : ""}`}
                  onClick={() => onSelect(group.slug)}
                >
                  <span>همه {group.title}</span>
                </button>

                {group.children.map((section) => (
                  <div key={section.id} className="shop-cat-section">
                    <button
                      type="button"
                      className={`shop-cat-row shop-cat-section-title ${
                        slugMatches(activeSlug, section.slug) ? "active" : ""
                      }`}
                      onClick={() => onSelect(section.slug)}
                    >
                      <span>{section.name}</span>
                      <span className="shop-cat-count">{section.count.toLocaleString("fa-IR")}</span>
                    </button>

                    {section.children.length > 0 && (
                      <ul className="shop-cat-leaves">
                        {section.children.map((leaf) => (
                          <li key={leaf.id}>
                            <button
                              type="button"
                              className={slugMatches(activeSlug, leaf.slug) ? "active" : ""}
                              onClick={() => onSelect(leaf.slug)}
                            >
                              {leaf.name}
                              <span>{leaf.count.toLocaleString("fa-IR")}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </aside>
  );
}
