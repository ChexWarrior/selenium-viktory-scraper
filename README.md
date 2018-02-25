# Log Scraper

## Usage
This test suite is intended to be run with selenium-grid in a containerized format.  

### Setting up and tearing down the Grid
To setup the container network, selenium hub and firefox node run this script:
```bash
./setup.sh start
```
To remove the grid setup run:
```bash
./setup.sh stop
```

### Running Development Code
To run the development code in a dockerized environment simply execute the follwing in project root: 
```bash
./run.sh "$VIKTORY_GAME_ID"
```
The selenium grid must be setup for this to run successfully.


## Useful Links
* [NodeJS Selenium API](https://seleniumhq.github.io/selenium/docs/api/javascript/index.html)
* [Selenium Grid Documentation](http://docs.seleniumhq.org/docs/07_selenium_grid.jsp)
* [Games By Email](http://gamesbyemail.com/)
* [Viktory II](https://www.viktorygame.com/)
