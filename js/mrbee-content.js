/* Founder jokes and bee stories are fictional mascot banter, never team quotes.
   Company facts are kept in their own category and grounded in the site copy. */
export const banter = {
  secrets: {
    label: "Little secrets",
    lines: [
      "Psst… don’t tell the founders: my serious meeting face is just my normal face.",
      "Secret: I hid honey beside the storyboards. The plot has thickened.",
      "Don’t tell Surya: I rehearsed my entrance more than the dancers.",
      "Between us, Bharathi hasn’t approved my executive honey jar.",
      "I have a secret shortcut to the founders: mention a creative idea.",
      "Confidential: my corner office is literally this corner.",
      "Don’t tell the founders: I’ve been taking applause meant for the team.",
      "Little secret: I practise my dramatic reveal behind the loading screen."
    ]
  },
  founders: {
    label: "Founder fun",
    lines: [
      "The founders’ weakness? A good idea. Mine? A very small honey jar.",
      "Surya says one last idea. My antennae know there’s a sequel.",
      "Bharathi keeps things moving. I keep asking whether flying counts as attendance.",
      "The founders see a blank stage. I see an excellent landing spot.",
      "Our founders love a creative challenge. I’m their smallest one.",
      "Surya’s idea of a cliffhanger? One more thought before we wrap.",
      "The founders brought the vision. I brought stripes to the meeting.",
      "Don’t tell the founders: I’ve awarded myself Employee of the Flower."
    ]
  },
  scolded: {
    label: "I got told off",
    lines: [
      "Got told off for putting my badge before the company logo.",
      "The founders said make an entrance. Apparently, through the window was too literal.",
      "I called buzzing a soundcheck. The studio team disagreed.",
      "Surya asked for a close-up. I landed on the lens. Too close.",
      "Bharathi said stay on the page. I was already in the margins.",
      "The founders asked for less drama. I delivered a tiny dramatic sigh.",
      "I tried signing the call sheet with honey. Apparently, that’s not a signature.",
      "Got told off for shouting action during a dance rehearsal."
    ]
  },
  bee: {
    label: "Bee life",
    lines: [
      "My dance count is five, six, seven… wings.",
      "I auditioned for a close-up. The camera needed a magnifying glass.",
      "My wings do surround sound. The sound team calls it a first draft.",
      "I’m camera-ready. Every stripe has been personally arranged.",
      "I promised not to photobomb. Nobody mentioned video.",
      "Stage fright? Only when someone mistakes me for a spotlight moth.",
      "My backstage pass is tiny. My entrance is unnecessarily grand.",
      "I tried clapping for the crew. Six legs made it complicated."
    ]
  },
  company: {
    label: "Company facts",
    lines: [
      "Bee Infinity Groups brings together film production, event management and dance choreography.",
      "Surya Sharavana is our founder; Bharathi M is our co-founder.",
      "Our multi-division vision took shape during the 2020 lockdown.",
      "Bee Infinity Groups formed in 2022, with Bharathi as co-founder.",
      "Our in-house dubbing studio was built from the ground up in 2023.",
      "B.I.G Cinemaz is the film division of Bee Infinity Groups.",
      "Our film services include production, post-production, dubbing and sound design.",
      "Bee Infinity Events works on creative event concepts, design and execution.",
      "Bee Infinity Dance Crew offers dance training and school or college choreography.",
      "SPECTRUM is Bee Infinity Groups’ annual school event partnership.",
      "SPECTRUM can support Annual Day, Sports Day and other school celebrations.",
      "SPECTRUM includes complimentary weekly dance classes on an agreed schedule.",
      "Complimentary parent testimonial videos under SPECTRUM require consent and school approval."
    ]
  }
};

// Keep the existing joke API, alternating themes so quick jokes feel varied.
const jokeCategories = ["secrets", "founders", "scolded", "bee"].map(key => banter[key].lines);
export const jokes = Array.from(
  { length: Math.max(...jokeCategories.map(lines => lines.length)) },
  (_, index) => jokeCategories.map(lines => lines[index]).filter(Boolean)
).flat();

export const pages = {
  home: {
    title: "A good place to begin.",
    intro: "Hi, I’m Mr. Bee! Looking for a film, an event, or a little more rhythm? I’ll help you find your way around Bee Infinity Groups.",
    tips: [
      "The Divisions page is a good starting point for film, events and dance. Different talents, one creative team.",
      "The gallery has the pictures. About has the people. I recommend a little of both.",
      "Planning something for a school? Spectrum brings together our school celebration services. I’ve even dressed up the page for you."
    ],
    links: [{ label: "Explore our divisions", href: "divisions.html" }, { label: "Meet the team", href: "about.html#team" }, { label: "Plan a project", href: "contact.html#contact-form" }]
  },
  about: {
    title: "Meet the people behind the possibilities.",
    intro: "This is the people part of the story: our journey, leadership and team. I bring the wings; they bring the work.",
    tips: [
      "Surya Sharavana is our founder, and Bharathi M is our co-founder. Keep exploring to meet more of the people behind Bee Infinity Groups.",
      "Meet Navya, our Dance Instructor, alongside the people who bring Bee Infinity Groups’ work to life in the team section.",
      "Have something you’d like to create with the team? The contact page is the next stop. I’ll leave the actual conversation to the humans."
    ],
    links: [{ label: "Meet our team", href: "about.html#team" }, { label: "Explore our work", href: "gallery.html" }, { label: "Talk to the team", href: "contact.html#contact-form" }]
  },
  divisions: {
    title: "Find your creative direction.",
    intro: "Film, events, dance and school celebrations. Pick the part of Bee Infinity Groups that fits your idea. I’m a fan of all four. Occupational hazard.",
    tips: [
      "Open a division to explore its services and photos. You can take a closer look without leaving this page.",
      "School celebrations have their own world in Spectrum. For film and media, head to B.I.G Cinemaz.",
      "Your project can start with a simple idea. Tell the team what you have in mind, and they can discuss the right services with you."
    ],
    links: [{ label: "Explore Spectrum", href: "spectrum.html" }, { label: "Film & media", href: "bigcinemaz.html" }, { label: "Discuss an idea", href: "contact.html#contact-form" }]
  },
  services: {
    title: "The right craft for your idea.",
    intro: "Have a look through the services, then tell the team what you’re planning. A little detail now helps the conversation get off to a flying start.",
    tips: [
      "Describe your occasion or project, your location and any timing you have in mind. The team can then discuss what fits.",
      "If a few different services catch your eye, mention them together in your enquiry. Good ideas don’t always fit into one box.",
      "Want to see the creative work first? The gallery is just a small buzz away."
    ],
    links: [{ label: "See the gallery", href: "gallery.html" }, { label: "Explore divisions", href: "divisions.html" }, { label: "Discuss your project", href: "contact.html#contact-form" }]
  },
  gallery: {
    title: "I’ll let the pictures do the talking.",
    intro: "A glimpse of the films, performances and celebrations in our creative world. Take your time. I’ll try not to photobomb.",
    tips: [
      "Use the gallery categories to find the kind of work you’re interested in, then open a photo for a closer look.",
      "When a photo is open, the arrows let you browse. Escape brings you back to the gallery.",
      "See a style or moment that catches your eye? Mention it when you speak with the team about your own project."
    ],
    links: [{ label: "Explore services", href: "ourservices.html" }, { label: "Meet the people", href: "about.html#team" }, { label: "Share your idea", href: "contact.html#contact-form" }]
  },
  spectrum: {
    title: "A whole school year of possibility.",
    intro: "Welcome to my colourful corner of the website. Explore school celebrations, event services, dance classes and the moments worth remembering.",
    tips: [
      "The numbered buttons take you through Spectrum’s chapters. Prefer a calmer visit? Use the Motion control at the bottom.",
      "Annual Day, Sports Day, national celebrations and school milestones can all be part of the conversation. Your proposal is tailored to the agreed services.",
      "For a school enquiry, share your school name, location, academic year and planned events. The team can discuss a proposal with you.",
      "Weekly dance classes follow an agreed schedule. Parent testimonial videos need consent and school approval. The team can explain the details."
    ],
    links: [{ label: "School celebrations", href: "spectrum.html#spectrum-calendar" }, { label: "Explore the services", href: "spectrum.html#spectrum-stagecraft" }, { label: "Request a proposal", href: "contact.html#contact-form" }]
  },
  contact: {
    title: "Your idea deserves the humans.",
    intro: "Tell the team what you’re planning using the contact form. I can point the way, but they’re the people who can discuss your project properly.",
    tips: [
      "A useful message includes the service you need, your location and any dates you have in mind. A short introduction is a lovely start.",
      "For Spectrum, include your school name, academic year and the celebrations you’re considering.",
      "Take your time with the form. I’ll stay quiet while you write. Even a bee can respect a good draft."
    ],
    links: [{ label: "Explore services", href: "ourservices.html" }, { label: "School celebrations", href: "spectrum.html" }]
  },
  careers: {
    title: "A place for your kind of creativity.",
    intro: "Explore the roles and internships listed on this page. If one feels like your kind of work, open its application to see what’s needed.",
    tips: [
      "Choose the role that fits your experience and interests, then use its Apply button. I’m cheering for the humans with good ideas.",
      "When applying, share relevant experience or work samples where the form asks for them. Let your work help introduce you.",
      "You can explore the About page to meet the company before sending an application. A good introduction works both ways."
    ],
    links: [{ label: "About the company", href: "about.html" }, { label: "See our creative work", href: "gallery.html" }, { label: "Contact the team", href: "contact.html#contact-form" }]
  },
  apply: {
    title: "Your application, in your own words.",
    intro: "Check the role shown in the form, then tell the team about your experience. I’ll leave you plenty of room to concentrate.",
    tips: [
      "Check your contact details and the selected job role before sending the application.",
      "Use the message field for a clear introduction and relevant experience. There’s no need to sound like a bee. That’s my department."
    ],
    links: [{ label: "Back to opportunities", href: "careers.html" }, { label: "About Bee Infinity", href: "about.html" }]
  },
  cinemaz: {
    title: "A little room for a big story.",
    intro: "Welcome to B.I.G Cinemaz. Explore the film, production and post-production work, then talk to the team about your story.",
    tips: [
      "This page brings together production, post-production, dubbing and sound. Explore the section that fits your project.",
      "A film enquiry can begin with your idea, the stage it’s at and the support you’re looking for. Every story starts somewhere.",
      "If you’re exploring submissions or content acquisition, read the details on this page and contact the team for the next steps."
    ],
    links: [{ label: "Explore the gallery", href: "gallery.html" }, { label: "Discuss a film project", href: "contact.html#contact-form" }, { label: "Our divisions", href: "divisions.html" }]
  },
  botd: {
    title: "A little anticipation. A lot of energy.",
    intro: "You’ve found the BOTD announcement page. I’m keeping my wings ready. Follow the information on this page for what comes next.",
    tips: [
      "No spoilers from me. Look out for the announcement and details shared on this page.",
      "While you’re here, explore the team’s dance and performance work in the gallery."
    ],
    links: [{ label: "Explore dance & events", href: "divisions.html" }, { label: "See the gallery", href: "gallery.html" }, { label: "Contact Bee Infinity", href: "contact.html#contact-form" }]
  },
  merch: {
    title: "A little Bee Infinity to take with you.",
    intro: "Explore the merch and take a closer look at anything you like. I’ll leave the choosing to you. My own wardrobe is mostly stripes.",
    tips: [
      "Check the product details and available options before adding something to your cart.",
      "Review your selection in the cart before continuing. I’m here for directions, not to rush a decision.",
      "Need to ask the team about a product? The contact page is the best place to start."
    ],
    links: [{ label: "Contact the team", href: "contact.html#contact-form" }, { label: "Explore Bee Infinity", href: "index.html" }]
  },
  launch: {
    title: "Some things are worth the anticipation.",
    intro: "This is the merch announcement page. For availability and updates, use the information and contact options shown here.",
    tips: ["For current availability, check with the team. I prefer a confirmed answer to an enthusiastic guess."],
    links: [{ label: "Contact the team", href: "contact.html#contact-form" }, { label: "Back to Bee Infinity", href: "index.html" }]
  },
  cart: {
    title: "A quick check before you continue.",
    intro: "Review the items and options shown in your cart. I’ll keep quiet while you check the details.",
    tips: ["Make sure your selected items, options and quantities are right before continuing. The order summary shows the totals."],
    links: [{ label: "Contact the team", href: "contact.html#contact-form" }, { label: "Back to Bee Infinity", href: "index.html" }]
  },
  auth: { title: "Take your time.", intro: "I’ll stay out of the way while you sign in.", tips: [], links: [] },
  checkout: { title: "Your order, your pace.", intro: "I’ll stay out of the way while you review your order.", tips: [], links: [] },
  success: { title: "A moment for your order details.", intro: "Please refer to the order information shown on this page.", tips: [], links: [] }
};
