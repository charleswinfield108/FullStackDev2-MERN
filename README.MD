Charles Winfield Module 7


SET UP AND DEPLOYMENT INSTRUCTIONS


/////////////////////////////////
1. What is the difference between REACT, REACT JS, and REACT NATIVE?

REACT and REACT JS are the the same open-source Javascript Library used for building Interfaces primary for web applicatons.  REACT is the official name give by it developer META.  The JS  is added informally to reference and provide distinction from REACT Native which is a related technology.

REACT (JS), is a platform used to build applications which work in a Web Browser. Mostly USED for Front End Developement.  It is component based, using standard web components and HTML like tags within JSX. It uses stard CSS  for styling libraries like React Router for URL based Navigation.  REACT is ideal for SPA's, Single Page Applications and Complex web Dashboards or any type of projject which may require high performance, dynamic web UI.

REACT NATIVE is a framework for building cross platform applicatinos for IOS and Android. It compiles JAVAScript code into native platform UI componenets and API's like Swift/Objective C for iOS and Java/Kotlin for Android instead of the DOM. REACT Native also uses specific, platform-agnostic components like <view>, <text>, <image>, which  map directly to their native equivalents.  For stlying and navigation it uses JavaScript object-based stylesheet system with a subset of CSS properties(mostly flexbox) and mobile specific navigation libraries like REACT Navigation.  This technology is ideal for mobile app development for iOS and Android.

In essence, REACT is used for web applications and REACT NATIVE is used for mobile applications.



/////////////////////////////////
2. Is REACT a Framework or a Library?  What is the Differennce?

REACT is a Front-End Javascript Library which ius USED for buidling User Interfaces. It manges how UI components are updated and rendered. The difference between a Library and a Framework is the in a library the user is in total control of the appilcations flow.  The USer decides when and where to call the library's functions or methods to perform specific tasks.  As opposed to a framework which dictates the overall flow and structure of the application.  Custom code is accessed by "blnks", or "hooks" provided by the framework.  Frameworks are more rigid than Libraries.

Imagine the library like a toolbox and the framework like a blueprint.



/////////////////////////////////
3. What are the differences between HTML and JSX? Compare and  Contrast

HTML is HyperText MarkUp Language which is primarily used for Static Content and requires script tags for Javascript. HTML is universally understood for browsers.  JSX is an expressive tool for building dynamic and complex user interfaces within the REACT ecosystem, offering 
component based structure and seamless logic intergration.

JSX was created as an extension of Javascript to allows develoipers to write HTML in Javascript.  Technically JSX is Javascript and HTML together. One major difference is that HTML is supported by all browsers but JSX needs a compiler like Babel or Webpack to transiple into 
browsers. Another difference is that you need to return a single parent element is JSX for it to compile.  HTML does not
have that rquirment.



/////////////////////////////////
4. What makes React attractive for our case?
In our case we are front-end and back end developers.  Using REACT saves time in development because of its component-based architecture.  REACT offers robust features which enable the building of scalable, efficient, and maintainable user interfaces. It is flexible and akkiws developers to choose the best accompanying libraries and tools.  Another benit is that its core concepts
are adapted to REACT native which works for mobile app development.



/////////////////////////////////
5. What are some alternative tech stacks?

Here is a list of alternative tech stacks.

-MEVN Stack (MongoDB, Express, Vue.js, Node.js): Uses Vue.js for the frontend instead of React, known for being lightweight and fast.

-MEAN Stack (MongoDB, Express, Angular, Node.js): Replaces React with Angular, offering a more structured, full-featured framework suitable for enterprise-level applications.

-PERN/FERN Stack (PostgreSQL, Express, React/Angular/Vue, Node.js): Replaces MongoDB with PostgreSQL for applications requiring strong relational data management, ACID compliance, and complex queries..

-DERN Stack (DynamoDB, Express, React, Node.js): A serverless alternative replacing MongoDB with AWS DynamoDB for highly scalable, managed database needs.

-Python/Django or FastAPI + React: Ideal for applications requiring heavy computation, data analysis, or machine learning (AI/ML), often faster to develop than Node-based apps for specific backend tasks.

-Go (Golang) + PostgreSQL + React: A modern, high-performance alternative, often chosen for speed and efficiency in building scalable backend services..

-LAMP Stack (Linux, Apache, MySQL, PHP): A classic, stable, and reliable alternative for traditional web applications and e-commerce.


/////////////////////////////////
6. Why is MERN a good choice for full stack development?

The MERN Stack is preferred for web development because it uses Javascript for both Front End and Back End whihch promotes faster development. Node.js is is fast for data intensive apps and MongoDB's document-oriented NoSQL nature allows for fast scalability.
REACT is component based and Express is flexible which leads to faster and greater prototyping. It is an opensource stack which means that it has a large supportive community.


/////////////////////////////////
GITHUB LINKS

Link 1-https://github.com/tjscollins/mern-template.git
Interesting Observation- This Stack is a modified version of the Free Code Camp versions.  It is completely pre-configured for immediately
developing a Full Stack Mern Application.


Link 2-https://github.com/ScaleDynamics/react-mongodb-template.git
Interesting Observation- This template was created by Scale Dynamics which is a company that actually creates apps for the web.  It
manages express automatically which lets the user focus on the MongoDB/Node/React coding.