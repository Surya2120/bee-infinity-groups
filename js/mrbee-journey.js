/* A small, deterministic guide: every destination is an existing company page. */
export const nodes = {
  start: {
    title: "What would you like to explore?",
    text: "Psst… I’m earning my Chief Buzz Officer badge. Don’t tell the founders.",
    choices: [
      { label: "Film & media", next: "film" },
      { label: "Dance", next: "dance" },
      { label: "Events", next: "events" },
      { label: "School celebrations", next: "school" },
      { label: "Something else", next: "more" }
    ]
  },
  film: {
    title: "What’s your next scene?",
    text: "Making a film, polishing a story, or having a look around?",
    choices: [
      { label: "Film production", href: "bigcinemaz.html#film-production" },
      { label: "Editing & post-production", href: "bigcinemaz.html#post-production" },
      { label: "Dubbing & sound", href: "bigcinemaz.html#dubbing-sound" },
      { label: "Explore B.I.G Cinemaz", href: "bigcinemaz.html" },
      { label: "Discuss my film project", href: "contact.html#contact-form" }
    ]
  },
  dance: {
    title: "Ready to find your rhythm?",
    text: "My signature move is hovering. Yours can be much better.",
    choices: [
      { label: "Dance classes & training", href: "divisions.html#dance" },
      { label: "Choreography & performance", href: "ourservices.html#dance-services" },
      { label: "Browse performance photos", href: "gallery.html" },
      { label: "Ask about dance", href: "contact.html#contact-form" }
    ]
  },
  events: {
    title: "Let’s find your kind of celebration.",
    text: "A big occasion or a school milestone?",
    choices: [
      { label: "Celebrations & live events", href: "divisions.html#events" },
      { label: "Explore event services", href: "ourservices.html#event-services" },
      { label: "A school celebration", next: "school" },
      { label: "Discuss my event", href: "contact.html#contact-form" }
    ]
  },
  school: {
    title: "A whole school year of possibilities.",
    text: "Let’s explore Spectrum. I may have made a grand entrance there.",
    choices: [
      { label: "Discover Spectrum", href: "spectrum.html" },
      { label: "School event services", href: "spectrum.html#spectrum-stagecraft" },
      { label: "Weekly dance classes", href: "spectrum.html#spectrum-extras" },
      { label: "Request a school proposal", href: "contact.html#contact-form" }
    ]
  },
  more: {
    title: "There’s more in this hive.",
    text: "Where shall we land next?",
    choices: [
      { label: "The company & team", next: "people" },
      { label: "Our gallery", href: "gallery.html" },
      { label: "Careers & internships", href: "careers.html" },
      { label: "Our merch", href: "merch/" },
      { label: "BOTD announcements", href: "AnnouncingSoon.html" },
      { label: "Contact the team", href: "contact.html#contact-form" }
    ]
  },
  people: {
    title: "The humans behind the buzz.",
    text: "They do the real work. I’m here for the memorable entrance.",
    choices: [
      { label: "Our story & founders", href: "about.html" },
      { label: "Meet our team", href: "about.html#team" },
      { label: "Explore our divisions", href: "divisions.html" },
      { label: "Talk to the team", href: "contact.html#contact-form" }
    ]
  }
};
