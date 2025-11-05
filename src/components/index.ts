/**
 * Этот файл оставлен пустым.
 *
 * Библиотека НЕ предоставляет единый barrel‑export, собирающий все компоненты.
 * Это решение описано в README:
 * - Принудительный tree‑shaking требует импортировать каждый компонент отдельно.
 * - Импорт всей библиотеки приводит к увеличению bundle‑size, так как включаются
 *   неиспользуемые компоненты и их CSS.
 * - CSS‑дедупликация работает на уровне отдельного компонента, а side‑effect
 *   импорты добавляются автоматически при сборке.
 *
 * This file is intentionally left empty.
 *
 * The library does **not** provide a single barrel export that aggregates all components.
 * This design decision is documented in the README:
 * - The library enforces **forced tree‑shaking** by requiring each component to be imported.
 * - Importing the whole library would prevent optimal bundle size because unused components
 *   and their CSS would be included.
 * - CSS deduplication works per component, and side‑effect imports are added automatically
 *   during the build.
 *
 * Each component therefore has its own `index.ts` that re‑exports the component and its types
 * (e.g., `src/components/Button/index.ts`, `src/components/Tabs/index.ts`).
 * When adding new components, create an `index.ts` inside the component folder and import
 * the component directly from that path, rather than via a central `src/components/index.ts`.
 */
