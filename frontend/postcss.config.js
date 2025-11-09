export default {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
    // cssnano is optional - install with: npm install -D cssnano
    // Uncomment below when cssnano is installed for production optimization
    // ...(process.env.NODE_ENV === 'production' ? {
    //   cssnano: {
    //     preset: ['default', {
    //       discardComments: {
    //         removeAll: true,
    //       },
    //       normalizeWhitespace: true,
    //       colormin: true,
    //       minifyFontValues: true,
    //       minifyGradients: true,
    //       reduceTransforms: true,
    //       svgo: true,
    //     }],
    //   },
    // } : {}),
  },
}
