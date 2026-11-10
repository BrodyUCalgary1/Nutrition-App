### November 4th 2026

**Created**

- Initialized the Project
- Opened the expo template and searched around the downloaded files. Started early implementation of nutrition calculations, inputs and user outputs.
- Created the index tsx, nutrition input, and nutriton utils

**Learned**

- How tech stacks work and the importance of their implementation when coding.
- how to setup the tech stacks, specifically Expo, Node and TypeScript. While what ive learnt is quite basic. It is still fundemenatal for future development.

---

### November 5th 2026

**Created**

- Implementation of multiple food saves. Instead of only being able to update one food at a time the program now allows users to input multiple food values and change the goals accordingly.
- Created Nutrition Goals to keep track of those inputs and how to return it. Built by Copying Nutrition Inputs and changing the variables
  to how I see fit

**Learned**

- How to troubleshoot expo and how to use it on my phone to load the program remotly
- Learnt a little about the functionality of onsave, setState and usestate
- How to use some basic JS methods such as .map and .reduce
- Learnt how to format a README haha

---

### November 6th 2026

**Created**

- Added error functionality and stop the user from entering zeros, negatives, letters where numbers should be and nothing at all
- Created DEVLOG to seperate from README

**Learned**

- Learnt that usestate can be used for more that just user input, but also error messages, loading and etc
- Understanding the Code a lot more. Specifically how handleSubmit works and how the error messages fit in to the code.
- Starting to use AI less as a tool that builds 100% of the project and getting more hands on after starting to understand typescipt more and more.

---

### November 6/7th 2026

**Created**

- Each food now is able to deleted and edited
- Async Storage for data saves
- Created UseEffect to stop data from being overridden if it hasnt been fully loaded yet.

**Learned**

- Understanding of Typescript is growing. Learning => method
- Starting to understand how each block works individually and how it adds to the total compinent of the game
- Learnt how to use Async functions, specifically await and asyc
- Why JSON data is important and how to parse it and stringify data.
- Learnt Try/Catch method to help with errors in async.

---

### November 8th 2026

**Created**

- Program now tracks daily food and alltime foods seperatly
- Created a search bar that allows you to add the searched item into your daily foods. It searches from alltime foods. Items can be removed from this list
- uses UUID and dates to seperate each food
- the output should now only show todays foods
- Changed the visuals so that the text changes with the users colorscheme

**Learned**

- learnt a little about the crypto function and its implementation with UUID
- using the dates as a method to sort from todays list from yesterdays or the days before
- Learnt the usage of colorschems and the expo method for it. As well as its implementation in the code to dynamically update the visuals
- I learnt that I HATE styling. AI can take over there.

---

### November 9th 2026

**Created**

- User is now able to scan through past days and see their food trackers from that day.
- Changed the datas from isostring to local user data
- moved the returns into their own files to clean up the index.tsx a little

**Learned**

- The importance of props. Switching to multiple files helped me understand the importance of props a lot more than before
- How useful it is to keep things in seperate files and neat. Using prettier and multiple files really helped make the code alot easier to process

---

### November 10th 2026

**Created**

- Fixed bug with the search bar closing before you could click add or delete ( just delayed its closing)
- added expo camera and barcode search to pull product barcodes
- added Product Lookup which uses the openfoodfacts api to get the calories,name,protiens,carbs,fats etc

**Learned**

- Debugging is important, if i hadnt debugged at the start of today I probably would have never noticed that error
- a little about expo camera and how it can read barcodes
- I already had past experience with API's, so this was more of a refresher. however i think this is one of my biggest milestones so far!
