# PDF viewer coding challenge

## Task road

![image](https://github.com/user-attachments/assets/1b423a02-6289-4839-bcf7-a7c249d5943e)

## Overview

This coding challenge is designed to assess your ability to integrate and manipulate PDFs within a web application. Your task is to create an app with a list of PDFs with specific paragraphs from those PDFs, and a PDF viewer that displays the corresponding page from the selected PDF with the paragraph highlighted.

## Project setup

1. Clone the repository.
2. Install dependencies with `npm install`.
3. Run the Vite dev server with `npm run dev`.

## Requirements

The following requirements are in order of importance:

1. The user should see a list of available PDFs, by name, and associated paragraphs on the left panel of the app.
1. The user should be able to select PDFs, and paragraphs from the PDF. It should be possible to select the PDF _without_ selecting a paragraph; selecting the PDF and selecting the paragraph are two separate actions.
    - Selecting the PDF alone displays the PDF on the right panel of the app, on the first page.
    - Selecting a paragraph displays the PDF, navigating to the page with the paragraph.
1. The user should be able to switch between PDFs, select different paragraphs of the same PDF, and close the PDF panel.
1. The user should see the selected paragraph highlighted in the PDF viewer.

If you feel like any requirements are missing or ambiguous, make an educated assumption for what they could be and we will discuss them at the whiteboard session.

## Additional notes

- The PDFs themselves and the PDF data is located in the [`assets`](./assets) folder, as PDF files and JSON respectively. The PDF data is already loaded in [`app.tsx`](./src/app.tsx).
- Use `react-pdf` as your PDF viewer library (it's already installed and loaded in `app.tsx`).
- You won't be evaluated on the styling of the app; default styles are fine.
- You won't be evaluated on error handling or tests, but you should have an idea of what kinds of errors you would handle, and what you would test.
- The paragraphs will be of varying complexity to find and highlight within the document. Some may span multiple pages.

You might not be able to finish everything today. Prioritize your time effectively; focus on getting the more basic functionality working first and then move to the more complex functionality.

We will start with a quick whiteboarding session to answer open questions, discuss potential solutions, and clarify requirements.

Have fun!
