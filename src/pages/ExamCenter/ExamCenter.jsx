import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import AppHeader from '../../components/AppHeader/AppHeader';
import AppFooter from '../../components/AppFooter/AppFooter';
import Button from '../../components/Button/Button';
import styles from './ExamCenter.module.scss';
import { checkExamEligibility, saveExamScore } from '../../utils/api';
import accentBar from '../../assets/Rectangle 3 Copy 4.svg';
import successTick from '../../assets/Success Tick.svg';

// Complete question bank for the exams
const EXAM_DATA = {
  sitecore: {
    title: 'Sitecore DAM & Content Hub Professional Certification',
    theme: 'backend',
    duration: 300, // 5 mins in seconds
    questions: [
      {
        id: 1,
        text: 'What is the primary purpose of a "Taxonomy" in Sitecore Content Hub DAM?',
        options: [
          'To define the database index structure for fast rendering.',
          'To provide standard flat metadata attributes across assets.',
          'To establish hierarchical relations for asset classification and tagging.',
          'To secure assets using role-based accessibility policies.'
        ],
        correct: 2,
        explain: 'Taxonomies in Sitecore Content Hub are hierarchical structures that allow classifications (like Brands, Asset Types, or Regions) to tag and filter digital assets efficiently.'
      },
      {
        id: 2,
        text: 'In Sitecore Content Hub DAM, which component allows you to automate the state transition of assets (e.g., from Draft to Approved)?',
        options: [
          'Content Hub Schema Manager.',
          'State Machine workflow under BPM workflows.',
          'Security policy rules.',
          'Web API endpoints.'
        ],
        correct: 1,
        explain: 'BPM workflows and state machines in Content Hub are specifically designed to define and automate transitions, validations, and approvals for digital assets.'
      },
      {
        id: 3,
        text: 'What does "M.Asset" represent in the Content Hub Domain Model schema?',
        options: [
          'The base system definition for media files and assets.',
          'A custom relational taxonomy.',
          'The user-role permission mappings.',
          'The file extraction container protocol.'
        ],
        correct: 0,
        explain: 'M.Asset is the standard out-of-the-box system definition schema in Sitecore Content Hub that defines fields, relations, and settings for digital assets.'
      },
      {
        id: 4,
        text: 'When configuring a custom media engine migration script, which trigger type is best for automatic rendition generation upon asset upload?',
        options: [
          'Action trigger.',
          'Metadata extraction trigger.',
          'In-process execution trigger.',
          'Manual UI action trigger.'
        ],
        correct: 2,
        explain: 'In-process execution triggers intercept processing cycles directly, making them ideal for high-performance and low-latency asset manipulation or rendition creation.'
      },
      {
        id: 5,
        text: 'How long does the training sandbox environment run for upon initialization by the instructor?',
        options: [
          '7 days.',
          '14 days.',
          '30 days.',
          '90 days.'
        ],
        correct: 2,
        explain: 'As detailed in the Course Objectives, a standard Sitecore DAM learning sandbox is provisioned for exactly 30 days.'
      }
    ]
  },
  frontend: {
    title: 'Modern Frontend Architecture & HTML/CSS Certification',
    theme: 'frontend',
    duration: 300,
    questions: [
      {
        id: 1,
        text: 'Which HTML5 semantic tag is most appropriate for containing content that is indirectly related to the main article, such as sidebars or callouts?',
        options: [
          '<section>',
          '<aside>',
          '<article>',
          '<nav>'
        ],
        correct: 1,
        explain: 'The <aside> element represents content that is indirectly related to the primary content surrounding it, making it ideal for sidebars, advertising blocks, or callouts.'
      },
      {
        id: 2,
        text: 'What happens when a CSS layout specifies "display: flex; flex-wrap: wrap;" and a child has "flex: 1 1 300px;"?',
        options: [
          'The child will never expand past 300px width.',
          'The child has a base width of 300px, can shrink and grow, and will wrap to a new line if container width is less than 300px.',
          'The child is locked to exactly 300px height.',
          'The child will float to the absolute top of the container.'
        ],
        correct: 1,
        explain: 'The shorthand "flex: 1 1 300px" stands for flex-grow: 1, flex-shrink: 1, and flex-basis: 300px. This makes the element flexible around a 300px baseline, wrapping when bounds shrink.'
      },
      {
        id: 3,
        text: 'In modern frontend performance, what is the core benefit of using "Static Site Generation" (SSG) with React/Next.js?',
        options: [
          'It renders pages on the fly for every incoming request using Node servers.',
          'It pre-builds HTML files at build time, leading to near-instant visual load times (high SEO) and reduced server load.',
          'It compiles React code directly into low-level WebAssembly.',
          'It disables JavaScript execution in the client browser.'
        ],
        correct: 1,
        explain: 'Static Site Generation (SSG) generates fully qualified HTML pages at build time. These files are cached globally on CDNs, giving outstanding load times and SEO performance.'
      },
      {
        id: 4,
        text: 'Which CSS property allows child elements to inherit absolute vertical alignment values within a parent flex container?',
        options: [
          'vertical-align: inherit;',
          'align-items (when using Flexbox) or align-content.',
          'float: left;',
          'text-align: center;'
        ],
        correct: 1,
        explain: 'The align-items property in CSS Flexbox controls the cross-axis vertical alignment for all direct children within a flex container.'
      },
      {
        id: 5,
        text: 'How does a progressive web app (PWA) achieve offline availability?',
        options: [
          'By caching all HTML nodes inside standard session cookies.',
          'By running a Service Worker script that intercepts network requests and serves cached files.',
          'By storing the entire MySQL database inside the browser indexDB.',
          'By requesting temporary server shell access.'
        ],
        correct: 1,
        explain: 'Service workers act as proxy servers on the client, intercepting resource network requests and serving files directly from the Cache API even when offline.'
      }
    ]
  },
  devops: {
    title: 'DevOps Infrastructure & CI/CD Pipeline Certification',
    theme: 'devops',
    duration: 300,
    questions: [
      {
        id: 1,
        text: 'In a CI/CD pipeline, what is the distinction between "Continuous Delivery" (CD) and "Continuous Deployment"?',
        options: [
          'Continuous Delivery requires a manual release approval step, whereas Continuous Deployment automates release to production directly.',
          'Deployment is only for local dev environments, while delivery is for cloud environments.',
          'Delivery only validates linting; deployment runs Unit tests.',
          'There is no distinction between the two terms.'
        ],
        correct: 0,
        explain: 'In Continuous Delivery, built artifacts are staged and ready for release, but require manual authorization to deploy. Continuous Deployment automates the entire staging-to-production lifecycle without human intervention.'
      },
      {
        id: 2,
        text: 'What is the fundamental utility of a Service Mesh (e.g., Istio) in a Kubernetes-orchestrated microservices infrastructure?',
        options: [
          'It compiles container images from source files.',
          'It manages secure service-to-service communication, traffic routing, load-balancing, and telemetry without changing application code.',
          'It provides local database storage for backend nodes.',
          'It manages user authentication session states.'
        ],
        correct: 1,
        explain: 'A Service Mesh handles sidecar proxy traffic patterns, injecting mutual TLS (mTLS), traffic shaping, routing rules, and extensive logging seamlessly into microservice pods.'
      },
      {
        id: 3,
        text: 'In Docker, how does the "multi-stage build" optimization work?',
        options: [
          'It creates multiple containers running in parallel.',
          'It allows utilizing temporary intermediate containers to build artifacts, producing a tiny final image containing only the runtime dependencies.',
          'It distributes container workloads across multiple hosts.',
          'It triggers build tasks simultaneously in different threads.'
        ],
        correct: 1,
        explain: 'Multi-stage builds allow developers to use rich SDK images during intermediate build steps, then copy only the finalized compiled code into a lightweight runtime image, minimizing Docker image size.'
      },
      {
        id: 4,
        text: 'Which pipeline stage is primarily responsible for verifying code formatting and syntactical bugs?',
        options: [
          'Build',
          'Deploy',
          'Linting / Static Analysis',
          'Integration Testing'
        ],
        correct: 2,
        explain: 'Linting/Static Analysis reviews the codebase for formatting guidelines, pattern matching, and syntactical bugs prior to triggering compiling or resource-heavy builds.'
      },
      {
        id: 5,
        text: 'When writing Kubernetes resource manifests, what is a "ReplicaSet" primarily designed to do?',
        options: [
          'Create custom load-balancing subnets.',
          'Map public DNS records to internal Pod IPs.',
          'Ensure that a specified number of identical pod replicas are running at any given time.',
          'Store secure credentials and passwords.'
        ],
        correct: 2,
        explain: 'A ReplicaSet ensures the high-availability and self-healing of workloads by continually monitoring and scaling identical pods to match the declared replica count.'
      }
    ]
  }
};

// A dictionary mapping each course title to its exact, relevant 5 multiple choice questions.
const COURSE_QUESTIONS_POOL = {
  // --- FRONTEND SOLUTIONS ---
  'Web Development Basic - HTML': [
    {
      id: 1,
      text: 'Which HTML5 element is used to define important text, typically rendered in bold?',
      options: ['<bold>', '<strong>', '<important>', '<b>'],
      correct: 1,
      explain: 'The <strong> tag is the modern HTML5 semantic element used to indicate that its contents have strong importance, seriousness, or urgency.'
    },
    {
      id: 2,
      text: 'What is the correct syntax for creating a hyperlink in HTML?',
      options: ['<a href="url">link</a>', '<a>url</a>', '<link src="url">', '<a url="url">'],
      correct: 0,
      explain: 'The <a> (anchor) tag uses the href attribute to specify the URL target of the link.'
    },
    {
      id: 3,
      text: 'Which tag is used to define an item in a list?',
      options: ['<ul>', '<ol>', '<li>', '<list>'],
      correct: 2,
      explain: 'The <li> element defines a list item within either an ordered (<ol>) or unordered (<ul>) list.'
    },
    {
      id: 4,
      text: 'Which HTML5 element represents the header of a section or page?',
      options: ['<head>', '<header>', '<top>', '<heading>'],
      correct: 1,
      explain: 'The <header> element represents introductory content, typically containing a group of introductory or navigational aids.'
    },
    {
      id: 5,
      text: 'What is the correct HTML element for inserting a line break?',
      options: ['<break>', '<lb>', '<br>', '<line>'],
      correct: 2,
      explain: 'The <br> tag is an empty element that inserts a single line break.'
    }
  ],
  'Advanced HTML Concepts': [
    {
      id: 1,
      text: 'Which HTML5 API allows web scripts to run background tasks in a separate thread?',
      options: ['Web Workers', 'Web Sockets', 'Service Workers', 'Local Storage'],
      correct: 0,
      explain: 'Web Workers allow web scripts to run heavy computational tasks in background threads, keeping the main UI thread highly responsive.'
    },
    {
      id: 2,
      text: 'What is the primary difference between HTML5 Canvas and SVG?',
      options: [
        'Canvas is vector-based; SVG is raster-based.',
        'Canvas is drawn via JavaScript (pixel-based); SVG is XML-based (retains elements).',
        'SVG is faster for rendering thousands of moving particles.',
        'Canvas automatically supports screen readers.'
      ],
      correct: 1,
      explain: 'Canvas renders pixels dynamically using scripts, while SVG is an XML format that creates persistent vector elements in the DOM tree.'
    },
    {
      id: 3,
      text: 'Which attribute should be added to an <audio> or <video> tag to make the player controls visible?',
      options: ['show', 'visible', 'controls', 'player'],
      correct: 2,
      explain: 'The "controls" boolean attribute enables the browser\'s default audio/video player user interface controls.'
    },
    {
      id: 4,
      text: 'What is the correct way to store a small amount of key-value data persistently in the user\'s browser across sessions?',
      options: ['sessionStorage', 'Cookies', 'localStorage', 'IndexedDB'],
      correct: 2,
      explain: 'localStorage stores data with no expiration date, meaning the data survives browser close/reopens.'
    },
    {
      id: 5,
      text: 'Which element is used to draw graphics on the fly via scripting (usually JavaScript)?',
      options: ['<canvas>', '<graphics>', '<svg>', '<draw>'],
      correct: 0,
      explain: 'The <canvas> element is used as a container to draw pixel graphics using standard JavaScript rendering contexts.'
    }
  ],
  'Advanced HTML CSS': [
    {
      id: 1,
      text: 'What does "display: grid;" do in a CSS layout?',
      options: [
        'Floats all elements to the left margin.',
        'Converts the element into a grid container, aligning its children into rows and columns.',
        'Makes the container inline-level.',
        'Automatically hides overflow text.'
      ],
      correct: 1,
      explain: 'Specifying display: grid turns the parent element into a grid formatting context for direct children.'
    },
    {
      id: 2,
      text: 'How do you align items along the main axis in a CSS Flexbox parent container?',
      options: ['align-items', 'justify-content', 'align-content', 'text-align'],
      correct: 1,
      explain: 'justify-content defines how space is distributed between and around flex items along the main axis.'
    },
    {
      id: 3,
      text: 'What does "flex-shrink: 0;" do to a flex child item?',
      options: [
        'It prevents the item from shrinking below its basis size.',
        'It allows the item to grow twice as fast.',
        'It forces the item to wrap to the next line.',
        'It hides the item on mobile viewports.'
      ],
      correct: 0,
      explain: 'A flex-shrink value of 0 locks the element, preventing the browser from compressing it when flex item widths exceed parent container size.'
    },
    {
      id: 4,
      text: 'Which CSS rule defines the base size of a flex item before remaining space is distributed?',
      options: ['flex-basis', 'flex-grow', 'flex-shrink', 'width'],
      correct: 0,
      explain: 'flex-basis sets the initial main-size of a flex item before flex-grow or flex-shrink rules apply.'
    },
    {
      id: 5,
      text: 'Which grid unit represents a fraction of the free space available inside the grid container?',
      options: ['fr', 'px', 'em', '%'],
      correct: 0,
      explain: 'The fr unit represents a fraction of the free space inside a CSS Grid container.'
    }
  ],
  'JavaScript for Beginners': [
    {
      id: 1,
      text: 'Which JavaScript keyword is used to declare a variable whose reference cannot be changed?',
      options: ['let', 'var', 'const', 'immutable'],
      correct: 2,
      explain: 'const declares a block-scoped variable whose reference is read-only and cannot be reassigned.'
    },
    {
      id: 2,
      text: 'What is the correct syntax for writing an arrow function in ES6 JavaScript?',
      options: [
        'function name() => {}',
        'const name = () => {}',
        'def name():',
        'const name = function => {}'
      ],
      correct: 1,
      explain: 'ES6 introduced arrow functions: const myFunc = () => {}.'
    },
    {
      id: 3,
      text: 'Which operator is used for strict equality comparison, matching both value and type?',
      options: ['==', '=', '===', 'eq'],
      correct: 2,
      explain: 'The strict equality operator (===) returns true if both operand values and types are identical.'
    },
    {
      id: 4,
      text: 'How do you write a single-line comment in JavaScript?',
      options: ['/* comment */', '# comment', '// comment', '<!-- comment -->'],
      correct: 2,
      explain: 'JavaScript uses double forward slashes (//) to initiate a single-line comment.'
    },
    {
      id: 5,
      text: 'Which native method parses a JSON string into a JavaScript object?',
      options: ['JSON.stringify()', 'JSON.parse()', 'JSON.toObject()', 'parseJSON()'],
      correct: 1,
      explain: 'JSON.parse() parses a well-formed JSON string, constructing the corresponding JavaScript value or object.'
    }
  ],
  'Bootstrap 5 Responsive Design': [
    {
      id: 1,
      text: 'Which Bootstrap 5 class creates a full-width container that spans the entire width of the viewport?',
      options: ['.container', '.container-fluid', '.container-full', '.row'],
      correct: 1,
      explain: '.container-fluid provides a 100% wide container at all breakpoints.'
    },
    {
      id: 2,
      text: 'How many grid columns are in a standard Bootstrap 5 grid row?',
      options: ['10', '12', '16', '24'],
      correct: 1,
      explain: 'Bootstrap\'s responsive mobile-first grid system features a highly flexible 12-column layout structure.'
    },
    {
      id: 3,
      text: 'Which Bootstrap 5 utility class is used to add top margin to an element?',
      options: ['.mt-3', '.pt-3', '.margin-top-3', '.my-top-3'],
      correct: 0,
      explain: '.mt-3 applies a medium-sized margin top based on spacing Sass variables.'
    },
    {
      id: 4,
      text: 'Which breakpoint class prefix represents medium devices (tablets, 768px and up)?',
      options: ['sm', 'md', 'lg', 'xl'],
      correct: 1,
      explain: 'The md breakpoint prefix targets tablet viewports at 768px and above.'
    },
    {
      id: 5,
      text: 'Which class is used to center text in Bootstrap 5?',
      options: ['.text-center', '.align-center', '.justify-center', '.text-middle'],
      correct: 0,
      explain: '.text-center is the standard typography utility class to align text centrally.'
    }
  ],
  'CSS Variables and Animations': [
    {
      id: 1,
      text: 'How do you retrieve the value of a custom CSS variable named "--primary-color"?',
      options: ['var(--primary-color)', 'get(--primary-color)', 'val(--primary-color)', 'css(--primary-color)'],
      correct: 0,
      explain: 'The var() CSS function retrieves and evaluates the value of a declared custom property.'
    },
    {
      id: 2,
      text: 'Which CSS property defines the keyframes animation name and timing settings?',
      options: ['animation', 'transition', 'keyframes', 'animate'],
      correct: 0,
      explain: 'The animation property shorthand assigns keyframe sequences, durations, and timing functions.'
    },
    {
      id: 3,
      text: 'Which keyword is used to describe a 3D rotation transform in CSS?',
      options: ['rotate3d()', 'spin()', 'skew()', 'transform3d()'],
      correct: 0,
      explain: 'rotate3d() rotates an element around an arbitrary axis vector in three-dimensional space.'
    },
    {
      id: 4,
      text: 'Which timing function creates a quick start and slow ending motion curve?',
      options: ['linear', 'ease-out', 'ease-in', 'step-start'],
      correct: 1,
      explain: 'ease-out specifies a transition effect with a fast start, decelerating towards completion.'
    },
    {
      id: 5,
      text: 'Which rule defines keyframes sequences in CSS?',
      options: ['@keyframes', '@animation', '@frames', '@motion'],
      correct: 0,
      explain: 'The @keyframes rule maps percentages (or from/to) to properties defining transitional rendering frames.'
    }
  ],
  'Asynchronous JS with Ajax': [
    {
      id: 1,
      text: 'What does AJAX stand for?',
      options: [
        'Asynchronous JavaScript And XML',
        'Advanced JavaScript And XHTML',
        'Asynchronous JSON And XML',
        'Active Javascript API eXchange'
      ],
      correct: 0,
      explain: 'AJAX represents Asynchronous JavaScript And XML, the technique to update web pages asynchronously.'
    },
    {
      id: 2,
      text: 'Which modern native web API replaces older XMLHttpRequest for making AJAX network calls?',
      options: ['fetch()', 'request()', 'http()', 'axios()'],
      correct: 0,
      explain: 'The Fetch API provides a modern, Promise-based interface for fetching remote HTTP network resources.'
    },
    {
      id: 3,
      text: 'Which HTTP status code represents a successful response?',
      options: ['200', '404', '500', '302'],
      correct: 0,
      explain: 'Status 200 OK signals that the requested resource was fetched and transmitted successfully.'
    },
    {
      id: 4,
      text: 'How do you serialize a JavaScript object into a JSON string for network transmissions?',
      options: ['JSON.stringify()', 'JSON.parse()', 'JSON.objectify()', 'String(obj)'],
      correct: 0,
      explain: 'JSON.stringify() converts dynamic JavaScript values/objects into static JSON formatted strings.'
    },
    {
      id: 5,
      text: 'What is a core benefit of using "async" and "await" keywords with Promises?',
      options: [
        'It runs javascript code in a secondary operating system thread.',
        'It makes asynchronous code read like synchronous procedural code, reducing callback nests.',
        'It speeds up database CPU cycles.',
        'It acts as an automatic anti-virus guard.'
      ],
      correct: 1,
      explain: 'async/await simplifies asynchronous code patterns, avoiding nested .then() handlers and increasing readability.'
    }
  ],
  'SEO Optimized HTML5': [
    {
      id: 1,
      text: 'Which tag should be used exactly once per page to specify the primary topic for search crawlers?',
      options: ['<h1>', '<title>', '<header>', '<meta>'],
      correct: 0,
      explain: 'A single <h1> tag per page establishes clear topical hierarchies for search engine web crawlers.'
    },
    {
      id: 2,
      text: 'Which attribute provides alternate description text to search indexers if an image cannot load?',
      options: ['title', 'alt', 'desc', 'src'],
      correct: 1,
      explain: 'The alt attribute describes the visual content of an image, contributing to accessibility and SEO keyword indexing.'
    },
    {
      id: 3,
      text: 'Which tag houses the metadata summary that shows up on search results pages?',
      options: ['<meta name="description" content="...">', '<meta name="keywords">', '<head>', '<summary>'],
      correct: 0,
      explain: 'The meta description tags compose the snippet summaries users read on Search Engine Results Pages (SERPs).'
    },
    {
      id: 4,
      text: 'Which semantic element is most suitable for encapsulating a self-contained blog post or news feed article?',
      options: ['<article>', '<section>', '<div>', '<aside>'],
      correct: 0,
      explain: 'The <article> element represents a self-contained, independent composition designed to be reusable.'
    },
    {
      id: 5,
      text: 'What does "robots.txt" do for search engines?',
      options: [
        'It tracks daily user click statistics.',
        'It instructs search crawler bots which page directories they can or cannot scan.',
        'It compiles client javascript.',
        'It displays captcha overlays.'
      ],
      correct: 1,
      explain: 'Robots.txt acts as a security and crawler guide, designating allowed paths for indexer bots.'
    }
  ],
  'CSS Preprocessors: SCSS': [
    {
      id: 1,
      text: 'What is a primary benefit of using SCSS over standard CSS?',
      options: [
        'SCSS runs faster inside user browsers without compiling.',
        'SCSS supports variables, nested selectors, and mixins to write highly maintainable stylesheets.',
        'SCSS uses database tables for variables.',
        'SCSS works without HTML link stylesheets.'
      ],
      correct: 1,
      explain: 'SCSS simplifies stylesheet creation by providing nested structures, variables, imports, and modular functions.'
    },
    {
      id: 2,
      text: 'Which character denotes variable declarations in SCSS?',
      options: ['$', '@', '#', '--'],
      correct: 0,
      explain: 'SCSS utilizes the dollar sign ($) prefix to declare custom pre-processor stylesheet variables.'
    },
    {
      id: 3,
      text: 'What does @mixin do in SCSS?',
      options: [
        'Declares a group of CSS declarations that can be reused across different stylesheets via @include.',
        'Performs database calculations.',
        'Minifies stylesheet code sizes.',
        'Embeds media files.'
      ],
      correct: 0,
      explain: 'Mixins allow authors to bundle complex, repeatable CSS blocks together and import them anywhere with "@include".'
    },
    {
      id: 4,
      text: 'How do you nest child elements under a parent element in SCSS?',
      options: [
        'By writing curly brackets directly inside the parent\'s curly brackets.',
        'By using standard HTML markup.',
        'By using the import statement.',
        'By prefixing child lines with arrows.'
      ],
      correct: 0,
      explain: 'SCSS lets you write child selectors nested inside parent declaration blocks, mirroring HTML structures.'
    },
    {
      id: 5,
      text: 'Which character represents referencing the parent selector within SCSS nested blocks?',
      options: ['&', '@', '^', '*'],
      correct: 0,
      explain: 'The ampersand (&) references the parent selector, facilitating quick pseudo-class definitions (like &:hover).'
    }
  ],
  'JS Design Patterns': [
    {
      id: 1,
      text: 'Which design pattern restricts a class instantiation to exactly one unique shared instance?',
      options: ['Singleton', 'Factory', 'Observer', 'Module'],
      correct: 0,
      explain: 'The Singleton pattern restricts class construction, preserving a single global execution instance.'
    },
    {
      id: 2,
      text: 'Which design pattern allows multiple objects to subscribe and listen to state changes from a single subject?',
      options: ['Observer', 'Factory', 'Decorator', 'Strategy'],
      correct: 0,
      explain: 'The Observer pattern coordinates state events, notifying subscriber lists automatically upon changes.'
    },
    {
      id: 3,
      text: 'What is the primary benefit of the Module pattern in JavaScript?',
      options: [
        'It enables asynchronous script downloading.',
        'It encapsulates private methods and variables, exposing only a public API interface.',
        'It increases CSS layout rendering speeds.',
        'It automates SQL database queries.'
      ],
      correct: 1,
      explain: 'The Module pattern utilizes closures to isolate state and local functions, exposing only a controlled API.'
    },
    {
      id: 4,
      text: 'Which design pattern facilitates object creation, avoiding specifying exact classes or constructor methods?',
      options: ['Factory', 'Singleton', 'Observer', 'Adapter'],
      correct: 0,
      explain: 'The Factory pattern isolates object construction logic inside custom builder methods rather than direct instantiations.'
    },
    {
      id: 5,
      text: 'What does the Adapter pattern do?',
      options: [
        'Translates one interface into another, letting classes with incompatible interfaces work together.',
        'Caches request payloads.',
        'Compresses container sizes.',
        'Decrypts hashed passwords.'
      ],
      correct: 0,
      explain: 'An Adapter matches incompatible API interfaces together without modifying target internal architectures.'
    }
  ],

  // --- BACKEND SOLUTIONS ---
  'Python Backend Fundamentals': [
    {
      id: 1,
      text: 'Which Python web framework is lightweight, minimalist, and widely used for creating micro APIs?',
      options: ['Django', 'Flask', 'Rails', 'Spring'],
      correct: 1,
      explain: 'Flask is a lightweight, extensible micro-framework designed for swift, un-opinionated backend setups.'
    },
    {
      id: 2,
      text: 'How do you start a local Flask dev server by default?',
      options: ['python server.py', 'flask run', 'npm start', 'run flask'],
      correct: 1,
      explain: 'The "flask run" CLI command initiates a local development web server hosting the configured app.'
    },
    {
      id: 3,
      text: 'Which decorator registers a routing path in a standard Flask application?',
      options: ['@app.route()', '@route', '@app.path()', '@flask.route()'],
      correct: 0,
      explain: '@app.route("/path") is the standard decorator binding view functions to specific request paths.'
    },
    {
      id: 4,
      text: 'Which Python library is standard for establishing secure SQL database connections?',
      options: ['sqlalchemy', 'requests', 'numpy', 'datetime'],
      correct: 0,
      explain: 'SQLAlchemy is a robust, popular ORM providing consistent relational database interfaces.'
    },
    {
      id: 5,
      text: 'Which HTTP method is most appropriate for creating a new database record under REST conventions?',
      options: ['GET', 'POST', 'PUT', 'DELETE'],
      correct: 1,
      explain: 'POST creates new database records, while GET reads, PUT replaces, and DELETE removes them.'
    }
  ],
  'Node.js APIs with Express': [
    {
      id: 1,
      text: 'What is the primary function of Node.js on a server?',
      options: [
        'It compiles styles into CSS files.',
        'It executes JavaScript code on the server side outside user web browsers.',
        'It secures local client computers.',
        'It manages mobile network connections.'
      ],
      correct: 1,
      explain: 'Node.js is a high-performance cross-platform JavaScript runtime built on Chrome\'s V8 engine.'
    },
    {
      id: 2,
      text: 'In Express, what does "middleware" represent?',
      options: [
        'A database partition.',
        'Functions executed sequentially during the HTTP request-response cycle.',
        'A browser add-on script.',
        'An encryption key standard.'
      ],
      correct: 1,
      explain: 'Middleware functions intercept request and response models, carrying out operations or filters before completing paths.'
    },
    {
      id: 3,
      text: 'Which middleware is standard for parsing incoming JSON request bodies in Express?',
      options: ['express.json()', 'express.parser()', 'body.json()', 'jsonParser()'],
      correct: 0,
      explain: 'express.json() is a built-in Express middleware parsing standard JSON-formatted payloads.'
    },
    {
      id: 4,
      text: 'How do you send a JSON response to a client in an Express route handler?',
      options: ['res.sendJSON()', 'res.json()', 'response.send()', 'res.write()'],
      correct: 1,
      explain: 'res.json(data) formats, sets headers, and sends a completed JSON string response to requests.'
    },
    {
      id: 5,
      text: 'Which status code indicates that a client requested a resource that does not exist?',
      options: ['400', '401', '403', '404'],
      correct: 3,
      explain: '404 Not Found signals that the requested web endpoint or asset could not be resolved on servers.'
    }
  ],
  'Java Spring Boot Core': [
    {
      id: 1,
      text: 'What is a primary benefit of using Spring Boot over standard Spring projects?',
      options: [
        'It runs without requiring Java.',
        'It provides auto-configuration and embedded servers (like Tomcat) to launch apps instantly.',
        'It minifies frontend scripts.',
        'It performs direct CSS rendering.'
      ],
      correct: 1,
      explain: 'Spring Boot provides auto-configuration, starter packs, and embedded Tomcat containers out of the box.'
    },
    {
      id: 2,
      text: 'Which annotation registers a class as an entry controller for RESTful APIs in Spring Boot?',
      options: ['@Controller', '@RestController', '@Service', '@Repository'],
      correct: 1,
      explain: '@RestController marks classes as controllers returning formatted JSON payloads directly.'
    },
    {
      id: 3,
      text: 'Which annotation automates Dependency Injection (DI) in Spring Core?',
      options: ['@Autowired', '@Inject', '@Bean', '@Service'],
      correct: 0,
      explain: '@Autowired guides Spring to resolve, locate, and inject matching beans into class constructor arguments.'
    },
    {
      id: 4,
      text: 'What is the utility of a "Repository" interface in Spring Data JPA?',
      options: [
        'It manages container compilation scripts.',
        'It provides standard CRUD database operations without writing custom SQL queries.',
        'It secures local passwords.',
        'It builds HTML pages.'
      ],
      correct: 1,
      explain: 'Spring Data JPA Repositories compile standard data transactions (save, find, delete) using database mappings.'
    },
    {
      id: 5,
      text: 'Which Spring Boot file handles environment properties and configurations?',
      options: ['application.properties or application.yml', 'server.config', 'pom.xml', 'web.xml'],
      correct: 0,
      explain: 'application.properties/yml configures databases, server ports, security policies, and environment values.'
    }
  ],
  'Relational Database Design (SQL)': [
    {
      id: 1,
      text: 'What is the primary goal of "Database Normalization"?',
      options: [
        'To speed up CPU clock cycles.',
        'To eliminate data redundancy and preserve relational integrity.',
        'To create multiple tables on different hosts.',
        'To disable user accounts.'
      ],
      correct: 1,
      explain: 'Normalization structures relational tables to minimize redundancy and prevent dependency anomalies.'
    },
    {
      id: 2,
      text: 'Which key uniquely identifies each record in a database table?',
      options: ['Foreign Key', 'Primary Key', 'Unique Key', 'Candidate Key'],
      correct: 1,
      explain: 'A Primary Key enforces unique, non-null value constraints, identifying exactly one row.'
    },
    {
      id: 3,
      text: 'What is a Foreign Key designed to do?',
      options: [
        'Identify duplicate columns.',
        'Establish and enforce a link between data in two different tables.',
        'Optimize indexing operations.',
        'Create guest roles.'
      ],
      correct: 1,
      explain: 'Foreign Keys map relationships, pointing to the Primary Key of target referenced rows.'
    },
    {
      id: 4,
      text: 'Which SQL join returns all rows from the left table, and matched rows from the right table?',
      options: ['INNER JOIN', 'RIGHT JOIN', 'LEFT JOIN', 'FULL JOIN'],
      correct: 2,
      explain: 'LEFT JOIN fetches all records from the left table alongside matched records from the right table.'
    },
    {
      id: 5,
      text: 'What is the purpose of an Index in a database table?',
      options: [
        'To encrypt sensitive passwords.',
        'To speed up retrieval queries at the cost of slower write times and additional storage.',
        'To allow duplicate keys.',
        'To track server crashes.'
      ],
      correct: 1,
      explain: 'Indexes allow database engines to locate records rapidly without scanning entire tables.'
    }
  ],
  'NoSQL with MongoDB': [
    {
      id: 1,
      text: 'What format does MongoDB use to store document data collections?',
      options: ['SQL Tables', 'BSON (Binary JSON)', 'XML Schemas', 'CSV spreadsheets'],
      correct: 1,
      explain: 'MongoDB stores collections as BSON (Binary JSON) documents, which supports rapid serialization.'
    },
    {
      id: 2,
      text: 'What represents a "row" in MongoDB terminologies?',
      options: ['Collection', 'Document', 'Field', 'Index'],
      correct: 1,
      explain: 'A Document is the basic unit of data in MongoDB, analogous to relational table rows.'
    },
    {
      id: 3,
      text: 'Which MongoDB command inserts a new record into a collection?',
      options: ['db.collection.insertOne()', 'db.insert()', 'db.add()', 'collection.save()'],
      correct: 0,
      explain: 'db.collection.insertOne() writes exactly one document into the designated collection.'
    },
    {
      id: 4,
      text: 'What is a core benefit of a NoSQL database compared to a relational database?',
      options: [
        'NoSQL completely blocks database hacks.',
        'Flexible dynamic schemas that let documents vary in structures without requiring rigid migrations.',
        'NoSQL requires zero memory.',
        'It has slower search times.'
      ],
      correct: 1,
      explain: 'MongoDB\'s schema-less document architecture facilitates rapid development cycles without locking migrations.'
    },
    {
      id: 5,
      text: 'What does the "_id" field represent in MongoDB documents?',
      options: [
        'A local index.',
        'A unique primary key automatically generated for every document.',
        'A temporary connection port.',
        'A backup user list.'
      ],
      correct: 1,
      explain: '_id is the unique primary key generated automatically by MongoDB if omitted during creations.'
    }
  ],
  'Django for Web Pros': [
    {
      id: 1,
      text: 'What architectural pattern does the Django framework follow?',
      options: ['MVC', 'MVT (Model-View-Template)', 'Microservice', 'Serverless'],
      correct: 1,
      explain: 'Django adopts the Model-View-Template (MVT) pattern, where templates represent local interfaces.'
    },
    {
      id: 2,
      text: 'Which Django command creates database tables based on defined Python models?',
      options: ['python manage.py migrate', 'python manage.py runserver', 'django-admin create', 'db.migrate()'],
      correct: 0,
      explain: '"python manage.py migrate" executes compiled migration scripts against connected database targets.'
    },
    {
      id: 3,
      text: 'What is the purpose of Django\'s built-in "admin interface"?',
      options: [
        'It renders responsive CSS sites.',
        'It provides an out-of-the-box, fully functional CRUD portal to manage database model records.',
        'It tracks CPU memory leaks.',
        'It manages security firewall ports.'
      ],
      correct: 1,
      explain: 'Django\'s built-in admin panel gives authenticated superusers instant controls over backend tables.'
    },
    {
      id: 4,
      text: 'Which file registers the request-routing paths in a Django project?',
      options: ['models.py', 'views.py', 'urls.py', 'settings.py'],
      correct: 2,
      explain: 'urls.py routes and binds incoming request path strings to their designated view callable classes.'
    },
    {
      id: 5,
      text: 'What is "Django ORM" used for?',
      options: [
        'Mapping database tables directly into Python class models to avoid writing raw SQL.',
        'Rendering HTML elements.',
        'Encrypting user passwords.',
        'Compiling CSS variables.'
      ],
      correct: 0,
      explain: 'Django\'s Object-Relational Mapper facilitates database operations using standard Python constructs.'
    }
  ],
  'Microservices with Node.js': [
    {
      id: 1,
      text: 'What is a defining characteristic of a Microservice architecture?',
      options: [
        'All application code runs in a single monolithic process.',
        'The application is composed of small, independently deployable services organized around business capabilities.',
        'Services must use the same exact SQL database.',
        'Workloads only run on local machines.'
      ],
      correct: 1,
      explain: 'Microservices partition monolith architectures into highly isolated services communicating via API protocols.'
    },
    {
      id: 2,
      text: 'Which lightweight network protocol is standard for microservice communications?',
      options: ['HTTP REST / JSON or gRPC', 'FTP', 'SMTP', 'SSH'],
      correct: 0,
      explain: 'Microservices rely on lightweight JSON APIs over HTTP/1.1 or high-performance RPCs (gRPC/ProtoBuf).'
    },
    {
      id: 3,
      text: 'What is an API Gateway designed to do?',
      options: [
        'A single entry point for clients, handling request routing, rate limiting, and security validations.',
        'Compile Docker container images.',
        'Run browser tests.',
        'Store static media files.'
      ],
      correct: 0,
      explain: 'An API Gateway intercepts client request payloads, routing them to their respective internal services.'
    },
    {
      id: 4,
      text: 'What is the utility of a "Service Discovery" registry (e.g., Consul)?',
      options: [
        'Allows service nodes to dynamically register and discover each other\'s host IP addresses and ports.',
        'Stores database backup files.',
        'Validates user email credentials.',
        'Minifies stylesheet builds.'
      ],
      correct: 0,
      explain: 'Service registries map running instances dynamically, aiding microservices to locate and balance endpoints.'
    },
    {
      id: 5,
      text: 'How do microservices maintain data isolation?',
      options: [
        'By sharing a single, giant, global SQL table.',
        'By ensuring each service manages its own isolated database (Database-per-Service).',
        'By storing all data inside sessionStorage cookies.',
        'By using manual Excel logs.'
      ],
      correct: 1,
      explain: 'A Database-per-service pattern isolates service databases, preventing tight architectural coupling.'
    }
  ],
  'Java Concurrency & Threads': [
    {
      id: 1,
      text: 'Which keyword in Java prevents thread collisions, allowing only one thread to access a resource at a time?',
      options: ['synchronized', 'volatile', 'static', 'final'],
      correct: 0,
      explain: 'The synchronized keyword locks methods or blocks, coordinating serial access among active threads.'
    },
    {
      id: 2,
      text: 'What is a "Race Condition" in concurrency?',
      options: [
        'A bug where multiple threads concurrently edit shared data, producing inconsistent outcomes based on timing.',
        'A fast server response cycle.',
        'A loop that executes quickly.',
        'A network port scanning method.'
      ],
      correct: 0,
      explain: 'Race conditions arise when read/write sequences collide without strict access controls.'
    },
    {
      id: 3,
      text: 'Which interface in Java represents a task that can be executed concurrently in a thread?',
      options: ['Runnable', 'Thread', 'Executor', 'Process'],
      correct: 0,
      explain: 'Runnable defines a single run() method container executing concurrent workloads.'
    },
    {
      id: 4,
      text: 'What does "volatile" guarantee in Java concurrency?',
      options: [
        'It locks database tables.',
        'It forces threads to read/write variables directly to primary system memory instead of thread caches.',
        'It completes tasks twice as fast.',
        'It encrypts string values.'
      ],
      correct: 1,
      explain: 'volatile ensures that thread modifications to variables are immediately visible across other threads.'
    },
    {
      id: 5,
      text: 'Which concurrency helper class serves as a high-performance, thread-safe alternative to HashMap?',
      options: ['ConcurrentHashMap', 'HashTable', 'SynchronizedMap', 'TreeMap'],
      correct: 0,
      explain: 'ConcurrentHashMap optimizes lock segments, giving exceptional performance and concurrent thread safety.'
    }
  ],

  // --- DEVOPS SOLUTIONS ---
  'Docker for Beginners': [
    {
      id: 1,
      text: 'What is a Docker image?',
      options: [
        'A screen capture of the server dashboard.',
        'An immutable read-only blueprint template used to build active runtime containers.',
        'A database backup file.',
        'A CSS styling sheet.'
      ],
      correct: 1,
      explain: 'A Docker image encapsulates libraries, application code, and system dependencies as a container template.'
    },
    {
      id: 2,
      text: 'Which file contains instructions to build a custom Docker image?',
      options: ['Dockerfile', 'docker-compose.yml', 'package.json', 'Makefile'],
      correct: 0,
      explain: 'A Dockerfile lists sequential configuration commands (FROM, RUN, COPY) assembling Docker images.'
    },
    {
      id: 3,
      text: 'Which CLI command executes a container from a specified Docker image?',
      options: ['docker run', 'docker build', 'docker start', 'docker execute'],
      correct: 0,
      explain: 'docker run downloads (if missing) and spins up active isolated containers using the requested image.'
    },
    {
      id: 4,
      text: 'What is a Docker Volume designed to do?',
      options: [
        'Boost container sound audio outputs.',
        'Persist container data beyond container lifecycles directly on the host machine.',
        'Minimize container image file sizes.',
        'Encapsulate REST endpoint requests.'
      ],
      correct: 1,
      explain: 'Volumes map isolated container directories to host directory paths, preserving data across restarts.'
    },
    {
      id: 5,
      text: 'Which command terminates a running Docker container?',
      options: ['docker stop', 'docker kill', 'docker remove', 'docker pause'],
      correct: 0,
      explain: 'docker stop gracefully signals container main processes to shutdown and terminate.'
    }
  ],
  'Kubernetes in Practice': [
    {
      id: 1,
      text: 'What is a Pod in Kubernetes?',
      options: [
        'A database partition.',
        'The smallest deployable unit in Kubernetes, hosting one or more co-located containers.',
        'A container registry portal.',
        'An operating system task.'
      ],
      correct: 1,
      explain: 'Pods encapsulate application containers, sharing network interfaces, IP addresses, and persistent storage volumes.'
    },
    {
      id: 2,
      text: 'Which Kubernetes component monitors node health and schedules pods onto running nodes?',
      options: ['kube-scheduler', 'kubelet', 'etcd', 'kube-apiserver'],
      correct: 0,
      explain: 'The kube-scheduler selects target node hosts accommodating declared pod hardware requirements.'
    },
    {
      id: 3,
      text: 'What is the utility of a Kubernetes Service manifest?',
      options: [
        'It compiles container code.',
        'It exposes a persistent, load-balanced network endpoint for an logical set of pods.',
        'It stores credentials securely.',
        'It sets up server backup logs.'
      ],
      correct: 1,
      explain: 'Services abstract pod IP volatilities, routing traffic reliably to active backend pods.'
    },
    {
      id: 4,
      text: 'Which database serves as Kubernetes\' high-performance key-value cluster state storage?',
      options: ['etcd', 'Redis', 'PostgreSQL', 'MongoDB'],
      correct: 0,
      explain: 'etcd acts as a highly-available distributed key-value store holding entire Kubernetes cluster state records.'
    },
    {
      id: 5,
      text: 'What does "kubelet" do on cluster nodes?',
      options: [
        'It is an agent running on each worker node to ensure that declared pod manifests run properly.',
        'It balances DNS routes.',
        'It triggers CI/CD build scripts.',
        'It encrypts cluster passwords.'
      ],
      correct: 0,
      explain: 'Kubelet acts as the local node agent, communicating with API servers and managing container operations.'
    }
  ],
  'AWS Cloud Fundamentals': [
    {
      id: 1,
      text: 'Which AWS service provides resizable, scalable virtual server nodes in the cloud?',
      options: ['EC2 (Elastic Compute Cloud)', 'S3 (Simple Storage Service)', 'RDS', 'Lambda'],
      correct: 0,
      explain: 'Amazon Elastic Compute Cloud (EC2) provisions scalable virtual servers called Instances.'
    },
    {
      id: 2,
      text: 'What is Amazon S3 primarily used to store?',
      options: [
        'Relational SQL records.',
        'Object-based raw data and media files (images, backups, static websites).',
        'Dynamic runtime scripts.',
        'Docker container registries.'
      ],
      correct: 1,
      explain: 'S3 (Simple Storage Service) is a highly-durable object storage service ideal for media files and backups.'
    },
    {
      id: 3,
      text: 'What is the utility of AWS IAM?',
      options: [
        'Managing secure access control, permissions, and user identities to AWS cloud resources.',
        'Monitoring server network speeds.',
        'Balancing traffic across nodes.',
        'Automatically backing up databases.'
      ],
      correct: 0,
      explain: 'Identity and Access Management (IAM) maps roles, users, and permissions ensuring secure resource operations.'
    },
    {
      id: 4,
      text: 'Which service serves as AWS\'s managed Relational Database service supporting Postgres and MySQL?',
      options: ['RDS', 'DynamoDB', 'Redshift', 'S3'],
      correct: 0,
      explain: 'RDS (Relational Database Service) automates scaling, patching, and provisioning of SQL engines.'
    },
    {
      id: 5,
      text: 'What is a main benefit of using AWS Lambda serverless computing?',
      options: [
        'It runs without requiring internet connections.',
        'You pay only for the exact computing time consumed by executing code on-demand, without provisioning servers.',
        'It provides infinite free disk space.',
        'It is faster than memory.'
      ],
      correct: 1,
      explain: 'Lambda runs code dynamically in response to triggers, executing workloads efficiently without server setups.'
    }
  ],
  'CI/CD with Jenkins & GitHub Actions': [
    {
      id: 1,
      text: 'What is a core goal of Continuous Integration (CI)?',
      options: [
        'Automating code merging and validating build integrity continually through test suites.',
        'Designing database tables.',
        'Uploading static assets manually.',
        'Monitoring user login durations.'
      ],
      correct: 0,
      explain: 'Continuous Integration automates code updates from multiple authors, running validations to block regression bugs.'
    },
    {
      id: 2,
      text: 'Which file configures automated build tasks and pipeline stages inside GitHub Actions?',
      options: ['A YAML file inside the .github/workflows directory', 'Jenkinsfile', 'docker-compose.yml', 'package.json'],
      correct: 0,
      explain: 'GitHub Actions scans YAML workflows inside .github/workflows to trigger build automation triggers.'
    },
    {
      id: 3,
      text: 'What is a "Runner" in CI/CD pipeline contexts?',
      options: [
        'A server or container running pipeline script tasks sequentially.',
        'A fast networking cable.',
        'A testing tool.',
        'A database partition.'
      ],
      correct: 0,
      explain: 'Runners act as worker hosts downloading workflows, executing build scripts, and uploading outputs.'
    },
    {
      id: 4,
      text: 'What is the utility of a "Jenkinsfile"?',
      options: [
        'It declares Jenkins pipelines as code, defining build, test, and deploy stages.',
        'It stores user lists.',
        'It minifies CSS code.',
        'It hosts static websites.'
      ],
      correct: 0,
      explain: 'A Jenkinsfile maps delivery pipelines as code, committing the CI/CD instructions to repository controls.'
    },
    {
      id: 5,
      text: 'Which pipeline stage runs after compiling and testing to deliver finalized code to cloud targets?',
      options: ['Deploy', 'Build', 'Lint', 'Syntax Check'],
      correct: 0,
      explain: 'The Deploy stage distributes validated compiled artifacts onto production or staging server environments.'
    }
  ],
  'Infrastructure as Code (Terraform)': [
    {
      id: 1,
      text: 'What is the main benefit of Infrastructure as Code (IaC)?',
      options: [
        'It replaces manual cloud console clicks with declarative, version-controlled configuration files.',
        'It reduces internet bandwidth costs.',
        'It runs server scripts twice as fast.',
        'It secures local client browsers.'
      ],
      correct: 0,
      explain: 'IaC ensures repeatable, transparent, and version-controlled provisioning of server topologies.'
    },
    {
      id: 2,
      text: 'Which language does HashiCorp Terraform use to write manifests?',
      options: ['HCL (HashiCorp Configuration Language)', 'Python', 'JSON', 'YAML'],
      correct: 0,
      explain: 'Terraform declarations use HCL, an elegant, human-readable declarative configuration syntax.'
    },
    {
      id: 3,
      text: 'What does "terraform init" do?',
      options: [
        'Prepares the local working directory by downloading provider plugins and configuring settings.',
        'Applies and provisions cloud VMs.',
        'Deletes provisioned infrastructure.',
        'Compiles Docker containers.'
      ],
      correct: 0,
      explain: 'terraform init initializes workspaces, downloading resource plug-ins (like AWS, Azure) to local folders.'
    },
    {
      id: 4,
      text: 'What is the utility of the "terraform.tfstate" file?',
      options: [
        'It records maps of declared resources to actual real-world provisioned cloud infrastructure.',
        'It is a database index.',
        'It holds environment credentials.',
        'It builds static templates.'
      ],
      correct: 0,
      explain: 'Terraform uses state files to verify current infrastructure configurations against declared blueprints.'
    },
    {
      id: 5,
      text: 'Which command displays the execution plan detailing what resources will be created or modified?',
      options: ['terraform plan', 'terraform apply', 'terraform show', 'terraform validate'],
      correct: 0,
      explain: 'terraform plan calculates and renders transactional logs of planned resource creations or removals.'
    }
  ],

  // --- QA SOLUTIONS ---
  'Introduction to QA Testing': [
    {
      id: 1,
      text: 'What is the primary difference between Black-Box and White-Box testing?',
      options: [
        'Black-box is only for mobile apps; White-box is for desktop.',
        'Black-box tests functionalities without internal code visibility; White-box tests internal structures and paths.',
        'White-box testing is always done manually.',
        'There is no difference.'
      ],
      correct: 1,
      explain: 'Black-box testing asserts inputs and outputs without knowing class implementations. White-box tests control flows.'
    },
    {
      id: 2,
      text: 'Which phase of Software Testing occurs first under standard QA lifecycles?',
      options: ['Unit Testing', 'Integration Testing', 'System Testing', 'UAT (User Acceptance Testing)'],
      correct: 0,
      explain: 'Unit testing isolated functions/methods occurs first, preceding integration and system-level validations.'
    },
    {
      id: 3,
      text: 'What does "Regression Testing" mean?',
      options: [
        'Re-running test suites after code changes to ensure existing features were not broken by updates.',
        'Testing speed benchmarks.',
        'Writing manual documentation.',
        'Validating security database access.'
      ],
      correct: 0,
      explain: 'Regression testing asserts that new code additions did not introduce bugs into previously stable features.'
    },
    {
      id: 4,
      text: 'What is the purpose of User Acceptance Testing (UAT)?',
      options: [
        'To verify that the application meets business criteria and is approved by end-users or clients.',
        'To compile the deployment packages.',
        'To audit database query indexes.',
        'To test server hardware specs.'
      ],
      correct: 0,
      explain: 'UAT is the final gate validating that workflows align with actual operational requirements prior to production launches.'
    },
    {
      id: 5,
      text: 'Which bug classification describes a flaw that completely stops application usage?',
      options: ['Blocker / Critical', 'Major', 'Minor', 'Cosmetic'],
      correct: 0,
      explain: 'Blockers freeze main business cycles, requiring immediate hotfix resolutions before release.'
    }
  ],
  'Automation Testing with Selenium': [
    {
      id: 1,
      text: 'Which Selenium component directly communicates with web browsers to execute test steps?',
      options: ['WebDriver', 'Selenium IDE', 'Selenium Grid', 'Selenium RC'],
      correct: 0,
      explain: 'Selenium WebDriver acts as a browser controller, triggering clicks, inputs, and navigations via native drivers.'
    },
    {
      id: 2,
      text: 'Which selector mechanism is most resilient if HTML element IDs are absent?',
      options: ['XPath or CSS Selectors', 'Class Names', 'Tag Names', 'Link Text'],
      correct: 0,
      explain: 'XPath and CSS selectors offer powerful path traversal patterns to isolate elements reliably.'
    },
    {
      id: 3,
      text: 'What is a "Page Object Model" (POM) in automation frameworks?',
      options: [
        'A design pattern where web pages are represented as classes, isolating selectors and actions to prevent code repetition.',
        'A database model.',
        'A CSS grid layout.',
        'A container build tool.'
      ],
      correct: 0,
      explain: 'POM decouples test scripts from page-specific element selectors, ensuring high framework maintainability.'
    },
    {
      id: 4,
      text: 'How do you handle dynamic asynchronous content loading in Selenium?',
      options: ['Explicit Waits', 'Thread.sleep()', 'Implicit Waits', 'Manual pauses'],
      correct: 0,
      explain: 'Explicit Waits pause script executions until exact DOM assertions or elements are present, avoiding volatile pauses.'
    },
    {
      id: 5,
      text: 'What does Selenium Grid do?',
      options: [
        'It allows running automation tests across different machine hosts, browsers, and operating systems in parallel.',
        'It stores test data.',
        'It generates CSS stylesheets.',
        'It minifies script assets.'
      ],
      correct: 0,
      explain: 'Selenium Grid balances parallel test workloads across remote browser instances, drastically reducing validation times.'
    }
  ],
  'Modern QA with Cypress': [
    {
      id: 1,
      text: 'What is a main architectural benefit of Cypress compared to Selenium?',
      options: [
        'Cypress runs directly inside the same browser execution loop as your application, providing ultra-fast and reliable testing.',
        'Cypress does not require JavaScript.',
        'Cypress only runs offline.',
        'Cypress uses database connections to load pages.'
      ],
      correct: 0,
      explain: 'Cypress executes inside the browser process, giving direct access to DOM nodes, network calls, and application states.'
    },
    {
      id: 2,
      text: 'Which command is standard for finding and selecting an element in Cypress?',
      options: ['cy.get()', 'cy.find()', 'cy.select()', 'cy.element()'],
      correct: 0,
      explain: 'cy.get(selector) fetches DOM elements, implicitly waiting until boundaries exist or timing out.'
    },
    {
      id: 3,
      text: 'How do you trigger a click event on a button in Cypress?',
      options: ['cy.get("button").click()', 'cy.click("button")', 'cy.get("button").trigger()', 'click()'],
      correct: 0,
      explain: 'Chaining .click() onto cy.get() asserts click actions against the queried web element.'
    },
    {
      id: 4,
      text: 'What is "Time Travel" in the Cypress Test Runner?',
      options: [
        'The ability to click through the command log to see interactive snapshots of your application at each step of the test.',
        'A fast clock synchronization script.',
        'A backup database command.',
        'A server optimization protocol.'
      ],
      correct: 0,
      explain: 'Cypress takes screenshots at each transactional event, allowing users to hover over commands and trace rendering histories.'
    },
    {
      id: 5,
      text: 'Which file contains Cypress spec test suites by default?',
      options: ['Files inside the cypress/e2e or cypress/integration directories', 'cypress.config.js', 'package.json', 'index.html'],
      correct: 0,
      explain: 'Cypress organizes active test scripts inside spec files under cypress/e2e by default.'
    }
  ],
  'REST API Testing with Postman': [
    {
      id: 1,
      text: 'What is the primary utility of Postman in software development?',
      options: [
        'To build, debug, validate, and automate testing of RESTful APIs.',
        'To host web servers.',
        'To compile React components.',
        'To manage network databases.'
      ],
      correct: 0,
      explain: 'Postman is an API client and automation suite enabling fast endpoint requests, mock servers, and schema checks.'
    },
    {
      id: 2,
      text: 'Where do you write automated assertion scripts for checking HTTP response status codes in Postman?',
      options: ['Tests tab', 'Pre-request Script tab', 'Headers tab', 'Body tab'],
      correct: 0,
      explain: 'The "Tests" tab executes JavaScript snippets immediately upon receiving responses to assert status codes or payloads.'
    },
    {
      id: 3,
      text: 'Which JavaScript assertion asserts that a status code is 200 inside Postman?',
      options: [
        'pm.response.to.have.status(200);',
        'assert(status == 200);',
        'response.code.is(200);',
        'pm.status(200);'
      ],
      correct: 0,
      explain: 'pm.response.to.have.status(200) is the standard Chai-assertion syntax in Postman.'
    },
    {
      id: 4,
      text: 'What are "Environment Variables" used for in Postman?',
      options: [
        'To store and switch values (like API base URLs or tokens) dynamically across different stages (Dev, QA, Prod).',
        'To load CSS styles.',
        'To restart server nodes.',
        'To compile Docker images.'
      ],
      correct: 0,
      explain: 'Postman environments isolate variables, avoiding hardcoding URLs or tokens inside static requests.'
    },
    {
      id: 5,
      text: 'What is "Newman" in the Postman ecosystem?',
      options: [
        'A CLI tool enabling running Postman collections directly from terminal lines and CI/CD pipelines.',
        'A database engine.',
        'An encryption method.',
        'A server dashboard.'
      ],
      correct: 0,
      explain: 'Newman is a Node CLI wrapper executing Postman schemas inside terminal scripts and build workflows.'
    }
  ],
  'Performance Testing Basics': [
    {
      id: 1,
      text: 'What is the primary objective of "Load Testing"?',
      options: [
        'Asserting how backend systems perform under expected real-world concurrent user volumes.',
        'Validating button CSS colors.',
        'Writing manual bug tickets.',
        'Testing database column limits.'
      ],
      correct: 0,
      explain: 'Load testing validates response latencies and server load metrics when subjected to target client traffic rates.'
    },
    {
      id: 2,
      text: 'What is "Stress Testing" designed to find?',
      options: [
        'The maximum load capacity boundaries where server systems crash, fail, or degrade.',
        'Syntactical Javascript bugs.',
        'Unused style variables.',
        'User login credentials.'
      ],
      correct: 0,
      explain: 'Stress tests push applications past operational thresholds to assess recovery behaviors and bottleneck locations.'
    },
    {
      id: 3,
      text: 'Which metrics are critical to monitor during a performance test?',
      options: [
        'Response Time, Throughput (TPS), CPU Usage, and Error Rate.',
        'Visual layout alignments.',
        'HTML tag count.',
        'Line count in files.'
      ],
      correct: 0,
      explain: 'Latency, Transaction Rate (TPS), System resource bounds (RAM/CPU), and response errors map performance health.'
    },
    {
      id: 4,
      text: 'Which open-source Java application is standard for load testing server APIs?',
      options: ['Apache JMeter', 'Selenium', 'Postman', 'Cypress'],
      correct: 0,
      explain: 'Apache JMeter is a Java tool simulating high concurrency to benchmark web services and databases.'
    },
    {
      id: 5,
      text: 'What does "Latency" represent in performance testing?',
      options: [
        'The round-trip delay time from sending a request to the arrival of the first byte of response.',
        'The image size.',
        'The database storage capacity.',
        'The network line thickness.'
      ],
      correct: 0,
      explain: 'Latency measures transaction overheads, indicating how quickly servers begin transmitting responses.'
    }
  ],

  // --- DESIGN SOLUTIONS ---
  'UI/UX Design Essentials': [
    {
      id: 1,
      text: 'What is the primary difference between UI and UX design?',
      options: [
        'UI is only for web apps; UX is for mobile.',
        'UI handles the visual look and interfaces (color, typography); UX covers user experience, flows, and usability.',
        'UX is always programmed; UI is drawn.',
        'There is no difference.'
      ],
      correct: 1,
      explain: 'User Interface (UI) maps interactive controls, grids, and themes. User Experience (UX) structures layouts and workflows.'
    },
    {
      id: 2,
      text: 'Which design concept describes the visual weight and placement prioritizing important interface elements?',
      options: ['Visual Hierarchy', 'Color Theory', 'Grid Systems', 'Responsive Scaling'],
      correct: 0,
      explain: 'Visual Hierarchy guides user focuses towards primary actions using sizes, colors, and positioning.'
    },
    {
      id: 3,
      text: 'What is a "User Persona" in design stages?',
      options: [
        'A semi-fictional profile representing a target user segment based on customer research data.',
        'A user authorization role.',
        'A CSS component selector.',
        'A backup database folder.'
      ],
      correct: 0,
      explain: 'Personas model actual customer expectations, helping designers trace user scenarios and flows.'
    },
    {
      id: 4,
      text: 'Which term represents the step-by-step visual map representing user journeys through an application?',
      options: ['User Flow / Wireframe Map', 'CSS Grid', 'Figma Template', 'Style token'],
      correct: 0,
      explain: 'User Flows diagram exact navigation pathways, detailing client interactions to complete tasks.'
    },
    {
      id: 5,
      text: 'Why are wireframes useful during design phases?',
      options: [
        'They allow rapid, low-fidelity prototyping of layouts without getting distracted by colors and style details.',
        'They run tests automatically.',
        'They compile clean javascript.',
        'They create database tables.'
      ],
      correct: 0,
      explain: 'Wireframes isolate structural arrangements, optimizing user flows before investing in visual styles.'
    }
  ],
  'Mastering Figma for Designers': [
    {
      id: 1,
      text: 'What is a primary benefit of using Figma for product design?',
      options: [
        'It operates as a cloud-based vector design suite, enabling real-time collaboration.',
        'It compiles Python code directly.',
        'It doesn\'t require internet access.',
        'It manages SQL server configurations.'
      ],
      correct: 0,
      explain: 'Figma facilitates cloud workspaces where multiple designers can concurrent-author vector components.'
    },
    {
      id: 2,
      text: 'Which feature in Figma automatically adjusts layouts when elements grow, shrink, or wrap?',
      options: ['Auto Layout', 'Constraints', 'Variants', 'Smart Animate'],
      correct: 0,
      explain: 'Auto Layout creates dynamic, responsive frames aligning children with padding and spacing parameters.'
    },
    {
      id: 3,
      text: 'What is a "Component" in Figma?',
      options: [
        'A reusable design element (like a button or card) that synchronizes changes across all instances.',
        'A package manager.',
        'A database index.',
        'A background worker.'
      ],
      correct: 0,
      explain: 'Components establish parent templates. Updating parent properties propagates revisions to child instances.'
    },
    {
      id: 4,
      text: 'How do you define multiple states of a single component (e.g., Default, Hover, Active) in Figma?',
      options: ['Component Variants', 'Frames', 'Vector paths', 'Smart guides'],
      correct: 0,
      explain: 'Component Variants organize variations of reusable assets under unified property schemas.'
    },
    {
      id: 5,
      text: 'Which option generates CSS and styling specifications for developers inside Figma?',
      options: ['Inspect Panel / Dev Mode', 'Properties panel', 'Export tab', 'Layers panel'],
      correct: 0,
      explain: 'Figma Dev Mode parses visual attributes into CSS rules, aiding front-end transitions.'
    }
  ],
  'High-Fidelity Prototyping': [
    {
      id: 1,
      text: 'What is a "High-Fidelity Prototype"?',
      options: [
        'An interactive simulation of a product that closely matches the visual design, animations, and flows of the final software.',
        'A black-and-white sketch.',
        'A server script.',
        'A database snapshot.'
      ],
      correct: 0,
      explain: 'High-fidelity prototypes feature premium interactions, graphic details, and copy resembling completed applications.'
    },
    {
      id: 2,
      text: 'Which Figma transition feature matches identical layers across prototype screens to animate movements smoothly?',
      options: ['Smart Animate', 'Instant transition', 'Slide in', 'Dissolve'],
      correct: 0,
      explain: 'Smart Animate scans identical layer names, interpolating positions, rotations, and sizes automatically.'
    },
    {
      id: 3,
      text: 'What is a "Trigger" in prototyping interactions?',
      options: [
        'An event (like On Click, On Hover, or On Drag) that initiates a visual screen transition.',
        'A database procedure.',
        'A CSS transition variable.',
        'A backup file trigger.'
      ],
      correct: 0,
      explain: 'Triggers listen for user inputs, launching configured transition animations.'
    },
    {
      id: 4,
      text: 'Why do designers test high-fidelity prototypes with users?',
      options: [
        'To observe realistic interactions and identify usability problems before starting expensive software engineering phases.',
        'To write unit tests.',
        'To configure server clusters.',
        'To optimize SQL index speeds.'
      ],
      correct: 0,
      explain: 'Prototypes validate usability inexpensively, verifying features and layouts ahead of engineering.'
    },
    {
      id: 5,
      text: 'Which interaction preserves a header fixed at the top of the viewport when users scroll prototypes?',
      options: ['Fix position when scrolling', 'Auto-Layout wrapper', 'Smart Animate', 'Overflow scroll'],
      correct: 0,
      explain: '"Fix position when scrolling" pins target visual elements, preventing vertical translations.'
    }
  ],
  'Visual Design Fundamentals': [
    {
      id: 1,
      text: 'Which concept describes the visual spacing rules separating design items, preventing cluttered interfaces?',
      options: ['Whitespace / Negative Space', 'Alignment', 'Contrast', 'Typography Scale'],
      correct: 0,
      explain: 'Whitespace coordinates layouts, giving elements space to breathe and reducing visual fatigue.'
    },
    {
      id: 2,
      text: 'What is a "Complementary" color scheme?',
      options: [
        'Colors directly opposite each other on the color wheel, creating high contrast and vibrant designs.',
        'Colors adjacent to each other.',
        'Three colors equally spaced.',
        'Black, white, and gray.'
      ],
      correct: 0,
      explain: 'Complementary colors pair opposites (like orange and blue) producing high visual pops.'
    },
    {
      id: 3,
      text: 'What does "Typography Hierarchy" establish?',
      options: [
        'Clear reading guidance, showing users which text is most important through sizes, weights, and line heights.',
        'Automatic spelling corrections.',
        'Hashed password encryption.',
        'Fast page load speeds.'
      ],
      correct: 0,
      explain: 'Typography scales organize text, steering readers easily from headlines to secondary sections.'
    },
    {
      id: 4,
      text: 'Which design fundamental guides the consistent placement of elements along visual axes to create structure?',
      options: ['Alignment / Grids', 'Colors', 'Typography', 'Shadows'],
      correct: 0,
      explain: 'Grids and alignments anchor elements, delivering symmetry and structural patterns.'
    },
    {
      id: 5,
      text: 'What is "Contrast" in visual layouts?',
      options: [
        'The degree of difference between design elements (like dark text on light backgrounds) to preserve readability.',
        'The width of containers.',
        'The size of images.',
        'The server response latency.'
      ],
      correct: 0,
      explain: 'Contrast ensures that items stand out against background layers, guaranteeing accessibility.'
    }
  ],
  'Designing for Accessibility': [
    {
      id: 1,
      text: 'What does "WCAG" stand for?',
      options: [
        'Web Content Accessibility Guidelines',
        'World Consortium Accessibility Guidelines',
        'Web Client Audio Group',
        'Wide Web Access Codes'
      ],
      correct: 0,
      explain: 'WCAG provides international standards for making web content accessible to individuals with disabilities.'
    },
    {
      id: 2,
      text: 'According to WCAG AA standards, what is the minimum contrast ratio required for normal text?',
      options: ['4.5:1', '3.0:1', '7.0:1', '2.0:1'],
      correct: 0,
      explain: 'WCAG AA requires a contrast ratio of at least 4.5:1 for standard body copy text.'
    },
    {
      id: 3,
      text: 'What is a "Screen Reader"?',
      options: [
        'An assistive software that reads out loud the text, buttons, and semantic attributes displayed on computer screens.',
        'A hardware monitor.',
        'A browser code validator.',
        'A database log scanner.'
      ],
      correct: 0,
      explain: 'Screen Readers parse structural DOM elements, translating them into speech for visually impaired users.'
    },
    {
      id: 4,
      text: 'Why are Alt tags critical on images for accessibility compliance?',
      options: [
        'They describe image content to screen readers, allowing visually impaired users to understand graphic assets.',
        'They speed up page loading.',
        'They reduce server host storage sizes.',
        'They serve as styling class names.'
      ],
      correct: 0,
      explain: 'Alt properties act as text translations of imagery, enabling screen readers to speak the description.'
    },
    {
      id: 5,
      text: 'Which key is standard for navigating between interactive elements without using mouse pointers?',
      options: ['Tab key', 'Spacebar', 'Enter key', 'Arrow keys'],
      correct: 0,
      explain: 'The Tab key steps focus between links, forms, and buttons in standard accessibility configurations.'
    }
  ]
};

const ExamCenter = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const examId = searchParams.get('cert');
  const customTitle = searchParams.get('title');

  // Dynamic list of all 24 certification exams
  const ALL_EXAMS_LIST = useMemo(() => {
    const list = [];
    
    // Add the 21 course-specific exams first
    Object.keys(COURSE_QUESTIONS_POOL).forEach(title => {
      const baseQuestions = COURSE_QUESTIONS_POOL[title];
      
      // Uneven question counts: dynamically slice between 3, 4, and 5 questions based on title characteristics
      const count = (title.length % 3) + 3;
      const questions = baseQuestions.slice(0, count);
      
      let cert = 'sitecore';
      let theme = 'backend';
      let categoryName = 'BACKEND';
      
      const frontendTitles = [
        'HTML & CSS Fundamentals',
        'Advanced HTML & Semantic Markup',
        'Advanced CSS, Flexbox & Grid',
        'Responsive Design & Mobile First',
        'Web Accessibility & Semantics'
      ];
      
      const devopsTitles = [
        'DevOps Pipelines & Infrastructure',
        'Git & GitHub Workflows',
        'Docker Containerization',
        'Kubernetes Basics',
        'CI/CD with GitHub Actions',
        'AWS Cloud Deployment'
      ];
      
      if (frontendTitles.includes(title)) {
        cert = 'frontend';
        theme = 'frontend';
        categoryName = 'FRONTEND';
      } else if (devopsTitles.includes(title)) {
        cert = 'devops';
        theme = 'devops';
        categoryName = 'DEVOPS';
      }
      
      // Refined Field-Based Theme Mapping
      if (title.includes('HTML') || title.includes('CSS') || title.includes('Responsive') || title.includes('Accessibility')) {
        theme = 'frontend';
      } else if (title.includes('DevOps') || title.includes('Git') || title.includes('Docker') || title.includes('Kubernetes') || title.includes('CI/CD')) {
        theme = 'devops';
      } else if (title.includes('Java') || title.includes('Spring')) {
        theme = 'java';
        categoryName = 'JAVA API';
      } else if (title.includes('SQL') || title.includes('Relational Database')) {
        theme = 'database';
        categoryName = 'SQL DATABASE';
      } else if (title.includes('Node') || title.includes('Express') || title.includes('Microservices')) {
        theme = 'node';
        categoryName = 'NODEJS API';
      } else if (title.includes('Django')) {
        theme = 'python';
        categoryName = 'PYTHON API';
      } else if (title.includes('MongoDB') || title.includes('NoSQL')) {
        theme = 'nosql';
        categoryName = 'NOSQL DATABASE';
      } else if (title.includes('.NET') || title.includes('C#')) {
        theme = 'dotnet';
        categoryName = 'DOTNET API';
      } else if (title.includes('AWS') || title.includes('Cloud')) {
        theme = 'aws';
        categoryName = 'AWS CLOUD';
      }
      
      list.push({
        cert,
        title,
        theme,
        duration: 300,
        categoryName,
        questions
      });
    });

    // Add the three base general exams
    list.push({
      cert: 'frontend',
      title: 'Modern Frontend Architecture & HTML/CSS Certification',
      theme: 'general',
      duration: 300,
      categoryName: 'GENERAL FRONTEND',
      questions: EXAM_DATA.frontend.questions
    });
    list.push({
      cert: 'sitecore',
      title: 'Sitecore DAM & Content Hub Professional Certification',
      theme: 'general',
      duration: 300,
      categoryName: 'GENERAL BACKEND',
      questions: EXAM_DATA.sitecore.questions
    });
    list.push({
      cert: 'devops',
      title: 'DevOps Infrastructure & CI/CD Pipeline Certification',
      theme: 'general',
      duration: 300,
      categoryName: 'GENERAL DEVOPS',
      questions: EXAM_DATA.devops.questions
    });
    
    return list;
  }, []);

  // Session & User management
  const session = JSON.parse(localStorage.getItem('user_session') || 'null');
  const allUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
  const currentUser = allUsers.find(u => u.email === session?.email) || {};
  const fullName = currentUser.firstName ? `${currentUser.firstName} ${currentUser.lastName}` : "Valued Professional";

  // Exam taking state
  const activeExam = useMemo(() => {
    if (!examId) return null;
    
    const baseTitle = customTitle ? decodeURIComponent(customTitle) : (EXAM_DATA[examId]?.title || 'Horizontal Crossover Exam');
    
    // Check if we have exact questions for this specific course title in ALL_EXAMS_LIST
    const matched = ALL_EXAMS_LIST.find(x => x.title === baseTitle);
    if (matched) {
      return {
        title: baseTitle,
        theme: matched.theme,
        duration: 300,
        questions: matched.questions
      };
    }
    
    // Fallback to old generic exams if specific course questions don't exist
    if (!EXAM_DATA[examId]) return null;
    const baseExam = { ...EXAM_DATA[examId] };
    baseExam.theme = 'general';
    if (customTitle) {
      baseExam.title = decodeURIComponent(customTitle);
    }
    return baseExam;
  }, [examId, customTitle, ALL_EXAMS_LIST]);
  const [inProgress, setInProgress] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [examFinished, setExamFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [claimed, setClaimed] = useState(false);

  // Dynamic eligibility checking
  const [eligible, setEligible] = useState(false);
  const [eligibilityLoading, setEligibilityLoading] = useState(false);
  const [requiredCourseName, setRequiredCourseName] = useState('');
  const [requiredCourseId, setRequiredCourseId] = useState('');

  // Course translation for error message
  const COURSE_NAMES_MAP = {
    'html-css': 'HTML & CSS Fundamentals',
    'backend-rest': 'RESTful API & Database Architecture',
    'devops-pipeline': 'DevOps Pipelines & Infrastructure'
  };

  useEffect(() => {
    if (!examId) return;

    async function loadEligibility() {
      try {
        setEligibilityLoading(true);
        const data = await checkExamEligibility(examId);
        
        let isEligible = data.eligible;
        if (customTitle) {
          const actualTitle = decodeURIComponent(customTitle);
          // Translate cert ID to course ID
          const cId = examId === 'frontend' ? 'html-css' : examId === 'sitecore' ? 'backend-rest' : 'devops-pipeline';
          const progressKey = `progress_${cId}_${actualTitle.replace(/\s+/g, '_')}`;
          const localProgress = JSON.parse(localStorage.getItem(progressKey) || 'null');
          
          if (localProgress) {
            isEligible = localProgress.completed === true;
          }
        }
        
        setEligible(isEligible);
        setRequiredCourseId(data.requiredCourse);
        setRequiredCourseName(customTitle ? decodeURIComponent(customTitle) : (COURSE_NAMES_MAP[data.requiredCourse] || 'corresponding training module'));
      } catch (err) {
        console.error("Eligibility check failed:", err);
        if (err.message.toLowerCase().includes('unauthorized') || err.message.toLowerCase().includes('session')) {
          navigate('/login');
        }
      } finally {
        setEligibilityLoading(false);
      }
    }

    loadEligibility();
  }, [examId, customTitle, navigate]);

  // Active Countdown Timer effect
  useEffect(() => {
    if (!inProgress || examFinished || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [inProgress, examFinished, timeLeft]);

  // Formatter for timer minutes/seconds
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins}:${remaining < 10 ? '0' : ''}${remaining}`;
  };

  const handleStartExam = () => {
    if (!activeExam || !eligible) return;
    setAnswers({});
    setCurrentIdx(0);
    setTimeLeft(activeExam.duration);
    setInProgress(true);
    setExamFinished(false);
    setShowExplanation(false);
    setClaimed(false);
  };

  const handleSelectOption = (optIdx) => {
    setAnswers(prev => ({ ...prev, [currentIdx]: optIdx }));
  };

  const handleSubmitExam = () => {
    if (!activeExam) return;
    setInProgress(false);
    setExamFinished(true);

    // Calculate score
    let correctCount = 0;
    activeExam.questions.forEach((q, idx) => {
      if (answers[idx] === q.correct) {
        correctCount++;
      }
    });

    setScore(correctCount);
  };

  const handleClaimCertification = async () => {
    if (claimed || !activeExam) return;

    try {
      // Securely record score and certification in PostgreSQL backend!
      await saveExamScore(examId, score, activeExam.title, activeExam.questions.length);
      setClaimed(true);

      // Local storage fallback sync to keep retro state matching
      const updatedUsers = allUsers.map(u => {
        if (u.email === currentUser.email) {
          const certs = u.certifications || [];
          if (!certs.some(c => c.name === activeExam.title)) {
            certs.push({
              name: activeExam.title,
              date: new Date().toISOString().split('T')[0]
            });
          }
          return { ...u, certifications: certs };
        }
        return u;
      });
      localStorage.setItem('registered_users', JSON.stringify(updatedUsers));

      // Redirect after animation complete
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
    } catch (err) {
      console.error("Database save failed:", err);
      alert(err.message || "Failed to record certification.");
    }
  };

  // Check passing percentage (need 80% to pass -> 4/5 questions correct)
  const isPassed = activeExam ? score >= Math.ceil(activeExam.questions.length * 0.8) : false;

  // Selected Badge Color Scheme
  const badgeTheme = useMemo(() => {
    const t = activeExam?.theme || 'general';
    if (t === 'frontend') return { primary: '#7FC3BA', secondary: '#2F2D2E', gradient: 'url(#frontendGrad)' };
    if (t === 'devops') return { primary: '#C084FC', secondary: '#4C1D95', gradient: 'url(#devopsGrad)' };
    if (t === 'java') return { primary: '#F97316', secondary: '#431407', gradient: 'url(#javaGrad)' };
    if (t === 'database') return { primary: '#06B6D4', secondary: '#083344', gradient: 'url(#databaseGrad)' };
    if (t === 'node') return { primary: '#10B981', secondary: '#064E3B', gradient: 'url(#nodeGrad)' };
    if (t === 'python') return { primary: '#14B8A6', secondary: '#042F2E', gradient: 'url(#pythonGrad)' };
    if (t === 'nosql') return { primary: '#22C55E', secondary: '#064E3B', gradient: 'url(#nosqlGrad)' };
    if (t === 'dotnet') return { primary: '#EC4899', secondary: '#500724', gradient: 'url(#dotnetGrad)' };
    if (t === 'aws') return { primary: '#EAB308', secondary: '#422006', gradient: 'url(#awsGrad)' };
    return { primary: '#FBBF24', secondary: '#78350F', gradient: 'url(#sitecoreGrad)' };
  }, [activeExam]);

  return (
    <div className={styles.wrapper}>
      <AppHeader />

      <main className={styles.mainContent}>
        <div className={styles.centeredContainer}>
          
          <div className={styles.breadcrumb}>
            <Link to="/home" className={styles.linkHome}>Home</Link>
            <span className={styles.linkSeparator}> | </span>
            <Link to="/certification" className={styles.linkHome}>Certification</Link>
            <span className={styles.linkSeparator}> | </span>
            <span className={styles.linkActive}>Exam Center</span>
          </div>

          <div className={styles.headerBlock}>
            <img src={accentBar} alt="accent" className={styles.accentBar} />
            <h1 className={styles.pageTitle}>Horizontal Exam Center</h1>
            <p className={styles.pageSubtitle}>
              Validate your knowledge crossover and earn formal certifications. Score 80% or higher to unlock professional badges.
            </p>
          </div>

          {/* Catalog view */}
          {!examId && (
            <section className={styles.catalogGrid}>
              {ALL_EXAMS_LIST.map((item, idx) => {
                const passReq = Math.ceil(item.questions.length * 0.8);
                return (
                  <div key={idx} className={styles.catalogCard}>
                    <div className={`${styles.themeStrip} ${styles[item.theme]}`}></div>
                    <div className={styles.cardBody}>
                      <h3 className={styles.cardTitle}>{item.title}</h3>
                      <p className={styles.cardDesc}>
                        Validate core capabilities under {item.categoryName}. Requires passing {passReq} out of {item.questions.length} questions.
                      </p>
                      <div className={styles.cardMeta}>
                        <span>⏱ {item.duration / 60} minutes</span>
                        <span>📋 {item.questions.length} questions</span>
                      </div>
                      <Button 
                        onClick={() => navigate(`/exams?cert=${item.cert}&title=${encodeURIComponent(item.title)}`)} 
                        className={styles.startBtn}
                      >
                        Select Exam
                      </Button>
                    </div>
                  </div>
                );
              })}
            </section>
          )}

          {/* Selection Welcome page for specific exam */}
          {examId && !inProgress && !examFinished && (
            <div className={styles.startPanel}>
              <div className={styles.panelOverlay}>
                <h2 className={styles.panelTitle}>{activeExam?.title}</h2>
                <div className={styles.rulesList}>
                  <div className={styles.ruleItem}>
                    <span className={styles.ruleIcon}>⏱</span>
                    <div>
                      <h4>Time Limit</h4>
                      <p>{activeExam ? activeExam.duration / 60 : 5} minutes continuous countdown. Timer cannot be paused.</p>
                    </div>
                  </div>
                  <div className={styles.ruleItem}>
                    <span className={styles.ruleIcon}>🎯</span>
                    <div>
                      <h4>Target Score</h4>
                      <p>Requires scoring 80% ({activeExam ? Math.ceil(activeExam.questions.length * 0.8) : 4} / {activeExam ? activeExam.questions.length : 5} correct answers) to pass.</p>
                    </div>
                  </div>
                  <div className={styles.ruleItem}>
                    <span className={styles.ruleIcon}>🎓</span>
                    <div>
                      <h4>Validation</h4>
                      <p>Earned certifications are dynamically pinned directly to your employee profile in local records.</p>
                    </div>
                  </div>
                </div>

                {/* Database course completion locks */}
                {eligibilityLoading ? (
                  <div style={{ padding: '20px', textAlign: 'center', color: '#6F6D6E', fontFamily: 'inherit', fontWeight: 'bold' }}>
                    🔄 Querying course watch logs in database...
                  </div>
                ) : !eligible ? (
                  <div style={{
                    backgroundColor: '#FEF2F2',
                    border: '1.5px solid #FCA5A5',
                    borderRadius: '8px',
                    padding: '20px',
                    marginBottom: '30px',
                    color: '#991B1B',
                    textAlign: 'left',
                    fontFamily: 'inherit'
                  }}>
                    <h4 style={{ margin: '0 0 6px 0', fontSize: '15px', fontWeight: 'bold', fontFamily: 'inherit' }}>🔒 Exam Locked</h4>
                    <p style={{ margin: 0, fontSize: '13.5px', lineHeight: '1.5', color: '#7F1D1D' }}>
                      You are not eligible to take this exam yet. You must complete 100% of the training lectures in the <strong>{requiredCourseName}</strong> course first!
                    </p>
                    <div style={{ marginTop: '15px' }}>
                      <Button onClick={() => navigate(`/course-details?id=${requiredCourseId}`)} style={{ padding: '8px 16px', fontSize: '12px', height: '36px', width: 'auto', backgroundColor: '#EF4444', borderColor: '#EF4444', color: '#FFF' }}>
                        Go to Course Page
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div style={{
                    backgroundColor: '#ECFDF5',
                    border: '1.5px solid #34D399',
                    borderRadius: '8px',
                    padding: '16px',
                    marginBottom: '30px',
                    color: '#065F46',
                    textAlign: 'left',
                    fontFamily: 'inherit',
                    fontSize: '13.5px'
                  }}>
                    🎉 <strong>Congratulations!</strong> You have successfully finished the required course videos and are unlocked to start this exam. Good luck!
                  </div>
                )}

                <div className={styles.btnRow}>
                  <Button 
                    onClick={handleStartExam} 
                    className={styles.panelBtn}
                    disabled={!eligible || eligibilityLoading}
                    style={{
                      backgroundColor: eligible ? '#7FC3BA' : '#CBD5E1',
                      borderColor: eligible ? '#7FC3BA' : '#CBD5E1',
                      color: eligible ? '#2F2D2E' : '#94A3B8',
                      cursor: eligible ? 'pointer' : 'not-allowed',
                      opacity: eligible ? 1 : 0.6
                    }}
                  >
                    Begin Exam Now
                  </Button>
                  <button onClick={() => navigate('/exams')} className={styles.backBtn}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Exam Progress interface */}
          {examId && inProgress && (
            <div className={styles.examPanel}>
              <div className={styles.examHeader}>
                <div className={styles.questionCounter}>
                  Question {currentIdx + 1} of {activeExam ? activeExam.questions.length : 5}
                </div>
                <div className={styles.timerBadge}>
                  ⏳ Time Remaining: {formatTime(timeLeft)}
                </div>
              </div>

              {/* Progress Bar */}
              <div className={styles.progressBarWrapper}>
                <div 
                  className={styles.progressBar} 
                  style={{ width: `${((currentIdx + 1) / (activeExam ? activeExam.questions.length : 5)) * 100}%` }}
                ></div>
              </div>

              {activeExam && (
                <div className={styles.questionBlock}>
                  <h3 className={styles.questionText}>
                    {activeExam.questions[currentIdx].text}
                  </h3>
                  
                  <div className={styles.optionsList}>
                    {activeExam.questions[currentIdx].options.map((opt, oIdx) => {
                      const isSelected = answers[currentIdx] === oIdx;
                      return (
                        <div 
                          key={oIdx}
                          className={`${styles.optionCard} ${isSelected ? styles.selected : ''}`}
                          onClick={() => handleSelectOption(oIdx)}
                        >
                          <span className={styles.optionChar}>
                            {String.fromCharCode(65 + oIdx)}
                          </span>
                          <span className={styles.optionText}>{opt}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className={styles.examNavigation}>
                <button 
                  onClick={() => setCurrentIdx(p => Math.max(0, p - 1))}
                  disabled={currentIdx === 0}
                  className={styles.prevBtn}
                >
                  Previous
                </button>
                
                {currentIdx < (activeExam ? activeExam.questions.length : 5) - 1 ? (
                  <button 
                    onClick={() => setCurrentIdx(p => Math.min((activeExam ? activeExam.questions.length : 5) - 1, p + 1))}
                    disabled={answers[currentIdx] === undefined}
                    className={styles.nextBtn}
                  >
                    Next Question
                  </button>
                ) : (
                  <Button 
                    onClick={handleSubmitExam}
                    disabled={answers[currentIdx] === undefined}
                    className={styles.submitBtn}
                  >
                    Submit Exam
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Exam Result screen */}
          {examId && examFinished && (
            <div className={styles.resultPanel}>
              
              {/* Dynamic Celebrations / Fail banners */}
              {isPassed ? (
                <div className={styles.successMessage}>
                  <div className={styles.successHeader}>
                    <img src={successTick} alt="" className={styles.successIcon} />
                    <h2 className={styles.successTitle}>Congratulations! You Passed!</h2>
                  </div>
                  <p className={styles.successSub}>
                    You scored {score} / {activeExam ? activeExam.questions.length : 5} ({activeExam ? Math.round((score / activeExam.questions.length) * 100) : 0}%). You have qualified for horizontal specialization certification!
                  </p>
                </div>
              ) : (
                <div className={styles.failMessage}>
                  <h2 className={styles.failTitle}>Exam Not Passed</h2>
                  <p className={styles.failSub}>
                    You scored {score} / {activeExam ? activeExam.questions.length : 5} ({activeExam ? Math.round((score / activeExam.questions.length) * 100) : 0}%). Requires at least 80% ({activeExam ? Math.ceil(activeExam.questions.length * 0.8) : 4} / {activeExam ? activeExam.questions.length : 5} correct) to unlock horizontal accreditation.
                  </p>
                </div>
              )}

              {/* Dynamic SVG Badge Rendering on Success */}
              {isPassed && (
                <div className={styles.badgeSection}>
                  <h3 className={styles.badgeSectionHeading}>Earned Certification Badge</h3>
                  
                  <div className={styles.badgeWrapper}>
                    <svg width="220" height="220" viewBox="0 0 200 200" className={styles.dynamicBadge}>
                      <defs>
                        <linearGradient id="frontendGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#7FC3BA" />
                          <stop offset="100%" stopColor="#4E9C92" />
                        </linearGradient>
                        <linearGradient id="devopsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#C084FC" />
                          <stop offset="100%" stopColor="#7C3AED" />
                        </linearGradient>
                        <linearGradient id="sitecoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#FBBF24" />
                          <stop offset="100%" stopColor="#D97706" />
                        </linearGradient>
                        <linearGradient id="javaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#F97316" />
                          <stop offset="100%" stopColor="#C2410C" />
                        </linearGradient>
                        <linearGradient id="databaseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#06B6D4" />
                          <stop offset="100%" stopColor="#0891B2" />
                        </linearGradient>
                        <linearGradient id="nodeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#10B981" />
                          <stop offset="100%" stopColor="#047857" />
                        </linearGradient>
                        <linearGradient id="pythonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#14B8A6" />
                          <stop offset="100%" stopColor="#0D9488" />
                        </linearGradient>
                        <linearGradient id="nosqlGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#22C55E" />
                          <stop offset="100%" stopColor="#15803D" />
                        </linearGradient>
                        <linearGradient id="dotnetGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#EC4899" />
                          <stop offset="100%" stopColor="#BE185D" />
                        </linearGradient>
                        <linearGradient id="awsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#EAB308" />
                          <stop offset="100%" stopColor="#A16207" />
                        </linearGradient>
                      </defs>

                      {/* Outer Ring */}
                      <circle cx="100" cy="100" r="90" fill="none" stroke={badgeTheme.primary} strokeWidth="6" />
                      <circle cx="100" cy="100" r="85" fill={badgeTheme.secondary} />
                      
                      {/* Gradient Inner Star / Diamond Ring */}
                      <polygon points="100,25 120,70 170,70 130,100 150,150 100,120 50,150 70,100 30,70 80,70" fill={badgeTheme.primary} opacity="0.15" />

                      {/* Concentric rings */}
                      <circle cx="100" cy="100" r="65" fill="none" stroke={badgeTheme.primary} strokeWidth="1.5" strokeDasharray="3 3" />
                      <circle cx="100" cy="100" r="60" fill={badgeTheme.gradient} />

                      {/* Badge Text */}
                      <text x="100" y="80" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="700" letterSpacing="0.8">
                        HORIZONTAL
                      </text>
                      <text x="100" y="96" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="bold">
                        {activeExam?.theme ? activeExam.theme.toUpperCase() : 'SPECIALIST'}
                      </text>
                      <text x="100" y="112" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="700" letterSpacing="0.8">
                        SPECIALIST
                      </text>

                      {/* Gold Ribbon Label */}
                      <rect x="35" y="132" width="130" height="22" rx="4" fill={badgeTheme.secondary} stroke={badgeTheme.primary} strokeWidth="1" />
                      <text x="100" y="146" textAnchor="middle" fill={badgeTheme.primary} fontSize="8" fontWeight="bold" letterSpacing="0.2">
                        {fullName.toUpperCase().substring(0, 18)}
                      </text>
                      
                      {/* Date label */}
                      <text x="100" y="172" textAnchor="middle" fill="#A0AEC0" fontSize="7">
                        ISSUED: {new Date().toLocaleDateString('en-GB')}
                      </text>
                    </svg>
                  </div>

                  {claimed ? (
                    <div className={styles.claimedAlert}>
                      🛡 Badge claimed successfully! Adding to employee certifications portfolio. Redirecting...
                    </div>
                  ) : (
                    <Button onClick={handleClaimCertification} className={styles.claimBtn}>
                      Claim Badge & Pin to Profile
                    </Button>
                  )}
                </div>
              )}

              {/* Quiz Corrections / Explanations section */}
              <div className={styles.correctionsSection}>
                <h3 className={styles.correctionsHeading}>Exam Review</h3>
                <div className={styles.btnRow} style={{ justifyContent: 'flex-start', marginBottom: '20px' }}>
                  <button 
                    onClick={() => setShowExplanation(!showExplanation)}
                    className={styles.toggleExplanationsBtn}
                  >
                    {showExplanation ? 'Hide Correct Answers' : 'View Correct Answers & Explanations'}
                  </button>
                </div>

                {showExplanation && activeExam && (
                  <div className={styles.correctionsList}>
                    {activeExam.questions.map((q, idx) => {
                      const userAns = answers[idx];
                      const isCorrect = userAns === q.correct;
                      
                      return (
                        <div 
                          key={q.id} 
                          className={`${styles.correctionItem} ${isCorrect ? styles.correctNode : styles.wrongNode}`}
                        >
                          <h4 className={styles.correctionQuestion}>
                            Q{idx + 1}: {q.text}
                          </h4>
                          
                          <div className={styles.answersBlock}>
                            <p>
                              <strong>Your Answer:</strong> {userAns !== undefined ? q.options[userAns] : 'Not Answered'} 
                              {isCorrect ? ' (Correct ✓)' : ' (Incorrect ✗)'}
                            </p>
                            {!isCorrect && (
                              <p>
                                <strong>Correct Answer:</strong> {q.options[q.correct]}
                              </p>
                            )}
                          </div>
                          
                          <p className={styles.correctionExplanation}>
                            <strong>Explanation:</strong> {q.explain}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className={styles.endActions}>
                  {!isPassed && (
                    <Button onClick={handleStartExam} className={styles.retryBtn}>
                      Try Exam Again
                    </Button>
                  )}
                  <button onClick={() => navigate('/exams')} className={styles.closeExamBtn}>
                    Back to Exam Hub
                  </button>
                </div>

              </div>

            </div>
          )}

        </div>
      </main>

      <AppFooter />
    </div>
  );
};

export default ExamCenter;
