// Oracle values owned by the immersive scene: its full-width content-pane
// expectation, its own responsive viewport list (independent copy of the
// same boundary widths functional uses, so this module never imports from
// the functional oracle), and its CSS custom-property contract covering
// the core palette, tier mappings, and multi-asset colors.
export const desktop = { content: 1440 };
export const boundaries = [499, 500, 1079, 1080, 1271, 1272, 1439, 1440, 1919, 1920];
export const immersivePalette = {
  '--color-white': '#ffffff', '--color-text-primary': '#000000d9', '--color-text-secondary': '#000000a6', '--color-text-on-color': '#ffffff', '--color-text-on-brand': '#000000d9', '--color-border-subtle': '#0000000d', '--color-border-strong': '#01172b', '--color-focus': '#6968ef', '--color-background-primary': '#ffffff', '--color-background-secondary': '#f2f2f2', '--color-button-primary': '#01172b', '--color-button-primary-hover': '#1a2e40', '--color-button-primary-active': '#344555', '--color-button-highlight': '#f2f93c', '--color-button-highlight-hover': '#f4fa59', '--color-button-highlight-active': '#f5fb6d',
  '--palette-yellow-25': '#fcfece', '--palette-yellow-50': '#f9fc9e', '--palette-yellow-75': '#f5fb6d', '--palette-yellow-100': '#f2f93c',
  '--palette-navy-25': '#c0c5ca', '--palette-navy-50': '#808b95', '--palette-navy-75': '#415160', '--palette-navy-100': '#01172b',
  '--palette-light-grey-25': '#e9eff2', '--palette-light-grey-50': '#d3dfe6', '--palette-light-grey-75': '#bccfd9', '--palette-light-grey-100': '#a6bfcc',
  '--asset-cryptocurrency': '#8f0606', '--asset-crowdfunding': '#d60808', '--asset-p2p-lending': '#ba4a0a', '--asset-thai-equity': '#1211ad', '--asset-equity': '#aa46c3', '--asset-mutual-fund': '#01172b', '--asset-gold': '#f1f92d', '--asset-tax-saving': '#50cfff', '--asset-esavings': '#40ed90', '--asset-cash': '#007435',
  '--tier-finno-club': '#ffffff', '--tier-finno-exclusive': '#f2f93c', '--tier-finno-private': '#a6bfcc', '--tier-finno-ultra': '#01172b',
};
