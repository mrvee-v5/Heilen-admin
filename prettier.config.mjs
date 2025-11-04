/** @type {import('prettier').Config} */
const tailwindPlugin = await import('prettier-plugin-tailwindcss')

export default {
  singleQuote: true,
  semi: false,
  tabWidth: 2,
  trailingComma: 'es5',
  plugins: [tailwindPlugin],
}
