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

let octokit
let input

let runSearch = function (input_name, input_token){
    input = input_name
    if(input_name == null){
        window.location.reload(false)
    }
    else{
        if(input_token != undefined){
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
    getUserData(input)
}
