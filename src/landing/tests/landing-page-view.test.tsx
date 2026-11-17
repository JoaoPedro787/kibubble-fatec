import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { AppStoreProvider } from "@/shared/contexts/app-store-provider";
import { login } from "@/auth/services/auth-service";
import HomePage from "@/app/page";
import { clamp01 } from "@/landing/hooks/use-scroll-progress";
import { LandingPageView } from "@/landing/components/landing-page-view";
import { readStore } from "@/shared/libs/storage";

function mockMatchMedia(reducedMotion: boolean) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches:
        query === "(prefers-reduced-motion: reduce)" ? reducedMotion : false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

function renderLandingPage() {
  return render(
    <AppStoreProvider>
      <LandingPageView />
    </AppStoreProvider>,
  );
}

describe("LandingPageView (/)", () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.classList.remove("dark");
    Object.defineProperty(window, "scrollY", {
      writable: true,
      configurable: true,
      value: 0,
    });
    Object.defineProperty(window, "innerHeight", {
      writable: true,
      configurable: true,
      value: 800,
    });
    mockMatchMedia(false);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders customer-only header, anchors, scroll progress, and persists Light/Dark theme", async () => {
    renderLandingPage();

    const header = screen.getByRole("banner");
    expect(within(header).getByText("Ki Bubble")).toBeDefined();
    expect(
      screen.getByRole("progressbar", { name: "Progresso de leitura" }),
    ).toBeDefined();
    const desktopNav = within(header).getByRole("navigation", {
      name: "Navegação principal",
    });
    expect(
      within(desktopNav)
        .getByRole("link", { name: "Anatomia" })
        .getAttribute("href"),
    ).toBe("#anatomia");
    expect(
      within(desktopNav)
        .getByRole("link", { name: "Cardápio" })
        .getAttribute("href"),
    ).toBe("#catalogo");
    expect(
      within(desktopNav)
        .getByRole("link", { name: "Combinação" })
        .getAttribute("href"),
    ).toBe("#alquimia");

    // Verify no staff login links or employee role terminology leak onto the customer page
    const allLinks = screen.getAllByRole("link");
    for (const link of allLinks) {
      const href = link.getAttribute("href") ?? "";
      expect(href).not.toMatch(/\/(login|vendas|pedidos|estoque|relatorios)/);
    }
    expect(screen.queryByText(/Colaborador/i)).toBeNull();
    expect(screen.queryByText(/Gestor/i)).toBeNull();
    expect(screen.queryByText(/Deslogar/i)).toBeNull();

    const themeSwitch = screen.getByRole("switch", {
      name: "Alternar tema claro ou escuro",
    });
    fireEvent.click(themeSwitch);

    await waitFor(() => {
      expect(readStore(window.localStorage).theme).toBe("dark");
      expect(document.documentElement.classList.contains("dark")).toBe(true);
    });
  });

  it("applies parallax motion when enabled and disables displacements under prefers-reduced-motion", async () => {
    const { container, unmount } = renderLandingPage();

    const hero = container.querySelector("#inicio") as HTMLElement;
    expect(hero.dataset.reducedMotion).toBe("false");

    const outlineLayer = container.querySelector(
      '[data-parallax-layer="outline-type"]',
    ) as HTMLElement;
    expect(outlineLayer.style.transform).toBe("translate3d(0px, 0px, 0px)");

    await act(async () => {
      Object.defineProperty(window, "scrollY", {
        writable: true,
        configurable: true,
        value: 300,
      });
      fireEvent.scroll(window);
      fireEvent.pointerMove(window, {
        clientX: 900,
        clientY: 200,
        pointerType: "mouse",
      });
      await new Promise((resolve) => setTimeout(resolve, 60));
    });

    expect(outlineLayer.style.transform).not.toBe("translate3d(0px, 0px, 0px)");

    unmount();

    // Now test with prefers-reduced-motion: reduce
    mockMatchMedia(true);
    const reduced = renderLandingPage();

    const reducedHero = reduced.container.querySelector(
      "#inicio",
    ) as HTMLElement;
    expect(reducedHero.dataset.reducedMotion).toBe("true");

    const reducedOutline = reduced.container.querySelector(
      '[data-parallax-layer="outline-type"]',
    ) as HTMLElement;
    const reducedMarqueeTrack = reduced.container.querySelector(
      '[data-marquee-track="primary"]',
    ) as HTMLElement;

    await act(async () => {
      Object.defineProperty(window, "scrollY", {
        writable: true,
        configurable: true,
        value: 400,
      });
      fireEvent.scroll(window);
      fireEvent.pointerMove(window, {
        clientX: 900,
        clientY: 200,
        pointerType: "mouse",
      });
      await new Promise((resolve) => setTimeout(resolve, 60));
    });

    expect(reducedOutline.style.transform).toBe("translate3d(0px, 0px, 0px)");
    expect(reducedMarqueeTrack.style.transform).toBe(
      "translate3d(0px, 0px, 0px)",
    );
    expect(reducedMarqueeTrack.firstElementChild?.className).toContain(
      "flex-wrap",
    );

    // Exploded section starts in final assembled readable state under reduced motion
    const reducedAnatomia = reduced.container.querySelector(
      "#anatomia",
    ) as HTMLElement;
    expect(reducedAnatomia.dataset.progress).toBe("1.00");
    expect(reducedAnatomia.dataset.stage).toBe("04");
  });

  it("interpolates exploded cup layers on scroll and supports accessible stage selection", async () => {
    const { container } = renderLandingPage();

    const section = container.querySelector("#anatomia") as HTMLElement;
    const strawLayer = container.querySelector(
      '[data-exploded-layer="straw"]',
    ) as HTMLElement;
    const cupLayer = container.querySelector(
      '[data-exploded-layer="cup"]',
    ) as HTMLElement;

    // Initial exploded separation at 0%
    expect(section.dataset.progress).toBe("0.00");
    expect(strawLayer.style.transform).toContain("translate3d(0px, -26%, 0px)");
    expect(cupLayer.style.transform).toContain("translate3d(0px, 17%, 0px)");

    // Simulate scrolling halfway through #anatomia
    let mockTop = -600;
    vi.spyOn(section, "getBoundingClientRect").mockImplementation(
      () =>
        ({
          top: mockTop,
          bottom: mockTop + 2000,
          height: 2000,
          width: 1000,
          left: 0,
          right: 1000,
          x: 0,
          y: mockTop,
          toJSON: () => ({}),
        }) as DOMRect,
    );

    await act(async () => {
      fireEvent.scroll(window);
      await new Promise((resolve) => setTimeout(resolve, 40));
    });

    expect(section.dataset.progress).toBe("0.50");
    expect(strawLayer.style.transform).toContain("translate3d(0px, -13%, 0px)");

    // Scroll to 100% completion
    mockTop = -1200;
    await act(async () => {
      Object.defineProperty(window, "scrollY", {
        writable: true,
        configurable: true,
        value: 1200,
      });
      fireEvent.scroll(window);
      await new Promise((resolve) => setTimeout(resolve, 40));
    });

    expect(section.dataset.progress).toBe("1.00");
    expect(section.dataset.stage).toBe("04");
    expect(strawLayer.style.transform).toContain("translate3d(0px, 0%, 0px)");
    expect(cupLayer.style.transform).toContain("translate3d(0px, 0%, 0px)");

    // Clicking stage button 02 switches stage deterministically and resists minor scroll jitter
    const stage2Button = screen.getByRole("button", { name: /02.*Infusão/i });
    fireEvent.click(stage2Button);
    expect(section.dataset.stage).toBe("02");
    expect(stage2Button.getAttribute("aria-pressed")).toBe("true");

    await act(async () => {
      Object.defineProperty(window, "scrollY", {
        writable: true,
        configurable: true,
        value: 1210,
      });
      fireEvent.scroll(window);
      await new Promise((resolve) => setTimeout(resolve, 40));
    });
    expect(section.dataset.stage).toBe("02");

    // Deliberate scroll > 24px returns control to live scroll progress
    await act(async () => {
      Object.defineProperty(window, "scrollY", {
        writable: true,
        configurable: true,
        value: 1260,
      });
      fireEvent.scroll(window);
      await new Promise((resolve) => setTimeout(resolve, 40));
    });
    expect(section.dataset.stage).toBe("04");
  });

  it("filters spotlight catalog categories and updates spotlight stage on hover or click", () => {
    const { container } = renderLandingPage();

    const catalogSection = container.querySelector("#catalogo") as HTMLElement;
    const spotlightCard = catalogSection.querySelector(
      "[data-spotlight-item]",
    ) as HTMLElement;

    expect(spotlightCard.dataset.spotlightItem).toBe("prod-classic-milk");

    // Hover over Dirty Black Tea Cheese
    const dirtyItem = within(catalogSection).getByRole("button", {
      name: /Dirty Black Tea Cheese/i,
    });
    fireEvent.mouseEnter(dirtyItem);

    expect(spotlightCard.dataset.spotlightItem).toBe("prod-dirty-cheese");
    expect(within(spotlightCard).getByText("R$ 26,50")).toBeDefined();
    expect(
      within(spotlightCard).getByRole("progressbar", { name: "Cremosidade" }),
    ).toBeDefined();

    // Filter by Frutados -> automatically spotlights Mango Popping Refresh
    const frutadosBtn = within(catalogSection).getByRole("button", {
      name: "Frutados",
    });
    fireEvent.click(frutadosBtn);

    expect(spotlightCard.dataset.spotlightItem).toBe("prod-mango-pop");
    expect(
      within(catalogSection).queryByRole("button", {
        name: /Classic Brown Sugar Boba/i,
      }),
    ).toBeNull();

    // Filter by Snacks -> automatically spotlights Mochi Artesanal (2 un)
    fireEvent.click(
      within(catalogSection).getByRole("button", { name: "Snacks" }),
    );
    expect(spotlightCard.dataset.spotlightItem).toBe("prod-mochi-duo");
    expect(within(spotlightCard).getByText("R$ 16,90")).toBeDefined();
  });

  it("updates live alchemy cup layers and signature recommendation across 3 steps", () => {
    const { container } = renderLandingPage();

    const alchemySection = container.querySelector("#alquimia") as HTMLElement;
    const matchCard = alchemySection.querySelector(
      "[data-alchemy-match]",
    ) as HTMLElement;

    // Default: Assam + Tapioca + Mascavo => Classic Brown Sugar Boba
    expect(matchCard.dataset.alchemyMatch).toBe("prod-classic-milk");
    expect(
      within(matchCard).getByRole("heading", {
        name: "Classic Brown Sugar Boba",
      }),
    ).toBeDefined();

    // Step 1: Select Matcha Japonês
    fireEvent.click(
      within(alchemySection).getByRole("radio", { name: /Matcha Japonês/i }),
    );
    // Step 2: Select Popping Boba de Morango
    fireEvent.click(
      within(alchemySection).getByRole("radio", {
        name: /Popping Boba de Morango/i,
      }),
    );
    // Step 3: Select Cheese Foam Salgado
    fireEvent.click(
      within(alchemySection).getByRole("radio", {
        name: /Cheese Foam Salgado/i,
      }),
    );

    expect(matchCard.dataset.alchemyMatch).toBe("prod-matcha-latte");
    expect(
      within(matchCard).getByRole("heading", { name: "Matcha Cream Boba" }),
    ).toBeDefined();
    expect(
      alchemySection.querySelector('[data-alchemy-texture="popping"]'),
    ).not.toBeNull();
    expect(
      alchemySection.querySelector('[data-alchemy-topping="cheese-foam"]'),
    ).not.toBeNull();
    expect(
      within(matchCard).getByText("Topo: Cheese Foam Salgado"),
    ).toBeDefined();
    expect(within(matchCard).getByText("Corpo: Matcha Japonês")).toBeDefined();
    expect(
      within(matchCard).getByText("Base: Popping Boba de Morango"),
    ).toBeDefined();

    // Step 1: Switch to Frutado Tropical => Mango Popping Refresh
    fireEvent.click(
      within(alchemySection).getByRole("radio", { name: /Frutado Tropical/i }),
    );
    expect(matchCard.dataset.alchemyMatch).toBe("prod-mango-pop");
    expect(
      within(matchCard).getByRole("heading", { name: "Mango Popping Refresh" }),
    ).toBeDefined();

    // Keyboard ArrowRight inside radiogroup navigates to next option (Chá Preto Assam)
    const frutadoRadio = within(alchemySection).getByRole("radio", {
      name: /Frutado Tropical/i,
    });
    fireEvent.keyDown(frutadoRadio, { key: "ArrowRight" });
    expect(matchCard.dataset.alchemyMatch).toBe("prod-dirty-cheese");
  });

  it("handles edge cases: reading progress updates on scroll, authenticated visitors stay on /, and clamp01 bounds invalid inputs", async () => {
    expect(clamp01(Number.NaN)).toBe(0);
    expect(clamp01(Number.POSITIVE_INFINITY)).toBe(0);
    expect(clamp01(-0.25)).toBe(0);
    expect(clamp01(1.4)).toBe(1);
    expect(clamp01(0.42)).toBe(0.42);

    // Even with an active Gestor session, / renders HomePage without staff controls
    login("Gestor", window.localStorage);
    vi.spyOn(document.documentElement, "scrollHeight", "get").mockReturnValue(
      2800,
    );

    render(
      <AppStoreProvider>
        <HomePage />
      </AppStoreProvider>,
    );

    expect(screen.queryByText(/Colaborador/i)).toBeNull();
    expect(screen.queryByText(/Gestor/i)).toBeNull();

    await act(async () => {
      Object.defineProperty(window, "scrollY", {
        writable: true,
        configurable: true,
        value: 1000,
      });
      fireEvent.scroll(window);
      await new Promise((resolve) => setTimeout(resolve, 40));
    });

    const readingBar = screen.getByRole("progressbar", {
      name: "Progresso de leitura",
    });
    expect(readingBar.getAttribute("aria-valuenow")).toBe("50");
  });
});
