/* Author: 
    Divesh Kanojia
*/

var
    // selecting login page.
    login = document.querySelectorAll('.login'), 
    // selecting home page.
    home = document.querySelectorAll('.home'),
    // Getting the path location
    pathLocation = document.location.pathname,
    // dir ==> directory
    directory = pathLocation.substring(0, pathLocation.lastIndexOf('/')),
    // Grabbing Logout button class
    logout = document.querySelectorAll('.logout-btn'),
    // selecting club list page.
    clubList = document.querySelectorAll('.club-list'),
    // selecting match details page.
    matchDetails = document.querySelectorAll('.match-details')
     

// Logic for login page
if (login.length) {
    var 
        // Entire login form is selected.
        loginForm = document.querySelector('.login-form');
        // Submit button of from section is selected.
        submit = document.querySelector('.submit input'),
    

    //When the login button is clicked
    submit.onclick = function(e) {
        e.preventDefault();

        var
        userName = document.querySelector('.user-name input'),
        userPassword = document.querySelector('.user-password input'),
        errMsg1 = document.querySelector('.err-msg-1');
        errMsg2 = document.querySelector('.err-msg-2');

        if (userName.value == "user" && userPassword.value == "user") {
            localStorage.setItem('loginDetails', "user");
            window.location.href = directory+"/home.html";
        }
        else {
            loginForm.reset();
            errMsg1.classList.add('err-msg-show');
            errMsg1.innerHTML = "Invalid User Name***";
            errMsg2.classList.add('err-msg-show');
            errMsg2.innerHTML = "Invalid User Password***";
        }
    }

    // Logic for logging in
    login.onload = isChecking();
    //Local Storage checker 
    function isChecking() {
        if(localStorage.hasOwnProperty('loginDetails')) {
            return window.location.href = directory+"/home.html";
        }
    }
}

// Use to restrict the home page 
if (home.length) {
    home.onload = isChecking();
    function isChecking() {
        isIndexChecker();
    }
}

//Ajax / Fetching data for the api
xhr = new XMLHttpRequest();
xhr.open('GET', 'https://raw.githubusercontent.com/openfootball/football.json/master/2019-20/en.1.json');

// xhr data
function getXHRData() {
    data = JSON.parse(xhr.responseText);
    var matches = data.matches;
    var teamNames = [];

    matches.forEach(function(item) {
        teamNames.push(item.team1);
        teamNames.push(item.team2);
    });

    var uniqueTeamName = teamNames.filter(onlyUnique);

    function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    }

    uniqueTeamName.forEach( function(item) {
        clubTeamDropMenu.innerHTML += "<option>" + item + "</option>"
    });
}

// Logic for club page form
if (clubList.length) {

    // Use to restrict the club list page  
    clubList.onload = isChecking();
    function isChecking() {
        isIndexChecker();
    }

    var
        clubTeamDropMenu = document.querySelector('.club-team-drop-list'),
        teamMatchDetails = document.querySelector('.team-match-details'),
        loadMore = document.querySelector('.load-more');

    xhr.onload = function() {
        getXHRData();
    }
    xhr.send();

    clubList.onload = isChecking();
    
    // will push the data in the array
    function isPushingToArray(matches,clubTeamDropMenuChecked,teamMatches) {
        matches.forEach( function(item) {
            if ( item.team1 == clubTeamDropMenuChecked || item.team2 == clubTeamDropMenuChecked ) {
                teamMatches.push({team1: item.team1, team2: item.team2, score1: item.score.ft[0], score2: item.score.ft[1], date: item.date});
            }
        });
    }

    //After Selecting the dropdown
    clubTeamDropMenu.onchange = function(teamMatches) {
        var 
            clubTeamDropMenuData = clubTeamDropMenu.options[clubTeamDropMenu.selectedIndex].innerHTML,
            matches = data.matches,
            teamMatches = [];

        teamMatchDetails.className = 'team-match-details-display';
        var clubTeamDropMenuChecked = clubTeamDropMenuData.replace("&amp;", "&");
        isPushingToArray(matches,clubTeamDropMenuChecked,teamMatches);
        teamMatchDetails.innerHTML = "";

        loadMore.classList.add('load-more-details-display');

        for ( var i = 0; i < 5; i++) {
            teamMatchDetails.innerHTML +="<ul class='club-list-data'><li>" + teamMatches[i].team1 + "</li><li>" + teamMatches[i].score1 + "-" + teamMatches[i].score2 + "</li><li>" + teamMatches[i].team2 + "</li><li>Date: " + teamMatches[i].date + "</li></ul>";
        }
    }

     //To load more
     loadMore.onclick = function(teamMatches) {
        var
            clubTeamDropMenuData = clubTeamDropMenu.options[clubTeamDropMenu.selectedIndex].innerHTML,
            displayedTeamList = document.querySelectorAll('.club-list-data').length,
            matches = data.matches,
            teamMatches = [],
            Length = displayedTeamList + 5;

        clubTeamDropMenuChecked = clubTeamDropMenuData.replace("&amp;", "&");
        // to push the data in the list/array
        isPushingToArray(matches,clubTeamDropMenuChecked,teamMatches);

        if (Length > teamMatches.length) {
            var newLength = displayedTeamList + (Length - teamMatches.length);

            for ( var i = displayedTeamList; i <= newLength; i++ ) {
                teamMatchDetails.innerHTML +="<ul class='club-list-data'><li>" + teamMatches[i].team1 + "</li><li>" + teamMatches[i].score1 + "-" + teamMatches[i].score2 + "</li><li>" + teamMatches[i].team2 + "</li><li>Date: " + teamMatches[i].date + "</li></ul>";
            }

            loadMore.classList.remove("load-more-details-display");
        }
        else {
            for ( var i = displayedTeamList; i < Length; i++ ) {
                teamMatchDetails.innerHTML +="<ul class='club-list-data'><li>" + teamMatches[i].team1 + "</li><li>" + teamMatches[i].score1 + "-" + teamMatches[i].score2 + "</li><li>" + teamMatches[i].team2 + "</li><li>Date: " + teamMatches[i].date + "</li></ul>";
            }
        }
    }

    function isChecking() {
        isIndexChecker();
        
        var
            getUrl = window.location.href,
            url = new URL(getUrl),
            urlParameter = url.search;
            // Regular Expression is used to trim the data
            alteringData1 = urlParameter.replace("?teamname=", "");
            alteringData2 = alteringData1.replace(/%20/g, " ");
            alteredData = alteringData2.replace(/&amp;/g, "&");

        if (alteredData.length) {
            //Loading Details of Matches
            xhr.onload = function() {
                getXHRData();

                var
                    clubTeamDropMenuSelected = clubTeamDropMenu.options,
                    clubTeamDropMenuLength = clubTeamDropMenuSelected.length;

                //
                for(var i = 0; i < clubTeamDropMenuLength; i++) {
                    // clubTeamDropMenuSelected[i].firstChild.data give the team name which has been put into drop menu
                    if (alteredData == clubTeamDropMenuSelected[i].firstChild.data) {
                    
                        clubTeamDropMenu.selectedIndex = i;
                        var
                            clubTeamDropMenuSelected = alteredData,
                            matches = data.matches,
                            teamMatches = [];

                        teamMatchDetails.className = 'team-match-details-display';
                        loadMore.classList.add('load-more-details-display');

                        isPushingToArray(matches,clubTeamDropMenuSelected,teamMatches);

                        teamMatchDetails.innerHTML = "";

                        for ( var i = 0; i < 5; i++) {
                            teamMatchDetails.innerHTML +="<ul class='club-list-data'><li>" + teamMatches[i].team1 + "</li><li>" + teamMatches[i].score1 + "-" + teamMatches[i].score2 + "</li><li>" + teamMatches[i].team2 + "</li><li>Date: " + teamMatches[i].date + "</li></ul>";
                        }
                    }
                } 
            }
        }
    }

}

//Js Script for Match Details page
if (matchDetails.length) {

    matchDetails.onload = isChecking();
    function isChecking() {
        isIndexChecker();
    }
    var 
        matchDetailsDropList = document.querySelector('.match-details-drop-list'),
        matchLists = document.querySelector('.match-lists');

    xhr.onload = function() { 
        data = JSON.parse(xhr.responseText);

        var 
            matchData = [],
            matches = data.matches;

        matches.forEach(function(item) {
            matchData.push(item.round);
        });

        var uniqueMatchData = matchData.filter(onlyUnique);

        function onlyUnique(value, index, self) {
            return self.indexOf(value) === index;
        }

        uniqueMatchData.forEach( function(item, index) {
            matchDetailsDropList.innerHTML += "<option>" + item + "</option>";
        });
    }
    xhr.send();

    matchDetailsDropList.onchange = function() {
        var 
        matchDetailsDropListChecked = matchDetailsDropList.options[matchDetailsDropList.selectedIndex].innerHTML,
        matches = data.matches;

        matchLists.className = "match-lists-display";

        matchLists.innerHTML = "";

        matches.forEach( function(item) {
            if ( item.round == matchDetailsDropListChecked ) {
                matchLists.innerHTML += "<ul class='match-detail-data'><li title='" + item.team1 + "' class='team-name' onclick='dataShare(this)'>" + item.team1 + "</li><li>" + item.score.ft[0] + "-" + item.score.ft[1] + "</li><li title='" + item.team2 + "' class='team-name' onclick='dataShare(this)'>" + item.team2 + "</li><li>Date: " + item.date + "</li></ul>"; 
            }
        });
    }
    function dataShare(teamData) {
        window.location.href = directory+"/clublist.html?teamname=" + teamData.innerHTML;
    }
}

// Logic for logout 
if (home.length || clubList.length || matchDetails.length) {

    var menuIcon = document.querySelector(".hamburger-menu");
    var navbar = document.querySelector(".navigation");

    menuIcon.addEventListener("click", () => {
        navbar.classList.toggle("change");
    });
    //Logic for logging out
    for(i = 0; i < logout.length; i++) {
        logout[i].onclick = function() {
            localStorage.removeItem('loginDetails');
            window.location.href = directory+"/index.html";
        }
    }
}

//Local Storage checker 
function isIndexChecker() {
    if(!localStorage.hasOwnProperty('loginDetails')) {
        return window.location.href = directory+"/index.html";
    }
}
