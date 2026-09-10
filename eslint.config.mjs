import nextConfig from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

const eslintConfig = [
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'out/**',
      'coverage/**',
      'contracts/**',
      'scripts/**',
    ],
  },
  ...nextConfig,
  ...nextTs,
]

export default eslintConfig
