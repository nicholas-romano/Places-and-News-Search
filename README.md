# Places and News Search 

![Places and News Search](/images/Places-News-Search.png) 

## Description 
This application utilizes the Google Places API and the News API to search for information on specific places, locations, and news articles.  

## Table of Contents 
* [Installation](#installation) 
* [Usage](#usage) 
* [Collaborators](#collaborators) 
* [License](#license) 
* [Tests](#tests) 
* [Questions](#questions) 
 
## Installation 
1.  Navigate to the root folder of the application.  
2.  Right-click the index.html page  
3.  Select Open webpage in a browser.  
 
## Usage 
1.  The user can search for places by keywords, specific locations, company name, type category, and by distance from a particular location. ![Places-Search](/images/Search-Places.png)  
2.  The results returned include the place name, address, and picture, the place’s category type, whether it’s currently open or closed, its rating, and its price level. ![Places-Type-Search-Results](/images/Places-Type-Search-Results.png) 
3.  The News Article search page searches based on keyword and it returns the article title, a picture for the article, a summary description, author, and link to the article page. ![Search-News-Articles-Results](/images/Search-News-Articles-Results.png) 
4.  The Places Search results section also allows the user to view up to ten more photos about a particular place. This section is displayed in an overlay container which can be closed by pressing the X button. ![Photos-Overlay](/images/Photos-Overlay.png) 
5.  Each search result gives the user the option of adding it to their favorites list. Once it is added, the user can then navigate to their favorites page and view the places or articles added. ![Places-Search-Results](/images/Places-Search-Results.png)![Favorite-Place-Added](/images/Favorite-Place-Added.png)![Favorites-List](/images/Favorites-List.png) 
 

## Collaborators 
* Samuel Guevara [github.com/samuelguevara98](https://github.com/samuelguevara98) Developed News API 
* Britt Melia [github.com/meliabt19](https://github.com/meliabt19) Application Design 
  
## License 
There is not a license for this application. 

## Tests 
1.  Test the search capability. Make sure all search criteria are properly being utilized such as testing if the user’s location is applied when the location field is left blank.  Test if the search radius is correct based on either geolocation or location keyword. Test if type category returns relevant results based on selected category. Test to make sure all relevant news articles are returned according to the user’s keyword that was entered.  
2.  Test the add button. After search results are returned, click the add button and make sure that place or article is added to the favorites page. Also, make sure the data was added to the browser’s local storage by refreshing the browser. The favorites items should stay on the page.  
3.  Test the photos button and see if more photos are displayed in an overlay box on the page. Make sure there is an X button that when clicked, closes the photos box successfully.  
 

## Questions 
![GitHub Profile Image](https://avatars.githubusercontent.com/u/6642173?) 

 njr7romano@yahoo.com