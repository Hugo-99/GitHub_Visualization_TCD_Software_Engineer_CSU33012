let getUserData = function (user_name){
    let aPromise = octokit.users.getByUsername({ username: user_name })

    aPromise.then(
    function(result){
        console.log(result.data)
    },
    function(error){
        console.log(error)
    })
}

let run = function (input_name){
    let repoPromise = octokit.repos.listForUser({
        username: usrName
    })

    repoPromise.then(
        function(result){
            console.log(result.data)
        },
        function(error){
            console.log(error)
        })
}

let search = document.getElementById("search_form")
if(search){
    search.addEventListener("submit", theBar => {
        theBar.preventDefault()
        runSearch(document.getElementById("userName").value, (document.getElementById("authToken").value !== "" ? document.getElementById("authToken").value : undefined))
    })
}

let octokit
let input

let runSearch = function (input_name, input_token){
    input = input_name
    if(input_name === null){
        window.location.reload(false)
    }
    else{
        if(input_token !== undefined){
            octokit = Octokit({
                auth: userAuthToken,
                userAgent: 'GitHub API Access and Visualisation'
            });
        }
        else {
            console.log("No Access Token Found! \n Rates will be limited.")
            octokit = Octokit({
                userAgent: 'GitHub API Access and Visualisation'
            });
        }
    }
    run(input)
    getUserData(input)
}
