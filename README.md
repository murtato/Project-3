#Snap This
**A multiplayer photo scavenger hunt game**

This is our 3rd project for General Assembly's [Web Development Immersive](https://generalassemb.ly/education/web-development-immersive) class. This app was created using the MEN Stack (Mongodb, Express, Node) and Websockets (for real time, multiplayer updates).

This game was created with the intention to make organizing scavenger hunts easier. Create a scavenger hunt by adding a series of clues to your game, then invite your friends by sharing a unique code to join. To play, all other players will have to submit photos one at a time for each clue on the list in the order they appear. But before they move on to the next clue, you--as the host--have to accept or reject the photo. At the end of the game, everyone will see all the photos that were taken throughout the game.

This app is currently deployed to Heroku at: [test](google.com)

##About us
This project was created by:
  -AJ Almaguer - [https://github.com/ajalmaguer](https://github.com/ajalmaguer)
  -Brigette Morado - [https://github.com/bmorando](https://github.com/bmorando)
  -Marcos Felix - [https://github.com/Marcos27](https://github.com/Marcos27)
  -Victor Tran - [https://github.com/murtato](https://github.com/murtato)

##Technologies Used
This project was created using Node, Express, and MongoDB

The following node packages were installed:
----------------------------------------

Package    |   Purpose
----        |   -----
ejs         |   Server-side templating. We use this instead of Jade
mongoose    |   Interfaces with MongoDB, creates models and model schemas.
passport    |   Handles authentication
passport-google-oauth20 |   Handles Google oauth
shortid     |   Creates short Mongo document id's, which are used to allow players to easily connect to a game.


The following javascript libraries were also used:
------------------------------------------------

JS Library  | Purpose
----        | ----
masonry.js  | Augments the Bootstrap grid with the ability to fit elements of different heights together into a "pinterest-like" layout.
imagesLoded.js  | Used in conjunction with masonry.js to "relayout" the page into the "masonry" layout only after all images have been loaded.

Entitiy Relationship Diagram
-----------------------------

![erd](https://raw.githubusercontent.com/ajalmaguer/foodtours/master/erd-2.png)


Pivotal Tracker for Food Tours
------------------------------
The project's user stories are documented and managed on pivotal tracker. See the project here: [https://www.pivotaltracker.com/n/projects/1571177](https://www.pivotaltracker.com/n/projects/1571177)

Installation Instructions
==========================
1. Clone the repo from your terminal `git clone https://github.com/ajalmaguer/foodtours.git`
2. Go into the directory and perform the following
  1. Install the gems `bundle install`
  2. Create the database: `rake db:create`
  3. Migrate the database: `rake db:seed`
  4. Run rails server: `rails s`
3. Connect to rails server from the browser. I.e. go to `localhost:3000`
4. To get the file upload working, set up an [Amazon Web Services Account](http://aws.amazon.com/) and save your api key info on your bash profile. Also update your `development.rb` and `production.rb` files. **WARNING: DO NOT PUSH YOUR API KEY INFO TO GITHUB!**


Next Steps
=================
The next steps I'd like to take for this project are as follows:
1. Implement user profiles, which shows a user's own landmarks and tours.
2. Implement "likes" or "following" so that a user can essentially bookmark landmarks and tours onto their own profile.
3. Implement "I ate this" to keep track of which landmarks a user has eaten while embaring on a food tour.
