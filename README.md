# PolCon

We live in very uncertain and turbulant times. We need to be prepared for the worst and be able to handle the best. The only thing that has the power to change our futures is our ability to vote.
It is important that we make sure that we choose the right person to lead us to the future.

In my opinion the best way to judge a person is to look at their past actions and see whether they were able to uphold their promises.

PolCon is a web application that helps you to just that with a simple and easy to use interface which allows us to see these political figures for what they truely are and make an informed voting decision.

## Problem that I am trying to solve

During elections people are often asked to vote for a politician, but they are often not sure which politician is the best one to vote for because of the lack of information about their past.
Acquiring this information usually takes hours of research which discourages most people from looking for the information at all.
This leads people following the words of their politicians blindly and often vote for the wrong person.

Polcon does all the heavy lifting for you so you don't have to spend time and energy researching the information and gives you the information you need to make an informed decision.

## How to use PolCon

1. Visit the url = https://pol-con.vercel.app/.
2. Enter the name of the political figure you want to research in the input field.
3. Click on the "Get Information" button.
4. Wait for the information to load.
5. Read the information and make an informed decision.

## Technologies Used

### Frontend

#### Next.js

Next.js is a powerful React framework that supports server-side rendering (SSR), static site generation (SSG), and API routes out of the box. This results in faster load times, better SEO, and an overall improved user experience. It's ideal for performance-critical web apps.

#### TailwindCSS

TailwindCSS is a utility-first CSS framework that allows developers to design UIs directly within their markup using predefined utility classes. This approach improves development speed, ensures design consistency, and eliminates the need for writing custom CSS for every component.

#### React.js

React provides a component-based architecture that makes it easy to create reusable UI components. Its virtual DOM and reactive state updates help in building interactive, efficient, and scalable interfaces. React is also widely adopted and well-supported by the community.

#### TypeScript

TypeScript adds static typing to JavaScript, helping catch errors early in development. It improves code readability and maintainability in larger projects by enforcing contracts within the code, which is especially helpful in team collaborations and refactoring.

#### Vercel

Vercel is the official deployment platform for Next.js, offering zero-configuration hosting with global CDN support. It enables continuous deployment, preview environments for every push, and quick rollbacks. Vercel is perfect for deploying modern, fast, and reliable frontend apps.

### Backend

#### Python

Python is known for its simplicity, readability, and rich ecosystem of libraries. It's great for rapid backend development and is also well-suited for integrating machine learning and natural language processing capabilities later in the project.

#### FastAPI

FastAPI is a modern, asynchronous web framework designed for building APIs with Python. It offers automatic OpenAPI documentation, high performance comparable to Node.js and Go, and supports Python type hints for data validation, which improves both development and debugging.

#### Pydantic

Pydantic is used with FastAPI to validate and serialize incoming data based on Python type annotations. This ensures that API inputs and outputs are consistent and safe, reducing the chances of runtime errors and improving data handling efficiency.

#### Docker

Docker containerizes the backend, making it portable across environments. It ensures that the app runs the same way in development, testing, and production. Docker also simplifies deployment and scaling, which is essential for cloud-native applications.

#### Toolhouse AI Agents

Toolhouse AI Agents provide powerful natural language processing capabilities to analyze and extract contradictions from political statements. They enable the system to process and present complex information in an easily understandable format.

#### Google Cloud

Google Cloud provides scalable infrastructure, managed services, and robust security. It supports deploying Docker containers, automates infrastructure management, and offers built-in monitoring/logging. It's an ideal choice for hosting production-ready APIs with global access and high availability.

## How to the app locally

- Clone the repository: `git clone https://github.com/SplinterSword/PolCon.git`
- Navigate to the project directory: `cd PolCon`

### Frontend

1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`

### Backend

1. Navigate to the backend directory: `cd backend`
2. Install dependencies: `pip install -r requirements.txt`
3. Start the development server: `uvicorn main:app --reload`

## Contributing

If you have any suggestions or feedback, please don't hesitate to [open an issue](https://github.com/SplinterSword/PolCon/issues) or [create a pull request](https://github.com/SplinterSword/PolCon/pulls).