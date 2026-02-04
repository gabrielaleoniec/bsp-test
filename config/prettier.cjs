module.exports = {
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  importOrder: [
    '^(react/(.*)$)|^(react$)', // Imports by "react"
    '^(react-redux/(.*)$)|^(react-redux$)', // Imports by "react-redux"
    '^(next/(.*)$)|^(next$)', // Imports by "next"
    '<THIRD_PARTY_MODULES>',
    '^constants/(.*)$',
    '^types/(.*)$',
    '^"@blocks/(.*)$',
    '^"@pages/(.*)$',
    '^components/(.*)$',
    '^business/(.*)$',
    '^utilities/(.*)$',
    '^[./]', // Other imports
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  plugins: ['@trivago/prettier-plugin-sort-imports'],
}