"use client";

import { useCallback, useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { HeroSection } from "@/components/home/HeroSection";

const CATEGORY_PANEL_ID = "homepage-category-panel";

export function HomepageHeaderHero() {
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(true);
  const closeCategoryMenu = useCallback(() => {
    setCategoryMenuOpen(false);
  }, []);

  useEffect(() => {
    if (!categoryMenuOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeCategoryMenu();
      }
    };
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;

      if (!(target instanceof Element)) {
        return;
      }

      if (
        target.closest("[data-home-category-panel]") ||
        target.closest("[data-home-category-trigger]")
      ) {
        return;
      }

      closeCategoryMenu();
    };

    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [categoryMenuOpen, closeCategoryMenu]);

  return (
    <>
      <Header
        categoryMenuControlsId={CATEGORY_PANEL_ID}
        categoryMenuOpen={categoryMenuOpen}
        onCategoryMenuClose={closeCategoryMenu}
        onCategoryMenuToggle={() => setCategoryMenuOpen((value) => !value)}
      />
      <HeroSection
        categoryMenuOpen={categoryMenuOpen}
        categoryPanelId={CATEGORY_PANEL_ID}
        onCategoryNavigate={closeCategoryMenu}
      />
    </>
  );
}
