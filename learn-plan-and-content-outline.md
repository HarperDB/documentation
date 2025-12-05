# Plan

## Overview

As part of our PLG directive, we're overhauling our documentation to be significantly more user-friendly and self-serviceable for developers.

This issue outlines the documentation restructure for our existing v4.7 documentation, so new and existing developers have a better experience **immediately**.

## Problem

Our documentation has been described as "complete but disorganized". While all the information is there, navigating the docs and finding what you need has been a poor experience particularly for new developers, but also for more experienced ones too. 

The overarching problem of our docs today is that the content is an unorganized mix of guide and reference content. Pages such as the "Developers / Applications / Defining Schemas" is far more of a technical reference for our graphql schema feature than it is a guide to using schemas to build out an API. Moreover, a lot of the guide-like pages, such as the "Developers / Applications / Caching", has gaps in its narrative. It does a great job of introducing some of our custom resource caching concepts, but then never demonstrates how the user can see it in action (such as including network requests to demonstrate cache headers or comparable server logs to show backend work is or isn’t executing).

## Solution

Harper is a complicated project with many incredible features; let's ensure our documentation reflects that. The original idea for the docs structure was for technical reference content to be nested under the “Reference” section, and then for everything else to be more guide-like, narrative pages demonstrating features. The solution presented here is to realign with this original idea.

> This work is primarily focussed on the "Documentation" tab on the docs site. "Release Notes" and "Fabric" will remain unchanged.

The primary goal is overhauling docs to make it absurdly easy to understand Harper, and find value on it. We have three main ways to achieve this:

- Simplifying the docs map/structure, to make it *very easy* to learn the foundational information required to find success
- Introducing a single style/template for all docs to follow that make them
  - Individually useful for devs who prefer to reverse engineer / look up individual concepts
  - Empirically understandable for people mid-journey
- Creating rich and complete code examples for each concept, that build empirically alongside content

Furthermore, we are targeting essentially three separate user personas with the same content.

1. “Get-it-done” Developers - developers who just want to download, execute, and hack around until they figure out as quickly as possible.
2. “Inquisitive” Developers - developers who will take their time to understand the Harper platform, and are willing to work through guides at a slow pace.
3. AI agents - the literal AI agent systems (Claude, ChatGPT, etc.) that are reading our docs either as training context, or by request of a user.

### Additional Goals

1. Ensure the user journey results in developers actually learning how to build a Harper application and use all the amazing feature we have to offer
   - A grand majority of our users are application developers; this needs to be the most prominent and straightforward guide content.
   - All other aspects such as admin/deployment management and plugin development are secondary to the primary path. They are still crucially important details and should be just as represented throughout the docs.
2. Improve content by creating a organizational distinction between narrative-like guides and technical reference pages
3. Less nesting the better in section list. Clear, concise section titles so developers can quickly navigate to pages they believe is relevant to their goal.
   - The search bar is great for finding exactly what you might want, but not necessarily great at the “high level scan” when a developer may not even be sure what they are looking for.
   - Take for example a developer who already knows a little something about Harper. They are building an App and they want to implement a UI. They should be able to quickly find a page related to either “Static File hosting” or “Web Applications” without having to drill into multiple levels of sections (as it is today).
4. Guides should fully demonstrate features end-to-end
5. Guides should be presented in an ordered format building on top of one another
   - They don’t necessarily all have to incrementally implement the same, singular example, but should at a minimum always build on concepts already presented. For example, the caching guide which will likely need schemas and custom resources should come after the guides on schemas and custom resources. 
6. Guides should link to “Additional Resources” such as other guides or relevant reference pages for developers to dig deeper with
7. Technical reference should be consistent and complete
   - We’ve previously considered moving reference docs to the source code repos. This is still a great goal, especially for future v5 documentation. But for current v4 docs we will keep the reference docs within the documentation repo itself. 
8. We should avoid providing guides for features we no longer want to promote. Ex: Fastify routes, SQL, Clustering. These should all still be in the technical reference but we shouldn’t promote via the “blessed” user journey through our docs. 
9.Prioritize AI-assisted development.
   - Content should have appropriate metadata for AI agents
   - Content should work alongside AI dev tools
   - Provide readers with the information they need to get the most out of Harper with the AI development tools they are familiar with
   - Provide prompts, setup instructions, etc.

### Guide Template

> This markdown template is how all of the guide content will be structured in order to maximize cohesiveness.

```md
## <Title>

Introduction paragraph - short, high-level description of what this guide will cover

### What You Will Learn

Include a bulleted list of details of learning outcomes for this guide

## Prerequisites

List of required prior knowledge and any necessary tools.

Should include links to other guides for the prior knowledge.

Not every page needs to list things like "Node.js", but the basic getting-started ones can

Most should have some form of Harper installation requirements such as "Harper CLI" or "Local Harper Installation" or "Harper Fabric Instance"

It could include things like "Clone this repo template/example and run these setup steps"

## <Guide Sub Sections ...>

Include as many sub sections as necessary for the guide itself.

## Additional Resources

Should be the last section and include any additional resources that are relevant to the guide.

This could be like reference docs links, other related guides, and even external links to things.

The guide itself should leverage links as much as possible but this section can be useful for including links that didn't really fit in the content itself.

This could duplicate some links from the Prerequisites section particularly other guides related to this one.

```

### New Content Proposal

This section outlines the new documentation structure as well as the necessary implementation steps needed to achieve it. 

The first major change is to create a new “Learn” tab for all of the new guide content. Every guide will be new content heavily inspired by existing “Documentation” pages. As new “Learn” section guides are created, and pages and sections are removed or reorganized in “Documentation”, eventually “Documentation” will become 100% reference content, and will be renamed “Reference” to match. This whole process will enable us to incrementally update our documentation. 

The second major change is a new version organization strategy. Instead of the minor-version organization, I want to switch to a major-version organization instead. Node.js achieves this well, each major version has its own docs, and then within the content itself, APIs are denoted with the versions they were added/modified/removed in. For example, check out [this part](https://nodejs.org/docs/latest-v24.x/api/fs.html#filehandlereadbuffer-offset-length-position) of the Node.js documentation. This API has a "History" dropdown that contains when it was added and when it was modified.

This pattern of detailing the specific minor/patch version something was added or modified in is useful in both Learn guides and in reference docs. The reference docs would likely look more like the Node.js example does, but Learn guides could also use the pattern in a prose-like fashion instead.

The “Learn” tab will start from all features available in v4.7 since this is the current latest version for our PLG motion.

The “Learn” tab will follow a similar top-level section structure as “Documentation” does today starting with “Getting Started”, followed by “Developers” and “Administration”. It will not use as much nesting, and guides will logically be ordered so that they build on one another, yet remain independently referenceable. New developers can follow through the content like a course, and existing developers can quickly navigate to the exact guide relevant to their needs. This strategy should help us serve both new and experienced developers looking to either learn a Harper concept for the first time or review something they’ve learned before.

So as part of this new “Learn” tab we will immediately move the “Getting Started” section from “Documentation” kick-starting this new section.

The “Documentation” tab (will eventually be renamed “Reference”) will change alongside the new learn guides. Any “Documentation” pages that are currently more guide-like will be moved to “Learn”, and a new reference page will be written for that content. For example, the "Developers / Applications / Caching" page is guide-like. It needs more structure to move to “Learn”, but we also must ensure that the literal APIs and configurations it demonstrates is captured in the relevant reference pages such as the Resource API docs and the GraphQL Schema docs. The goal with reference docs is to be technically complete and accurate. Sections may be nested here, but we should still try to make visual navigation as easy as possible. It is reasonable to expect developers to primarily utilize the search bar to find relevant reference information at first.

# Content Outline

## Learn Outline

> Bolded and underlined are sections (will not have an index page)
> Bolded are individual pages 
> We are intentionally avoiding nesting pages for the guide content for better discoverability. 

- **<u>Getting Started</u>**
  - **Install and Connect Harper**
    - Use existing page https://docs.harperdb.io/docs/getting-started/installation
    - Installation with npm
      - Add more details to CLI installation flow and include callout to other configuration guides/reference
  - **Create Your First Application**
    - Use existing page https://docs.harperdb.io/docs/getting-started/quickstart
    - Currently Covers:
      - Creating tables using GraphQL Schema
      - Running Harper with CLI
      - Expands on schema system with `@sealed` and `@export`
      - REST API basics `/Dog/1`
      - Intro to Authentication
      - REST Querying `/Dog/?breed=Labrador`
      - Deploy to Fabric
    - This page could use more details when it starts introducing new concepts for the first time.
      - Rather than a "Core Concept" page that wouldn't make a lot of sense for a first time Harper developer, this first guide should be defining things like Applications or Plugin as it progresses. Later guides will also continue to define core concepts as they are introduced. This should use information from https://docs.harperdb.io/docs/foundations/harper-architecture and https://docs.harperdb.io/docs/foundations/core-concepts.
    - Align with guide template and including a more structured "What you will learn" and "Additional Resources" sections.
  - **AI Best Practices**
    - This should fit in early and be a relatively simple guide.
    - Focus is on providing some tips for building Harper apps using AI tools.
    - It can include things like prompts and setup instructions
    - Should likely focus on being as general purpose as possible. We don't necessarily want to promote a single or set of AI tools, but we could provide general instructions with actual examples (using our favorite tools) for different types of ai dev tools like in-browser chat apps or ai editors.
    - This is supposed to be general purpose, but also relatively specific to "Harper Application development".
    - Each guide may include additional AI prompt instructions and tips. This guide could provide some level of a baseline

- **<u>Developers</u>**
  - **Key Harper Application Features**
    - More detailed definition for Harper Applications reiterating and emphasizing key concepts from the Getting Started guide.
    - Should recommend users start with Getting Started to become familiar with Harper, and then move on to this section for more detailed guides on specific application development features.
    - Use details from https://docs.harperdb.io/docs/developers/applications, https://docs.harperdb.io/docs/foundations/harper-architecture, and https://docs.harperdb.io/docs/foundations/core-concepts
    - Include a specific section on Applications vs. Extensions/Plugins
    - Should introduce the Operations API and CLI as another means of interacting with Harper
    - Should incorporate Debugging Applications content (https://docs.harperdb.io/docs/developers/applications/debugging)
    - Not too much more info here, more of just another fundamentals page that gets deeper on the stuff already introduced in getting started setting the stage for what is to come.
  - **Defining Databases and Tables**
    - Evolution of https://docs.harperdb.io/docs/developers/applications/defining-schemas and expand on concepts already introduced
    - More interactive examples. Show what happens with different custom directives using curl or Fetch
    - Show how to use relevant Operations APIs (and CLI equivalents) too (`create_table`)
    - Only mention caching details and then link to other content; this page should still remain on the simpler side of things.
    - More in depth data interaction is coming later; for this page continue to use the basic REST apis introduced already.
    - Introduce replication here as a bonus. Make sure in v5 version is stipulates that replication is not available by default in the open source version.
      - Keep this on the lighter side - give enough that an enterprise user will learn valuable stuff, but not too much that it becomes a whole separate guide. More complex info will be incorporated in other guides.
  - **Loading Data**
    - Building off of tables defined in previous page, now demonstrate the effectiveness of the Data Loader plugin and potentially other bulk data loading mechanisms
    - This page will introduce multiple ways to load data but still keeping it simple. There is no or very little concept of auth/roles/perms yet and the next guide will dive deeper into those.
    - Use this as an opportunity to expand on the Harper application lifecycle. Data loader is meant for that initial load and is designed to work through "restarts" – use this as an example to explore and demonstrate Harper restarts. Dig deep on how Harper is meant to be a long running system and developers need to think critically about the lifecycle of their application both during development and when deploying/managing production instances.
    - Focus on interactivity, show the full e2e experience of loading data with the schemas and then querying that data using some of the relatively basic queries introduced thus far (REST/Operations/CLI).
    - The important part is that we are only 4 guides in so far. Users should be getting more familiar with key Harper features, but are still far from "experts" and thus don't need to know absolutely everything about data interaction. Using dataLoader to preload data, and then being familiar enough with basic REST API is good enough for right now. Next few guides will deepen this knowledge.
  - **Users & Roles**
    - Iteration of https://docs.harperdb.io/docs/developers/applications/defining-roles & https://docs.harperdb.io/docs/developers/security/users-and-roles
      - This is already guide-like and then links to the more detailed roles reference
      - I think it needs more depth. It doesn't really explain how roles are relevant to an application developer.
    - Relevant slack thread on purpose of this system (https://harperdb.slack.com/archives/C3Z2T1QAZ/p1764103696112359) that leads into an interesting use case by Fabric CM where in they are using the build-in user authentication system, but then basically overloading the role system for their own needs.
      - This is **not** a pattern we want to document and should actually strictly dictate that the native User & Role system is meant for managing database permissions.
      - (Lets make sure to incorporate this into the guide) From Kris: the guiding limitation is that if you are content with users and roles being an internally defined and structured thing, cool, you can use Harper, but for more control over your user and role schema/structure, build your own.
    - Roles is intertwined with Users (hence the Security page "User & Roles". We likely want to stick to that association and include both topics.
    - Introducing this system should also cover how these roles are enforced *no matter* how users interact with data, and let that segway into other guides, and particularly the next guide, on other ways than using REST to interact with data.
    - The user will know about REST, operations, and CLI by this point - so make sure to cover those again here in context of permissions and what not. Demonstrate expected success and errors.
    - This should have links to security and auth guides.
  - **Querying and Interacting with Data**
    - By this point the developer should be well familiar with the basics to our querying system; at least the REST and corresponding Resource API parts as available through standard database, tables, and role-based permission. This guide should focus on more advanced scenarios now.
    - This will be more of guide on the various logical operations of the querying system and demonstrate more complex queries on more complex sets of data such as related tables and such.
    - It should include query optimization - depending how much content is around this we could just provide some info and have another guide later going deeper
    - Not sure if earlier sections will demonstrate relational data but if not this guide absolutely should
    - Don't forget to demonstrate how querying works for things like computer properties too.
  - **Real Time Data Access Introduction**
    - Demonstrate WebSockets and other forms of real time data access.
    - Show it with basic tables and custom resources
    - Examples might be more complex here, and we could likely include gif or video embeds to show the live interactivity of things.
    - But this guide needs to be on the more simpler side of things; after custom resources, caching, and web apps are introduced there will be opportunity for more complex scenarios (live chat app, etc.)
  - **Custom Resources**
    - Now dig deep on arguably one of the most important features of Harper
    - Can mention caching but link to the dedicated guide(s) for that
    - Build off of Getting Started content and some of the details here: https://docs.harperdb.io/docs/developers/applications
    - Show how requests of various forms all still work with custom resources.
    - Only demo Resource API v2
    - Really show off all the parts of Resource API from both consumer and provider perspective.
    - The example can be trivial but demonstrative. This is a crucially important guide before we get into caching with custom resources.
    - This is the guide that SG has been asking for and Bailey has been kicking off
  - **Web Apps**
    - Start with Static file hosting via static plugin - explain how fundamental this plugin is for app development. It is all you really should need to get started; at least with client side apps.
    - Show an actual example with React and Vite or something.
    - Link out to collection of extra static templates with other frameworks or what not
    - Then introduce more complicated web app development. This is the time to start introducing plugin development (but not an actual plugin guide yet).
    - Show off / explain the web app plugins we have, but focus on demonstrating to the user how to get started *using* these existing plugins and building things like Next.js apps.
    - Discuss the difference between server side code with direct access to Harper resources vs client side code that will need to stick to networking interfaces
    - Ensure there is some info on dev server and deployment here, but then link to more dedicated Administration guide for more details.
  - **Caching Pt 1**
    - Finally, the big kahuna!
    - Now it's time to combine everything learned so far and start building with one of Harper's most complicated features.
    - This will requires schemas, custom resources, and full e2e demonstrative workflows
    - Caching is big and there is a lot to the feature so this will likely span over multiple guides. I don't have a full plan for this yet.
    - The first guide should incorporate the basics like schema directives, lite custom resource implementation, and request patterns to demonstrate caching behavior (Etags, status codes, etc.)
    - Then later parts or additional guides should start working in other key features like external data sources, sourcedFrom, etc.
    - A key example to demo to the user is something like the react-ssr-example https://github.com/HarperFast/react-ssr-example/blob/main/resources.js which does like blog page generation from static data with caching enabled.
    - Can also do a chat app
    - Should do something with AI - likely something like the ecommerce app; generate something with AI using data and then cache those generations so that you don't run up AI usage.
  - **Data with Replication**
    - https://docs.harperdb.io/docs/developers/replication/sharding
    - Replication was only briefly introduced earler in the guides. Depending how much info is included in that, we may need a separate guide like this around a more complex scenario.
      - Even if the previous guide covered a majority of replication, having something dedicated will be useful so we can go deeper on it.
    - It likely will need to link to another guide on the administration side of things and it should include some helpful utility scripts for local setup.
    - This guide will need some info about availability in v5
  - **Plugin Development**
    - This guide will be a bit standalone and should work through the new plugin api
    - it should go deep on plugin and application lifecycle
    - it should demonstrate restart request process

- **<u>Administration</u>**
  - **Running Harper Locally**
    - For v5 Split this between installation and "from source"
    - For v4 just focus on installation
    - Demonstrate multiple installs
    - Share useful scripts for setup and teardown
    - Share useful configuration tricks and defaults for development vs production
  - **Running Harper in a Container**
    - Specialized guide on containerized Harper
    - will be similar to previous but can include whatever else is relevant for containerization like ensuring ports are forwarded and stuff like that.
  - **Fabric!!!!!!!**
    - Likely take some content from Fabric docs and have a dedicated learn guide here for using fabric.
    - Can also be more developer focussed now and demonstrate whats possible with a fabric instance - like deploying from CLI
    - UI-based docs can remain in the Fabric section of the docs
  - **Manual / Local Replication Setup**
    - There are at least two developer-based guides for replication so far, so having something dedicated for replication setup will be good
    - Remember to include feature support details for this in v5
  - **Logging**
    - Iteration of pages https://docs.harperdb.io/docs/administration/logging
    - Logging is a pretty fundamental feature for harper; this page should show the user how to configure and use logging
    - It can start simple and get more advanced
    - Include info on rotating and other advanced things - maybe even integration with DataDog or other 3rd party log consumers (though we might want to have individual guides for this someplace else)
    - Make sure that we have structured refrence docs for logging features, apis, and configuration.
  - **Analytics & Grafana Plugin**
    - Use this guide to dive deep into understanding Harper analytics features and likely use grafana as a key demo. similar to logging; could keep the 3rd party tool interactions for other content elsewhere
  - **Certificate Management & Verification**
    - Iteration of https://docs.harperdb.io/docs/developers/security/certificate-management & https://docs.harperdb.io/docs/developers/security/certificate-verification
    - May need to review more intamitely but these pages seem to be more reference like to me than an actual usage guide.
    - I expect this guide to actual work through setting things up and then demonstrating how it works for things like requests using popular networking mechanisms (fetch or curl).
    - Could be multiple separate guides depending on complexity.
  - **Security Configuration**
    - Similar to previous; we should more thoroughly walk through how setting up CORS or SSL impacts the runtime of a Harper instance
    - Use actual request examples
  - **Compaction**
    - Iteration of https://docs.harperdb.io/docs/administration/compact
    - Again, include full example with requests and all. don't need to explain schemas or data loading (link to those guides), but can use them for purpose of example
  - **Jobs**
    - Iteration of https://docs.harperdb.io/docs/administration/jobs
    - Actually demonstrate these operations in action using full examples.

## Reference Content Changes

As the high-level plan describes, the existing “Documentation” tab is going to remain in-place as new “Learn” content is produced. As the new “Learn” content is created, we will modify, move, or remove content with “Documentation” so that it aligns more with the guide/reference split. Eventually we will rename “Documentation” to “Reference”. Furthermore, we will eventually pull out some, most, or all of the reference content into the source repo; but we shouldn’t block improving the docs as they are today for that future effort. 

While a lot of existing Reference content will remain in place, we will iterate heavily on the nesting and collocation of information. For a while the reference docs had nothing nested until we expanded the Components docs heavily. Then we consolidated Resource Class docs into a nested section, and most recently moved over the NATS Clustering and SQL Guide docs into Reference too. The point is, we will likely continue this pattern and try to logically organize certain reference docs into subsections.

Any content within this section should be deeply technical. It should have examples too but doesn’t need to be as interactive as the Learn content. It will likely be linked to from individual Learn guides. These pages do not need to follow any sort of strict template. 

This section should be used to event document features we don’t necessarily want to promote. We still have customers building with fastify or writing SQL queries; this section should include those docs too even if we don’t mention those patterns in Learn. 
