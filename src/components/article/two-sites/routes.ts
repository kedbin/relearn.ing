/** Stations are landmarks, not keystroke counts. Sources identify the actual revision or live route. */
interface Stop { title: string; detail: string }
interface Way { name: string; tag: string; stops: Stop[] }
export interface Route {
  summary: string; stops: Stop[]; fork?: Way[];
  source: { label: string; href: string };
}
interface Lane { site: string; href: string; task: string; july: Route; now: Route }

export const LANES: Lane[] = [
  {
    site: 'binasoy.kim', href: 'https://binasoy.kim/', task: 'Get the résumé PDF',
    july: {
      summary: 'The document is on the front page.',
      stops: [
        { title: 'Open the portfolio', detail: 'One scrolling page, with an animated orbit beside the name.' },
        { title: 'Open “Download Résumé”', detail: 'The hero and the header both link to the PDF.' },
      ],
      source: { label: 'July portfolio HTML', href: 'https://github.com/kedbin/binasoy.kim/blob/b0eabb3/src/index.html' },
    },
    now: {
      summary: 'Two invitations when the welcome card appears; a direct reader otherwise.',
      stops: [{ title: 'Open the portfolio', detail: 'On a fresh, 3D-capable visit with motion allowed, the card offers the van or the scenic route.' }],
      fork: [
        { name: 'Hop in the van', tag: 'Card · 3D', stops: [
          { title: 'Visit Résumé at the camp', detail: 'Go inside the van. Choose the clipboard (or press 4), then “Download résumé (PDF)”.' },
        ] },
        { name: 'Take the scenic route', tag: 'Card · 2D', stops: [
          { title: 'Open the reader’s Résumé link', detail: 'The illustrated road trip keeps the profile links.' },
        ] },
        { name: 'Plain reader', tag: 'Bypass · no card', stops: [
          { title: 'Open the same Résumé link', detail: 'Use the direct reader, or arrive without JavaScript. No scene to enter.' },
        ] },
      ],
      source: { label: 'Try the plain reader', href: 'https://binasoy.kim/?reader' },
    },
  },
  {
    site: 'relearn.ing', href: 'https://relearn.ing/', task: 'Find the eight-second deploy story (№ 027)',
    july: {
      summary: 'Search lived on the Journal page.',
      stops: [
        { title: 'Open Journal from the home page', detail: 'Follow the header link to the archive.' },
        { title: 'Search for “deploy”', detail: 'The search box filters the entries after the Journal island loads.' },
        { title: 'Open “The Binary Asymptote…”', detail: 'The summary mentions the move to R2 and the eight-second deploy.' },
      ],
      source: { label: 'July journal search', href: 'https://github.com/kedbin/relearn.ing/blob/a750196/src/components/JournalList.tsx' },
    },
    now: {
      summary: 'Use a number you know or a description you recognise.',
      stops: [{ title: 'Start on the home page', detail: 'Both routes below work here. The search shortcut also works elsewhere on the site.' }],
      fork: [
        { name: 'By number', tag: 'Site search', stops: [
          { title: 'Open search and type 27', detail: 'Press / or use the search button. Once results appear, open the first one.' },
        ] },
        { name: 'By subject', tag: 'Home · Start here', stops: [
          { title: 'Open “The eight-second deploy”', detail: 'Its description names the audio move to R2. No search or JavaScript needed.' },
        ] },
      ],
      source: { label: 'Home-page picks', href: 'https://github.com/kedbin/relearn.ing/blob/93b876e/src/data/curation.ts' },
    },
  },
];
