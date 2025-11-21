# JUNGLEBET.COM FRONTEND

## 🔅 BASE REQUIREMENTS
- NodeJS v18.0+
- Yarn v3+
- Nuxt v3.x+

## 🔅 DEPENDENCIES

### Storybook.js
Storybook streamlines the UI development process by allowing for isolated development of individual components. It provides better visualization and collaboration, making it easier for teams to work together and create a better end product.
[learn more](https://storybook.js.org/docs/vue/get-started/introduction).

### Tailwind CSS
Tailwind CSS is a highly effective utility-first CSS framework that greatly enhances the styling of a Nuxt project. Its approach of scanning HTML, JavaScript components, and templates for class names, generating styles, and writing them to a CSS file results in fast, flexible, and reliable styles. Tailwind's zero-runtime feature further adds to its performance, making it a valuable addition to a Nuxt project looking to achieve high-quality and optimized styling.
[learn more](https://tailwindcss.com).

### Nuxt UI
Nuxt UI is based on Headless UI and is specifically for use with Nuxt3. It enhances the development workflow by providing developers with reusable UI elements and components. With Nuxt UI, developers can efficiently create responsive, modern, and interactive user interfaces in their Nuxt3 applications, promoting faster development without compromising on performance, SEO, or usability.
[learn more](https://ui.nuxt.com/).

### Sass
Using SCSS to write Tailwind CSS @apply can be a good option if you need to add custom styling not available in Tailwind.
[learn more](https://sass-lang.com/).

### TypeScript
TypeScript enhances the JavaScript language by adding optional static typing and other features, making the code more readable and maintainable. With TypeScript, developers can catch errors early in the development process, reducing the likelihood of bugs in the production environment and ensuring high-quality, bug-free code.
[learn more](https://www.typescriptlang.org/).

## Custom Apollo Client
Client for Graphql queries - customized to work with Lighthouse GraphQL server

### Vitest
Vitest is a fast and efficient unit testing framework for modern web projects, fully compatible with Jest. It enhances the development experience by speeding up the testing process and catching bugs early on, ensuring that your code is stable and reliable.
[learn more](https://vitest.dev/).

### Other
[Vite-SVG-Loader](https://github.com/jpkleemans/vite-svg-loader), vitest-ui, vitest/coverage-c8, storybook-dark-mode, sass-loader, postcss, storybook addon-a11y, storybook/addon-essentials, storybook/addon-postcss, storybook/builder-vite, storybook/vue3, sass-loader

## 🔅 USING THIS REPO

1. Clone or download this repository
2. Copy .env.local to .env `cp .env.local .env`
3. Run `yarn` or `yarn install` to install dependencies
4. Run `yarn dev` to start the local development environment

## 🔅 ADDITIONAL NOTES

- Must build with the 'NITRO_PRESET=cloudflare_pages' flag for Cloudflare Pages deployment

## 🔅 LICENSING

Unauthorized use, copying, distribution, modification, public display, or public performance of this codebase is strictly prohibited. Violators will be subject to appropriate legal action under intellectual property rights laws.
